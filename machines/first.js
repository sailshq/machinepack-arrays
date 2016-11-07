module.exports = {


  friendlyName: 'Get first array item',


  description: 'Look up the first item in an array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array containing the desired item.',
      example: ['==='],
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'First array item',
      outputDescription: 'The first item in the array.',
      itemOf: 'array'
    },

    notFound: {
      friendlyName: 'Empty array',
      description: 'The array was empty, so it doesn\'t have any items.',
    },


  },


  fn: function (inputs,exits) {

    // If the array is empty, return through the `notFound` exit.
    if (inputs.array.length===0) {
      return exits.notFound();
    }

    // Otherwise return the first item in the array through the `success` exit.
    return exits.success(inputs.array[0]);

  },



};
