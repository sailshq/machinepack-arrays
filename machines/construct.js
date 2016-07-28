module.exports = {


  friendlyName: 'Construct array',


  description: 'Construct an array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array to build.',
      example: ['==='],
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'New array',
      outputDescription: 'A new array.',
      like: 'array'
    }

  },


  fn: function(inputs, exits) {

    // Simply return the input array through the `success` exit.
    return exits.success(inputs.array);

  }

};
