module.exports = {


  friendlyName: 'Pluck',


  description: 'List the values of a particular key from an array of dictionaries.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array of dictionaries to iterate over.',
      example: [{}],
      required: true
    },

    key: {
      friendlyName: 'Key to pluck',
      description: 'The property to pluck from each dictionary.',
      example: 'id',
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
          return [inputs.array[0][inputs.key]];
        }
        return;
      }
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');

    return exits.success(_.pluck(inputs.array, inputs.key));
  }



};
