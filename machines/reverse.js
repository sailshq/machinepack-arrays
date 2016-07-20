module.exports = {


  friendlyName: 'Reverse',


  description: 'Build a new array which is an exact clone of an existing array, but in reverse order.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array to reverse.',
      example: ['*'],
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
    return exits.success(inputs.array.reverse());
  }



};
