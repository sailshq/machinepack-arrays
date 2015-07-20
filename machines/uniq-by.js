module.exports = {


  friendlyName: 'Remove duplicate dictionaries',


  description: 'Build a duplicate-free version of an array of dictionaries, judging uniqueness based on a particular key.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array of dictionaries to remove duplicates from.',
      example: [{}],
      required: true
    },

    key: {
      friendlyName: 'Unique key',
      description: 'The key to use when determining uniqueness.',
      example: 'id',
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns a duplicate-free version of the array.',
      friendlyName: 'then',
      like: 'array'
    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    var set = _.uniq(inputs.array, false, inputs.key);
    return exits.success(set);
  }

};
