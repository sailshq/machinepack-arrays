module.exports = {


  friendlyName: 'Sort numbers',


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
      outputFriendlyName: 'Sorted numbers',
      outputDescription: 'The resulting array after sorting by ascending value.'

    },

  },


  fn: function(inputs, exits) {

    // Sort the array in ascending order and return the result through
    // the `success` exit.
    return exits.success(inputs.array.sort(function compareNumbers(a, b) {
      return a - b;
    }));
  },



};
