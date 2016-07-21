module.exports = {


  friendlyName: 'Get last item',


  description: 'Look up the last item in an array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array containing the desired item.',
      example: ['*'],
      required: true
    }

  },


  exits: {

    notFound: {
      friendlyName: 'Empty array',
      description: 'The array was empty, so it doesn\'t have any items.',
    },

    success: {
      outputFriendlyName: 'Last item',
      outputDescription: 'The last item in the array.',
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
