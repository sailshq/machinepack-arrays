module.exports = {


  friendlyName: 'Get [n]th item',


  description: 'Look up an item from the array at the specified index.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array containing the desired item.',
      example: ['==='],
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

    success: {
      itemOf: 'array',
      outputFriendlyName: 'Nth array item',
      outputDescription: 'The item of the array at the specified index.'
    },

    notFound: {
      description: 'The array doesn\'t have an item at the specified index.'
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
