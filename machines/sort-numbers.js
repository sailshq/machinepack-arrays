module.exports = {


  friendlyName: 'Sort (numbers)',


  description: 'Sort an array of numbers (ascending).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array of numbers to sort.',
      example: [2],
      required: true,
    }

  },


  exits: {

    success: {
      outputExample: [2],
      outputFriendlyName: 'Sorted array',
      outputDescription: 'The resulting array after sorting by ascending value.'

    },

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.array.sort(function compareNumbers(a, b) {
      return a - b;
    }));
  },



};
