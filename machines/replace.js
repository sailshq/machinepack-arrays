module.exports = {


  friendlyName: 'Replace array item',


  description: 'Replace the item located at the specified index and return the result (a new array).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array where the new item should be inserted.',
      example: ['==='],
      required: true
    },

    index: {
      friendlyName: 'Replace at (index)',
      description: 'The index of the item to replace.',
      extendedDescription: 'Must be a non-negative integer.',
      example: 1,
      required: true
    },

    value: {
      friendlyName: 'New value',
      description: 'The new value to replace the old one with.',
      example: '===',
      required: true
    }

  },


  exits: {

    success: {
      like: 'array',
      outputFriendlyName: 'Array with replaced item',
      outputDescription: 'The resulting array after replacing the specified item.'

    },

    invalidIndex: {
      description: 'The specified index was not a non-negative integer.'
    },


    notFound: {
      friendlyName: 'Index out of bounds',
      description: 'The array does not have enough items for anything to exist at the specified index.',
    },

  },


  fn: function (inputs,exits) {

    // If an invalid index is given, return through the `error` exit.
    if (inputs.index < 0 || Math.floor(inputs.index) !== inputs.index) {
      return exits.error('Index must be a non-negative integer.');
    }

    // If the array is too small to accomodate the specified index, return
    // through the `notFound` exit.  Note that it is acceptable to specify
    // an index at the _end_ of the array; for example an index of 4 for
    // an array with length 3.
    if (inputs.array.length < inputs.index) {
      return exits.notFound();
    }

    // Replace the item in the array.
    inputs.array.splice(inputs.index, 1, inputs.value);

    // Return the resulting array through the `success` exit.
    return exits.success(inputs.array);

  },



};
