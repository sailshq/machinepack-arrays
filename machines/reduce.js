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

    // iteratee: {
    //   description: 'The machine to run on each item in the array.',
    //   extendedDescription: 'Expects machine to have a single (typeclass: "*") input called "value", and two exits: "success" and "error".',
    //   typeclass: 'machine',
    //   required: true
    // },


    initialValue: {
      friendlyName: 'Initial value',
      description: 'The initial value for the accumulated result (final result must have a compatible type!)',
      extendedDescription: 'Note that the final accumulated result must have a compatible type!',
      typeclass: '*',
      required: true
    },

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
        return inputs.initialValue;
      }
    }

  },


  fn: function (inputs,exits) {
    var async = require('async');

    // // Get the name of the first input to the iteratee
    // // TODO: replace this with "typeclass: machine" type checking
    // if (!inputs.iteratee.inputs || typeof inputs.iteratee.inputs !== 'object') {
    //   return exits.error('Iteratee misconfigured: no inputs object found');
    // }
    // var iterateeInputs = Object.keys(inputs.iteratee.inputs);
    // if (iterateeInputs.length === 0) {
    //   return exits.error('Iteratee misconfigured: inputs object empty');
    // }

    var Machine = require('machine');

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
    var resultSoFar = inputs.initialValue;

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
          example: inputs.initialValue
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
      fn: function starkify(iterateeInputs, iterateeExits){
        // TODO: do something important
        return iterateeExits.success(
          iterateeInputs.resultSoFar +
          (
            (iterateeInputs.index===iterateeInputs.lastIndex) ?
              'and ' + iterateeInputs.item :
              iterateeInputs.item + ', '
          ));
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

      // Build up input configuration for iteratee
      var iterateeInputVals = {};
      iterateeInputVals['index'] = currentIndex;
      iterateeInputVals['lastIndex'] = inputs.array.length-1;
      iterateeInputVals['item'] = item;
      iterateeInputVals['resultSoFar'] = resultSoFar;


      // Execute iteratee machine
      iteratee(iterateeInputVals).exec({

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
