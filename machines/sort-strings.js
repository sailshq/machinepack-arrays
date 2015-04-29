module.exports = {


  friendlyName: 'Sort (strings)',


  description: 'Sort an array of strings alphabetically (A to Z)',


  extendedDescription: '',


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array of strings to sort.',
      example: ['Roger Wilco'],
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Returns the sorted array.',
      example: ['Roger Wilco']
    },

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.sort());
  },



};
