module.exports = {


  friendlyName: 'Get item in array',


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
      extendedDescription: 'Must be a non-negative integer.',
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
      description: 'The input array had no item at the specified index.',
      extendedDescription: 'This indicates that the specified index was out of bounds (larger than the array size).'
    },


  },


  fn: function (inputs,exits) {

    // If an invalid index is given, return through the `error` exit.
    if (inputs.index < 0 || Math.floor(inputs.index) !== inputs.index) {
      return exits.error(new Error('Index must be a non-negative integer.'));
    }

    // If the index is out of bounds (larger than the array), return
    // through the `notFound` exit.
    if (inputs.index >= inputs.array.length) {
      return exits.notFound();
    }

    // Return the item at the specified index through the `success` exit.
    return exits.success(inputs.array[inputs.index]);

  },



};
