module.exports = {


  friendlyName: 'Map array',


  description: 'Iterate over each item of an array to build a new transformed array.',


  extendedDescription: 'Unlike the native Javascript `.map()` function, the Map machine is not guaranteed to return an array with the same length as the input.  This is due to the availability of the `skip` exit in the iteratee, which allows for skipping an array item completely.  See also the "Each" and "Reduce" machines.',


  moreInfoUrl: 'http://node-machine.org/machinepack-arrays/map',


  inputs: {

    array: {
      description: 'The array to loop over.',
      example: ['==='],
      required: true
    },

    resultExemplar: {
      friendlyName: 'Example result',
      description: 'An example of what the final result array will look like.',
      example: ['==='],
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
          success: {
            friendlyName: 'Next item',
            description: 'Continue to next item, or if there are no more items, stop.',
            itemOf: 'resultExemplar',
            outputFriendlyName: 'Transformed item',
            outputDescription: 'The result of running the current item through the iteratee machine.'
          },
          skip: {
            friendlyName: 'Skip item',
            description: 'Skip to next item, or if there are no more items, stop.',
            extendedDescription: 'If the `skip` exit is used, then the length of the Map machine\'s output array will be shorter than the length of the input array.'
          },
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

    // Import `lodash` and `async`.
    var _ = require('lodash');
    var async = require('async');

    // Use either `async.map` (parallel) or `async.mapSeries` (series).
    var iteratorFn = inputs.series ? async.mapSeries : async.map;

    // `numIterationsStarted` will track the number of iterations
    // which have been at least started being processed by the iteratee.
    var numIterationsStarted = 0;

    // Track the index of all iterations which trigger the `exclude` exit.
    var excludedIndices = [];

    // Get an array of the input array indices (an array of numbers starting
    // with zero and ending with array length - 1).
    var indices = _.keys(inputs.array);

    // Start iterating using the selected `async` function.
    // We iterate over indices instead of the items themselves to avoid
    // parallel execution throwing off our `index` iteratee input.
    iteratorFn(indices, function enumerator(currentIndex, next) {

      // Get the array item corresponding to the current index.
      var item = inputs.array[currentIndex];

      // Increment iterations counter.
      numIterationsStarted++;

      // Execute iteratee machine using generic input configuration.
      inputs.iteratee({
        index: currentIndex,
        lastIndex: inputs.array.length-1,
        item: item
      }).exec({

        // Catchall (error) exit:
        // Implies that we should stop early and consider
        //  the entire operation a failure, including all iterations
        //  so far. `map` will call its error exit.
        error: function (err){
          // Return an error through the `next` callback for the enumerator.
          // This will include any output sent by the iteratee through its
          // call to `exits.error()`, defaulting "Unexpected error occurred while running machine."
          return next(err);
        },

        // Exclude (skip item) exit:
        // Implies that we should exclude this item from the result set,
        // and continue onto the next item.
        skip: function (){
          // Make note that we're skipping this index, since we'll have
          // to remove the `undefined` value that will be inserted there
          // when we call `next`.
          excludedIndices.push(currentIndex);
          // Call the `next` callback to continue iterating.
          next();
        },

        // Default (success) exit:
        // Implies that we should add the specified output from the iteratee
        // to the mapped array and continue iterating.
        success: function enumeratee(output){
          // Call the `next` callback with a `null` first argument (indicating no errors)
          // and the desired value for this index of the array as the second argument.
          return next(null, output);
        }
      });
    }, function (err, transformedArray){

      // If the iteratee called its `error` exit, or some other error was thrown,
      // return through the `error` exit of `map`.
      if (err) {
        return exits.error(err);
      }

      // If any indices were skipped by calling the `skip` iteratee exit,
      // make a list of non-skipped array indices, and then make an array
      // out of the values at those indices.
      if (excludedIndices.length > 0) {
        var retainedIndices = _.difference(indices, excludedIndices);
        // _.at returns the values of `transformedArray` at the indices
        // specified by the `retainedIndices` array.
        transformedArray = _.at(transformedArray, retainedIndices);
      }

      // Return the "mapped" array through the `success` exit.
      return exits.success(transformedArray);
    });
  },


};
