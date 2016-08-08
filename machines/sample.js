module.exports = {


  friendlyName: 'Pick random array item',


  description: 'Randomly select one item from an array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      example: ['==='],
      description: 'The array of items to pick from.',
      required: true
    }

  },


  exits: {

    success: {
      itemOf: 'array',
      outputFriendlyName: 'Random array item',
      outputDescription: 'A random item selected from the array.'
    },

    emptyArray: {
      description: 'The provided array has no items.'
    },

  },


  fn: function(inputs, exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // If the array is empty, return through the `emptyArray` exit.
    if (inputs.array.length === 0) {
      return exits.emptyArray();
    }

    // Otherwise use the Lodash `_.sample()` function to get a
    // random item out of the input array and return it through
    // the `success` exit.
    return exits.success(_.sample(inputs.array));
  }

};
