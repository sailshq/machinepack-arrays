module.exports = {


  friendlyName: 'Sort by...',


  description: 'Sort an array of dictionaries by a particular key.',


  sync: true,


  cacheable: true,


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


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      like: 'array'
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    return exits.success(_.sortBy(inputs.array, inputs.key));
  }



};
