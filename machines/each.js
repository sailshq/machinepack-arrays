module.exports = {


  friendlyName: 'Each',


  description: 'Run some logic (the "iteratee") once for each item of an array.',


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
        provides: {
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
          }
        },
        expects: {
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
            description: 'Continue to next item, or if there are no more items, stop.'
          }
        },
      },
      required: true
    },

    series: {
      description: 'Whether to run iteratee on one item at a time (in series)',
      extendedDescription: 'By default, all items are run at the same time (in parallel)',
      example: false,
      defaultsTo: false
    }

  },


  exits: {

    success: {
      description: 'Done.'
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    var async = require('async');

    // Use either `async.each` (parallel) or `async.eachSeries` (series)
    var iteratorFn = inputs.series ? async.eachSeries : async.each;

    // `haltEarly` is a flag which is used in the iterations
    // below to indicate that all future iterations should be skipped.
    var haltEarly = false;

    // `numIterationsStarted` will track the number of iterations
    // which have been at least started being processed by the iteratee.
    var numIterationsStarted = 0;

    // Start iterating...
    iteratorFn(inputs.array, function enumerator(item, next) {

      // Increment iterations counter and track current index
      var currentIndex = numIterationsStarted;
      numIterationsStarted++;

      // If the `each` loop has already been halted, just skip
      // this iteration (which effectively means skipping all future iterations)
      if (haltEarly) {
        return next();
      }

      // Execute iteratee machine using generic input configuration
      inputs.iteratee({
        index: currentIndex,
        lastIndex: inputs.array.length-1,
        item: item
      }).exec({

        // Catchall (error) exit
        // (implies that we should stop early and consider
        //  the entire operation a failure, including all iterations
        //  so far. `each` will call its error exit.)
        error: function (err){
          return next(err);
        },

        // Halt exit
        // (implies that we should stop, performing no further
        //  iterations; but that past iterations are ok.
        //  `each` will call its success exit)
        halt: function (){
          haltEarly = true;
          return next();
        },

        // Default (success) exit
        // (implies that we should continue iterating)
        success: function enumeratee(){
          return next();
        }
      });
    }, function (err){
      if (err) {
        return exits.error(err);
      }
      return exits.success();
    });
  },


};
