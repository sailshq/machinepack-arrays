module.exports = {


  friendlyName: 'Sort array by custom rank',


  description: 'Sort an array by a rank calculated by an anonymous machine.',


  extendedDescription: 'Note that the _rank_ of an array item will not necessarily equate with that item\'s _index_ in the final sorted array.  Rather, the final array will be _sorted by rank_, so that items with lower ranks appear before items with higher ranks.',


  inputs: {

    array: {
      description: 'The array to sort.',
      example: ['==='],
      required: true
    },

    iteratee: {
      friendlyName: 'Sorting machine',
      description: 'The anonymous machine used to calculate the sorting rank for an item.',
      example: '->',
      contract: {
        inputs: {
          item: {
            friendlyName: 'Current item',
            description: 'The current item in the array.',
            itemOf: 'array' // same type as the items of the `array` input of the calling machine
          }
        },
        exits: {
          success: {
            outputExample: 123,
            outputFriendlyName: 'Rank',
            outputDescription: 'The rank calculated for the current array item.',
          }
        },
      },
      required: true
    }

  },


  exits: {

    success: {
      like: 'array',
      outputFriendlyName: 'Sorted array',
      outputDescription: 'The resulting array after sorting by ascending score.'

    },

  },


  fn: function(inputs, exits) {

    // Import `lodash` and `async`.
    var _ = require('lodash');
    var async = require('async');

    // Loop through the array, mapping each value to a score.
    async.map(inputs.array, function scorer(value, nextItem) {
      // Run the scoring machine.
      inputs.iteratee({item: value}).exec({
        // If we got a score for this value, continue to the next.
        success: function(score) {return nextItem(null, score);},
        // Otherwise bail out by calling `nextItem` with the error.
        error: nextItem
      });
    }, function doneScoring(err, scores) {
      // If an error occurred in the scoring, return through
      // the `error` exit.
      if (err) {return exits.error(err);}
      // Use Lodash's `sortBy` function to sort by the custom score.
      var sortedArray = _.sortBy(inputs.array, function(val, index) { return scores[index]; });
      // Return the sorted array through the `success` exit.
      return exits.success(sortedArray);
    });
  },



};
