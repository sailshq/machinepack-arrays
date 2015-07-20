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


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      like: 'array'
    }

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.reverse());
  }



};
