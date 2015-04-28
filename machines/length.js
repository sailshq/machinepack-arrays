module.exports = {


  friendlyName: 'Count items',


  description: 'Get the length of the provided array.',


  extendedDescription: '',


  inputs: {

    array: {
      typeclass: 'array',
      description: 'The array of items to pick from',
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
      example: 32
    },

  },


  fn: function (inputs,exits) {
    return exits.success();
  },



};
