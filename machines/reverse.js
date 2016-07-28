module.exports = {


  friendlyName: 'Reverse array',


  description: 'Build a new array which is an exact clone of an existing array, but in reverse order.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array to reverse.',
      example: ['==='],
      required: true
    }

  },

  exits: {

    success: {
      like: 'array',
      outputFriendlyName: 'Reversed array',
      outputDescription: 'The result of reversing the input array.'
    }

  },


  fn: function (inputs,exits) {

    // Reverse the array and send the result through the `success` exit.
    return exits.success(inputs.array.reverse());
  }



};
