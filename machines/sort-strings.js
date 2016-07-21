module.exports = {


  friendlyName: 'Sort (strings)',


  description: 'Sort an array of strings alphabetically (A to Z).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array of strings to sort.',
      example: ['Roger Wilco'],
      required: true
    }

  },


  exits: {

    success: {
      outputExample: ['Roger Wilco'],
      outputFriendlyName: 'Sorted array',
      outputDescription: 'The resulting array after sorting by ascending value.'
    },

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.sort());
  },



};
