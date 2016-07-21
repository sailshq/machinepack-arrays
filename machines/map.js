module.exports = {


  friendlyName: 'Map',


  description: 'Iterate over each item of an array to build a new transformed array.',

  extendedDescription: 'Unlike the native Javascript `.map()` function, the Map machine is not guaranteed to return an array with the same length as the input.  This is due to the availability of the `skip` exit in the iteratee, which allows for skipping an array item completely.',

  moreInfoUrl: 'http://node-machine.org/machinepack-arrays/map',

  inputs: {

    array: {
      description: 'The array to loop over.',
      example: ['*'],
      required: true
    },

    resultExemplar: {
      friendlyName: 'Example result',
      description: 'An example of what the final result array will look like.',
      example: ['*'],
      isExemplar: true
    },

    iteratee: {
      description: 'The transformation to run for each item in the array.',
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
          skip: {
            friendlyName: 'Skip item',
            description: 'Skip to next item, or if there are no more items, stop.',
            extendedDescription: 'If the `skip` exit is used, then the length of the Map machine\'s output array will be shorter than the length of the input array.'
          },
          success: {
            friendlyName: 'Next item',
            description: 'Continue to next item, or if there are no more items, stop.',
            itemOf: 'resultExemplar',
            outputFriendlyName: 'Transformed item',
            outputDescription: 'The result of running the current item through the iteratee machine.'
          }
        },
      },
      required: true
    },

    series: {
      friendlyName: 'One item at a time?',
      description: 'Whether to run iteratee on one item at a time (in series).',
      extendedDescription: 'By default, all items are run at the same time (in parallel)',
      example: false,
      defaultsTo: false
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Mapped array',
      outputDescription: 'A modified copy of the provided array.',
      like: 'resultExemplar'
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

    // Track the index of all iterations which trigger the `exclude` exit.
    var excludedIndices = [];

    // Start iterating...
    var indices = _.keys(inputs.array);
    iteratorFn(indices, function enumerator(currentIndex, next) {

      // We iterate over indices instead of the items themselves to avoid
      // parallel execution throwing us off.
      var item = inputs.array[currentIndex];

      // Increment iterations counter
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

        // Exclude (skip item) exit
        // (implies that we should exclude this item from the result set)
        exclude: function (){
          excludedIndices.push(currentIndex);
          next();
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

      // Remove items that were skipped above.
      if (excludedIndices.length > 0) {
        var retainedIndices = _.difference(indices, excludedIndices);
        transformedArray = _.at(transformedArray, retainedIndices);
      }

      return exits.success(transformedArray);
    });
  },


};
