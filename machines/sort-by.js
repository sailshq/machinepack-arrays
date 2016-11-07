module.exports = {


  friendlyName: 'Sort dictionaries by key',


  description: 'Sort an array of dictionaries by a particular key.',


  sync: true,


  sideEffects: 'cacheable',


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

    success: {
      like: 'array',
      outputFriendlyName: 'Sorted dictionaries',
      outputDescription: 'The resulting array after sorting by the specified key.'

    }

  },


  fn: function (inputs,exits) {

    // Import `Lodash`.
    var _ = require('lodash');

    // Sort the array of dictionaries by the given key and return the result
    // through the `success` exit.
    return exits.success(_.sortBy(inputs.array, inputs.key));
  }



};
