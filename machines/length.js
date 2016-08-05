module.exports = {


  friendlyName: 'Count items in array',


  description: 'Get the length of the provided array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'Array to count',
      example: ['==='],
      description: 'The array of items to count.',
      required: true
    }

  },


  exits: {

    success: {
      outputExample: 32,
      outputFriendlyName: 'Array length',
      outputDescription: 'The length of the array.'
    }

  },


  fn: function (inputs,exits) {

    // Return the array length through the `success` exit.
    return exits.success(inputs.array.length);

  },


};
