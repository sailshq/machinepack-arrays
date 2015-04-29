module.exports = {


  friendlyName: 'Count items',


  description: 'Get the length of the provided array.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array to count',
      typeclass: 'array',
      description: 'The array of items to count',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      example: 32
    }

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.length);
  },


};
