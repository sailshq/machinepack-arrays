module.exports = {


  friendlyName: 'Get last item',


  description: 'Look up the last item in an array.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array containing the desired item.',
      example: ['*'],
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notFound: {
      description: 'The array is empty, so it doesn\'t have any items.',
    },

    success: {
      description: 'Returns the last item in the array.',
      itemOf: 'array'
    },

  },


  fn: function (inputs,exits) {

    if (inputs.array.length===0) {
      return exits.notFound();
    }
    return exits.success(inputs.array[inputs.array.length-1]);

  },



};
