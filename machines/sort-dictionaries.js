module.exports = {


  friendlyName: 'Sort (dictionaries)',


  description: 'Sort an array of dictionaries by a particular key.',


  extendedDescription: '',


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array to sort.',
      example: [{}],
      required: true
    },

    key: {
      friendlyName: 'Sort by...',
      description: 'The shared key to sort by.',
      example: 'createdAt',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      getExample: function(inputs, env) {
        if (Array.isArray(inputs.array) && inputs.array.length) {
          return [inputs.array[0]];
        }
      }
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    return exits.success(_.sortBy(inputs.array, inputs.key));
  }



};
