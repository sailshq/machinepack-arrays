module.exports = {


  friendlyName: 'Insert item in array',


  description: 'Insert or append an item and return the result (a new array).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array where the new item should be inserted.',
      example: ['==='],
      required: true
    },

    index: {
      friendlyName: 'Insert at (index)',
      description: 'The index to insert the new item at.',
      extendedDescription: 'Must be a non-negative integer.',
      example: 1,
      required: true
    },

    value: {
      friendlyName: 'New item',
      description: 'The new item to insert into the array.',
      example: '===',
      required: true,
      readOnly: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Array with inserted item',
      outputDescription: 'The resulting array after inserting the new item.',
      like: 'array'
    },
    notFound: {
      friendlyName: 'Index out of bounds',
      description: 'The specified index was not valid for the given array.',
      extendedDescription: 'This indicates that the array was smaller than the index.'
    }

  },


  fn: function (inputs,exits) {

    // If an invalid index is given, return through the `error` exit.
    if (inputs.index < 0 || Math.floor(inputs.index) !== inputs.index) {
      return exits.error(new Error('Index must be a non-negative integer.'));
    }

    // If the array is too small to accomodate the specified index, return
    // through the `notFound` exit.  Note that it is acceptable to specify
    // an index at the _end_ of the array; for example an index of 4 for
    // an array with length 3.
    if (inputs.array.length < inputs.index) {
      return exits.notFound();
    }

    // Insert the new item item into the array at the specified index.
    inputs.array.splice(inputs.index, 0, inputs.value);

    // Return the updated array through the `success` exit.
    return exits.success(inputs.array);

  },



};
