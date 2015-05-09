module.exports = {


  friendlyName: 'Reduce',


  description: 'Run each item of an array through a given machine (the "iteratee") and accumulate a result.',


  extendedDescription: '',


  inputs: {

    array: {
      description: 'The array to loop over',
      typeclass: 'array',
      required: true
    },

    //  ----------------------------------------------------------------------------
    // |  Really, just passing in an implementation here-- the usage should be set  |
    //  ----------------------------------------------------------------------------
    //
    // iteratee: {
    //   description: 'The machine to run on each item in the array.',
    //   extendedDescription: 'Expects machine to have a single (typeclass: "*") input called "value", and two exits: "success" and "error".',
    //   typeclass: 'machine',
    //   required: true
    // },


    resultExample: {
      friendlyName: 'Example result',
      description: 'An example of what the final accumulated result will look like.',
      extendedDescription: 'The type of the final result must be compatible with the initial value, as well as the partial result provided to the iteratee during each iteration.',
      typeclass: '*',
      required: true
    },

    initialValue: {
      friendlyName: 'Initial value',
      description: 'The initial value for the accumulated result (defaults to the empty version of the provided "Result example")',
      extendedDescription: 'Note that the final accumulated result must have a compatible type!',
      typeclass: '*'
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

    // // Get the name of the first input to the iteratee
    // // TODO: replace this with "typeclass: machine" type checking
    // if (!inputs.iteratee.inputs || typeof inputs.iteratee.inputs !== 'object') {
    //   return exits.error('Iteratee misconfigured: no inputs object found');
    // }
    // var iterateeInputs = Object.keys(inputs.iteratee.inputs);
    // if (iterateeInputs.length === 0) {
    //   return exits.error('Iteratee misconfigured: inputs object empty');
    // }

    var initialValue;
    if (!_.isUndefined(inputs.initialValue)) {
      initialValue = inputs.initialValue;
    }
    else {
      // TODO: determine empty value for `inputs.exampleResult` and use that for `initialValue`.
      return exits.error(new Error('`initialValue` is currently required (will eventually be optional)'));
    }

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

    // `resultSoFar` will hold the result accumulated across
    // multiple calls to `inputs.iteratee`.
    var resultSoFar = initialValue;

    // A quick ad-hoc iteratee for development purposes
    // (actual input is disabled)
    // var iteratee = inputs.iteratee;
    var iterateeDef = {
      inputs: {
        item: {
          typeclass: '*'
        },
        index: {
          example: 3
        },
        lastIndex: {
          example: 3
        },
        resultSoFar: {
          example: initialValue
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
      fn: function (iterateeInputs, iterateeExits){

        // For now, this is hard-coded to just `starkify()` stuff.
        //
        // Given an array something like this:
        // [{"name": "arya"}, {"name": "rob"}, {"name": "jon"}, {"name": "sansa"}]
        var starks = iterateeInputs.resultSoFar;
        var thisStark = iterateeInputs.item;
        thisStark.name = thisStark.name.slice(0,1).toUpperCase() + thisStark.name.slice(1) + ' Stark';
        starks.push(thisStark);
        return iterateeExits.success(starks);
      }
    };

    // Construct the iteratee machine instance from the def
    var iteratee = Machine.build(iterateeDef);

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
