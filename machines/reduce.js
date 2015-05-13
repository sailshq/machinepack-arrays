module.exports = {

  //
  // Under active development.
  //
  // To test:
  // machinepack exec reduce --initialValue='""' --resultExample='"aryarob"' --iteratee='function (inputs,exits){return exits.success(inputs.resultSoFar+(inputs.index>0?" ":"")+inputs.item.name);}' --array='[{"name":"arya"}, {"name":"rob"}]'
  //


  friendlyName: 'Reduce',


  description: 'Run each item of an array through a given machine (the "iteratee") and accumulate a result.',


  extendedDescription: '',


  inputs: {

    array: {
      description: 'The array to loop over',
      example: ['*'],
      required: true
    },

    iteratee: {
      description: 'The logic to run on each item in the array.',
      example: '*',
      contract: { // the interface
        provides: {
          item: {
            itemOf: 'array' // same type as the items of the `array` input of the calling machine
          },
          index: {
            example: 3
          },
          lastIndex: {
            example: 3
          },
          resultSoFar: {
            like: 'resultExample' // same type as the `resultExample` input of the calling machine
          },
        },
        expects: {
          error: {},
          halt: {},
          success: {
            like: 'resultExample' // same type as the `resultExample` input of the calling machine
          },
        },
      },
      required: true
    },

    resultExample: {
      friendlyName: 'Example result',
      description: 'An example of what the final accumulated result will look like.',
      extendedDescription: 'The type of the final result must be compatible with the initial value, as well as the partial result provided to the iteratee during each iteration.',
      example: '*',
      required: true
    },

    initialValue: {
      friendlyName: 'Initial value',
      description: 'The initial value for the accumulated result (defaults to the empty version of the provided "Result example")',
      extendedDescription: 'Note that the final accumulated result must have a compatible type!',
      example: '*'
    },

    // Series should pretty much always be enabled...
    // (consider removing this option)
    series: {
      description: 'Whether to run iteratee on all items in series (one at a time) vs. in parallel (all at the same time)',
      extendedDescription: 'Be careful if you disable this input-- make sure you are actually OK with your iteratee being run on each item of the array in a completely arbitrary order. Also release that consequently, the order that your result will accumulate in is impossible to predict.',
      example: true,
      defaultsTo: true
    },

  },


  exits: {

    success: {
      friendlyName: 'then',
      description: 'Done.',
      getExample: function (inputs){
        return inputs.resultExample;
      }
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    var async = require('async');
    var Machine = require('machine');

    // Get the instantiated machine (todo: pull into core)
    var iteratee = buildLambdaMachine(inputs.iteratee, {inputs: inputs});

    // `initialValue` is the initial value that will be accumulated into
    var initialValue;
    if (!_.isUndefined(inputs.initialValue)) {
      initialValue = inputs.initialValue;
    }
    else {
      // Determine base/empty value for `inputs.resultExample` and use that for `initialValue`.
      var baseVal = Machine.build({sync: true, inputs: {}, exits: {success: {example: inputs.resultExample}}, fn: function (inputs,exits){exits.success();} }).execSync();
      initialValue = baseVal;
    }

    // `resultSoFar` will hold the result accumulated across
    // multiple calls to `inputs.iteratee`.
    var resultSoFar = initialValue;

    // Use either `async.each` (parallel) or `async.eachSeries` (series)
    var iteratorFn = inputs.series ? async.eachSeries : async.each;

    // `haltEarly` is a flag which is used in the iterations
    // below to indicate that all future iterations should be skipped.
    var haltEarly = false;

    // `numIterationsStarted` will track the number of iterations
    // which have been at least started being processed by the iteratee.
    var numIterationsStarted = 0;

    // `numIterationsSuccessful` will track the number of iterations
    // which were successfully completed by the iteratee.
    var numIterationsSuccessful = 0;


    // Start iterating...
    iteratorFn(inputs.array, function enumerator(item, next) {

      // Increment iterations counter and track current index
      var currentIndex = numIterationsStarted;
      numIterationsStarted++;

      // If the `reduce` loop has already been halted, just skip
      // all future iterations.
      if (haltEarly) {
        return next();
      }

      // Execute iteratee machine using generic input configuration
      iteratee({
        index: currentIndex,
        lastIndex: inputs.array.length-1,
        item: item,
        resultSoFar: resultSoFar
      }).exec({

        // Catchall (error) exit
        // (implies that we should stop early and consider
        //  the entire operation a failure, including all iterations
        //  so far. `reduce` will call its error exit.)
        error: function (err){
          return next(err);
        },

        // Halt exit
        // (implies that we should stop, performing no further
        //  iterations; but that past iterations are ok.
        //  `reduce` will call its success exit)
        halt: function (){
          haltEarly = true;
          return next();
        },

        // Default (success) exit
        // (implies that we should continue iterating)
        success: function enumeratee(_resultSoFar){

          // Track this successful iteration
          numIterationsSuccessful++;

          // Keep track of accumulated result so far
          resultSoFar = _resultSoFar;

          // Next item
          return next();
        }
      });
    }, function (err){
      if (err) {
        return exits.error(err);
      }
      return exits.success(resultSoFar);
    });
  }


};





function buildLambdaMachine(lambda, parentMachine){

  var _ = require('lodash');
  var Machine = require('machine');

  // Parse the provided lambda input value
  var fn;
  if (_.isFunction(lambda)){
    fn = lambda;
  }
  else if (_.isString(lambda)){
    try {
      eval('fn='+lambda);
    }
    catch (e){
      return exits.error('Could not parse usable function from provided `iteratee` string. Details:\n'+e.stack);
    }
  }
  else {
    return exits.error(new Error('invalid lambda (`->`) - must be a function'));
  }

  // Build up the machine definition
  var lambdaDef = {
    inputs: {
      item: {
        example: parentMachine.inputs.array.length>0 ? parentMachine.inputs.array[0] : '*',
        required: true
      },
      index: {
        example: 3,
        required: true
      },
      lastIndex: {
        example: 3,
        required: true
      },
      resultSoFar: {
        example: parentMachine.inputs.resultExample,
        required: true
      }
    },
    exits: {
      error: {},
      halt: {},
      success: {
        getExample: function (iterateeInputs){
          return resultSoFar;
        }
      }
    },
    fn: fn
  };

  // Construct and return the machine instance
  return Machine.build(lambdaDef);

}
