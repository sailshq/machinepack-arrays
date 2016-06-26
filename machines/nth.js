module.exports = {


  friendlyName: 'Get [n]th item',


  description: 'Look up an item from the array at the specified index.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array containing the desired item.',
      example: ['*'],
      required: true
    },

    index: {
      friendlyName: 'Look up index',
      description: 'The index of the item to be gotten.',
      example: 2,
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notFound: {
      friendlyName: 'Not found',
      description: 'The array doesn\'t have an item at the specified index.'
    },

    success: {
      description: 'Returns the item at the specified index within the array.',
      itemOf: 'array',
      outputFriendlyName: 'Nth array item',
      outputDescription: 'The item of the array at the specified index.'
    },

  },


  fn: function (inputs,exits) {

    var foundItem = inputs.array[inputs.index];
    if (typeof foundItem === 'undefined') {
      return exits.notFound();
    }
    return exits.success(foundItem);
  },



};
