module.exports = {


  friendlyName: 'Sort (numbers)',


  description: 'Sort an array of numbers (ascending)',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array of numbers to sort.',
      example: [2],
      required: true,
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Returns the sorted array.',
      example: [2]
    },

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.array.sort(function compareNumbers(a, b) {
      return a - b;
    }));
  },



};
