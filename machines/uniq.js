module.exports = {


  friendlyName: 'Remove duplicates',


  description: 'Build a duplicate-free version of an array.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      description: 'The array to remove duplicates from.',
      example: ['*'],
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns duplicate-free version of array.',
      friendlyName: 'then',
      like: 'array'
    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    return exits.success(_.uniq(inputs.array));
  }

};
