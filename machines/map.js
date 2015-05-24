module.exports = {


  friendlyName: 'Map',


  description: 'Iterate over each item of an array to build a new transformed array.',


  inputs: {

    array: {
      description: 'The array to loop over',
      example: ['*'],
      required: true
    },

    itemExample: {
      friendlyName: 'Example item',
      description: 'An example of what each item in the array will look like after the mapping.',
      example: '*',
      required: true
    },

    iteratee: {
      friendlyName: 'Iteratee',
      description: 'The transformation to run for each item in the array.',
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
          success: {
            friendlyName: 'next item',
            description: 'Continue to next item, or if there are no more items, stop.',
            like: 'itemExample'
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
      description: 'Done.',
      getExample: function (inputs, env){
        return [inputs.itemExample];
      }
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    var async = require('async');

    // Use either `async.map` (parallel) or `async.mapSeries` (series)
    var iteratorFn = inputs.series ? async.mapSeries : async.map;

    // `numIterationsStarted` will track the number of iterations
    // which have been at least started being processed by the iteratee.
    var numIterationsStarted = 0;

    // Start iterating...
    iteratorFn(inputs.array, function enumerator(item, next) {

      // Increment iterations counter and track current index
      var currentIndex = numIterationsStarted;
      numIterationsStarted++;

      // Execute iteratee machine using generic input configuration
      inputs.iteratee({
        index: currentIndex,
        lastIndex: inputs.array.length-1,
        item: item
      }).exec({

        // Catchall (error) exit
        // (implies that we should stop early and consider
        //  the entire operation a failure, including all iterations
        //  so far. `map` will call its error exit.)
        error: function (err){
          return next(err);
        },

        // Default (success) exit
        // (implies that we should continue iterating)
        success: function enumeratee(output){
          return next(null, output);
        }
      });
    }, function (err, transformedArray){
      if (err) {
        return exits.error(err);
      }
      return exits.success(transformedArray);
    });
  },


};
