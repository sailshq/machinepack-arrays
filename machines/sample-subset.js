module.exports = {


  friendlyName: 'Pick random array subset',


  description: 'Randomly select an unordered subset of the array.',


  extendedDescription: 'Note that even if "Subset size" is 1, an array will still be returned (as opposed to the Pick random item" machine which always returns a single value).  Also note that the subset will never contain duplicate items unless there are duplicates in the input array; that is, once an item is randomly chosen from the input array to be part of the new subset, it will not be chosen again.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      example: ['==='],
      description: 'The array of items to pick from.',
      required: true
    },

    size: {
      friendlyName: 'Subset size',
      example: 2,
      description: 'The number of items to pick out of the array.',
      required: true
    }

  },


  exits: {

    success: {
      like: 'array',
      outputFriendlyName: 'Random array subset',
      outputDescription: 'A random subset selected from the array.'
    },

    emptyArray: {
      description: 'The provided array has no items.'
    },

    notEnoughItems: {
      description: 'The input array was not large enough to produce a subset of the specified size.'
    }

  },


  fn: function(inputs, exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // If the array is empty, return through the `emptyArray` exit.
    if (inputs.array.length === 0) {
      return exits.emptyArray();
    }

    // If the requested size is larger than the array, return through the `notEnoughItems` exit.
    if (inputs.array.length < inputs.size) {
      return exits.notEnoughItems();
    }

    // Otherwise use the Lodash `_.sample()` function to get an array
    // of `inputs.size` length, comprised of random items from the
    // input array, and return it through the `success` exit.
    return exits.success(_.sample(inputs.array, inputs.size));
  }

};
