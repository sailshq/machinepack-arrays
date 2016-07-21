module.exports = {


  friendlyName: 'Pick random item',


  description: 'Randomly select one item from an array.',


  sync: true,


  inputs: {

    array: {
      example: ['*'],
      description: 'The array of items to pick from.',
      required: true
    }

  },


  exits: {

    emptyArray: {
      description: 'The provided array has no items.'
    },

    success: {
      itemOf: 'array',
      outputFriendlyName: 'Random item',
      outputDescription: 'A random item selected from the array.'

    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    if (inputs.array.length === 0) {
      return exits.emptyArray();
    }
    return exits.success(_.sample(inputs.array));
  }

};
