module.exports = {


  friendlyName: 'Pick random subset',


  description: 'Randomly select an unordered subset of the array.',


  extendedDescription: 'Note that even if "Subset size" is 1, an array will still be returned (as opposed to the Pick random item" machine which always returns a single value)',


  sync: true,


  inputs: {

    array: {
      example: ['*'],
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

    emptyArray: {
      description: 'The provided array has no items.'
    },

    success: {
      like: 'array',
      outputFriendlyName: 'Random subset',
      outputDescription: 'A random subset selected from the array.'

    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    if (inputs.array.length === 0) {
      return exits.emptyArray();
    }
    return exits.success(_.sample(inputs.array, inputs.size));
  }

};
