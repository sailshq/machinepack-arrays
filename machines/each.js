module.exports = {


  friendlyName: 'For each array item...',


  description: 'Run some logic (the "iteratee") once for each item of an array.',


  extendedDescription: 'This machine does not return any value.  For similar machines that return values, see "Map" and "Reduce".',


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
          }
        },
        exits: {
          success: {
            friendlyName: 'Next item',
            description: 'Continue to next item, or if there are no more items, stop.'
          },
          halt: {
            friendlyName: 'Break',
            description: 'Everything is ok, but stop iterating and skip over all remaining items.'
          }
        },
      },
      required: true
    },

    series: {
      friendlyName: 'One item at a time?',
      description: 'Whether to run iteratee on one item at a time (in series).',
      extendedDescription: 'By default, all items are run at the same time (in parallel).',
      example: false,
      defaultsTo: false
    }

  },

  fn: function (inputs,exits) {

    // Import `lodash` and `async`.
    var _ = require('lodash');
    var async = require('async');

    // Use either `async.each` (parallel) or `async.eachSeries` (series).
    var iteratorFn = inputs.series ? async.eachSeries : async.each;

    // `haltEarly` is a flag which is used in the iterations
    // below to indicate that all future iterations should be skipped.
    var haltEarly = false;

    // `numIterationsStarted` will track the number of iterations
    // which have been at least started being processed by the iteratee.
    var numIterationsStarted = 0;

    // Start iterating using the selected `async` function...
    iteratorFn(inputs.array, function enumerator(item, next) {

      // Increment iterations counter and track current index.
      var currentIndex = numIterationsStarted;
      numIterationsStarted++;

      // If the `each` loop has already been halted, just skip
      // this iteration (which effectively means skipping all future iterations
      // since haltEarly will never be returned to `false`).
      if (haltEarly) {
        return next();
      }

      // Execute iteratee machine using generic input configuration.
      inputs.iteratee({
        index: currentIndex,
        lastIndex: inputs.array.length-1,
        item: item
      }).exec({

        // Catchall (error) exit:
        // Implies that we should stop early and consider
        //  the entire operation a failure, including all iterations
        //  so far. `each` will call its error exit.
        error: function (err){
          // Return an error through the `next` callback for the enumerator.
          // This will include any output sent by the iteratee through its
          // call to `exits.error()`, defaulting to "Unexpected error occurred while running machine."
          return next(err);
        },

        // Halt exit:
        // Implies that we should stop, performing no further
        //  iterations; but that past iterations are ok.
        //  `each` will call its success exit.
        halt: function (){
          // Set the flag indicating that the iteratee request halting `each`.
          haltEarly = true;
          // Call the `next` callback to continue iterating over the array.
          // Since the `haltEarly` flag is set, future iterations will just
          // immediately return.
          return next();
        },

        // Default (success) exit:
        // Implies that we should continue iterating.
        success: function enumeratee(){
          // Call the `next` callback to continue iterating over the array.
          return next();
        }
      });
    }, function (err){

      // If the iteratee called its `error` exit, or some other error was thrown,
      // return through the `error` exit of `each`.
      if (err) {
        return exits.error(err);
      }

      // Otherwise return through the `success` exit.
      return exits.success();
    });
  },


};
