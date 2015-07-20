module.exports = {


  friendlyName: 'Reduce',


  description: 'Run some logic (the "iteratee") once for each item of an array, accumulating a single result.',


  inputs: {

    array: {
      description: 'The array to loop over',
      example: ['*'],
      required: true
    },

    iteratee: {
      friendlyName: 'Iteratee',
      description: 'The function to run for each item in the array.',
      example: '->',
      contract: {
        inputs: {
          item: {
            friendlyName: 'Current item',
            description: 'The current item in the array.',
            itemOf: 'array' // same type as the items of the `array` input of the calling machine
          },
          index: {
            friendlyName: 'Current index',
            description: 'The index of the current item in the array.',
            example: 3
          },
          lastIndex: {
            friendlyName: 'Last index',
            description: 'The index of the last item in the array.',
            example: 3
          },
          resultSoFar: {
            friendlyName: 'Result so far',
            description: 'The result which has been accumulated so far',
            like: 'initialValue' // same type as the `initialValue` input of the calling machine
          },
        },
        exits: {
          error: {
            friendlyName: 'break with error',
            description: 'Something went wrong- stop iterating and skip over all remaining items.'
          },
          halt: {
            friendlyName: 'break',
            description: 'Everything is ok, but stop iterating and skip over all remaining items.'
          },
          success: {
            friendlyName: 'next item',
            description: 'Continue to next item, or if there are no more items, stop.',
            like: 'initialValue' // same type as the `initialValue` input of the calling machine
          }
        },
      },
      required: true
    },

    resultExemplar: {
      friendlyName: 'Example result',
      description: 'An example of what the final accumulated result will look like.',
      extendedDescription: 'The type of the final result must be compatible with the initial value, as well as the partial result provided to the iteratee during each iteration.',
      like: 'initialValue',
      isExemplar: true
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
      friendlyName: 'One item at a time?',
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
      outputDescription: 'The accumulated result value.',
      like: 'initialValue'
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    var async = require('async');
    var rttc = require('rttc');
    var Machine = require('machine');


    // `initialValue` is the initial value that will be accumulated/folded "into".
    var initialValue;
    if (!_.isUndefined(inputs.initialValue)) {
      initialValue = inputs.initialValue;
    }
    else {
      // If `resultExemplar` is set, determine base/empty value for its type
      // and use that for `initialValue`.
      if (!_.isUndefined(inputs.resultExemplar)) {
        initialValue = rttc.getBaseVal(inputs.resultExemplar);
      }
      // Otherwise, use `null`.
      else {
        initialValue = null;
      }
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
      inputs.iteratee({
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

