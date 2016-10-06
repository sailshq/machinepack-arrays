module.exports = {


  friendlyName: 'Reduce array',


  description: 'Run some logic (the "iteratee") once for each item of an array, accumulating a single result.',


  extendedDescription: 'See also the "Each" and "Reduce" machines.',


  inputs: {

    array: {
      description: 'The array to loop over.',
      example: ['==='],
      required: true
    },

    iteratee: {
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
            description: 'The index of the last item in the array.',
            example: 3
          },
          resultSoFar: {
            description: 'The result which has been accumulated so far.',
            like: 'initialValue' // same type as the `initialValue` input of the calling machine
          },
        },
        exits: {
          success: {
            friendlyName: 'Next item',
            description: 'Continue to next item, or if there are no more items, stop.',
            like: 'initialValue', // same type as the `initialValue` input of the calling machine
            outputFriendlyName: 'Transformed result',
            outputDescription: 'The accumulated result after running the current item through the iteratee machine.'
          },
          halt: {
            friendlyName: 'Break',
            description: 'Everything is ok, but stop iterating and skip over all remaining items.',
            like: 'initialValue', // same type as the `initialValue` input of the calling machine
            outputFriendlyName: 'Final result',
            outputDescription: 'The final result to return.'
          },
        },
      },
      required: true
    },

    /******* WHY WE NEED BOTH `initialValue` and `resultExemplar` ******/
    /*******  (since we always forget and think we can drop one)  ******/
    //
    // Sometimes, you want to start with an initial value, e.g. the
    // number 99.  Obviously you can't use `resultExemplar` for that.
    // But sometimes, you want to start with an empty array, and you
    // want the _end result_ to be an array of numbers.  You can't set
    // `initialValue` to an array with a number in it, since you want
    // to start with an empty array.  You need `resultExemplar` in that
    // case.  The confusion comes from the fact that you rarely (maybe
    // never?) need to actually use _both_ of these inputs at the same
    // time.  But you almost always need one or the other.
    //
    /////////////////////////////////////////////////////////////////////

    resultExemplar: {
      friendlyName: 'Example result',
      description: 'An example of what the final accumulated result will look like.',
      extendedDescription: 'The type of the final result must be compatible with the initial value, as well as the partial result provided to the iteratee during each iteration.',
      isExemplar: true
    },

    initialValue: {
      description: 'The initial value for the accumulated result.',
      extendedDescription: 'Note that the final accumulated result must have a compatible type!',
      example: '*'
    },

    series: {
      friendlyName: 'One item at a time?',
      description: 'Whether to run iteratee on all items in series (one at a time) vs. in parallel (all at the same time).',
      extendedDescription: 'Be careful if you disable this input-- make sure you are actually OK with your iteratee being run on each item of the array in a completely arbitrary order. Also realize that consequently, the order in which your result will accumulate in is impossible to predict.',
      example: true,
      defaultsTo: true
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Result of reduce',
      outputDescription: 'The accumulated result value.',
      like: 'initialValue'
    }

  },


  fn: function (inputs,exits) {

    // Import `lodash` and `async`.
    var _ = require('lodash');
    var async = require('async');

    // Import `rttc`.
    var rttc = require('rttc');


    // `initialValue` is the initial value that will be accumulated/folded "into".
    var initialValue;

    // Use the provided input value if available.
    if (!_.isUndefined(inputs.initialValue)) {
      initialValue = inputs.initialValue;
    }

    // Otherwise, try to get a base value from the result exemplat input.
    else {
      // If `resultExemplar` is set, determine base/empty value for its type
      // and use that for `initialValue`.  For example, if the result exemplar
      // is [123] (an array of numbers) this will set the initial value to
      // [] (an empty array).  This provides a convenience for the end user.
      if (!_.isUndefined(inputs.resultExemplar)) {
        initialValue = rttc.getBaseVal(inputs.resultExemplar);
      }
      // Otherwise, use `null` for the initial value.  Note that other machine inputs
      // that are "like" initialValue will in this case use `*` as their exemplar,
      // since it is the example value for the `initialValue` input.
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


    // Start iterating using the selected `async` function.
    iteratorFn(inputs.array, function enumerator(item, next) {

      // Increment iterations counter and track current index
      var currentIndex = numIterationsStarted;
      numIterationsStarted++;

      // If the `each` loop has already been halted, just skip
      // this iteration (which effectively means skipping all future iterations
      // since haltEarly will never be returned to `false`).
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

        // Catchall (error) exit:
        // Implies that we should stop early and consider
        //  the entire operation a failure, including all iterations
        //  so far. `reduce` will call its error exit.
        error: function (err){
          // Return an error through the `next` callback for the enumerator.
          // This will include any output sent by the iteratee through its
          // call to `exits.error()`, defaulting "Unexpected error occurred while running machine."
          return next(err);
        },

        // Halt exit:
        // Implies that we should stop, performing no further
        //  iterations; but that past iterations are ok.
        //  `reduce` will call its success exit.
        halt: function (_finalResult){
          // Set the flag indicating that the iteratee request halting `each`.
          haltEarly = true;

          // Set `resultSoFar` to what has been chosen as the final result.
          resultSoFar = _finalResult;

          // Call the `next` callback to continue iterating over the array.
          // Since the `haltEarly` flag is set, future iterations will just
          // immediately return.
          return next();
        },

        // Default (success) exit:
        // Implies that we should continue iterating.
        success: function enumeratee(_resultSoFar){

          // Track this successful iteration.
          numIterationsSuccessful++;

          // Keep track of accumulated result so far.
          resultSoFar = _resultSoFar;

          // Call the `next` callback to continue iterating over the input.
          return next();
        }
      });
    }, function (err){

      // If the iteratee called its `error` exit, or some other error was thrown,
      // return through the `error` exit of `reduce`.
      if (err) {
        return exits.error(err);
      }

      // Return the final accumulated value through the `success` exit.
      return exits.success(resultSoFar);
    });
  }

};

