module.exports = {


  friendlyName: 'Insert item in array',


  description: 'Insert or append an item and return the result (a new array).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array where the new item should be inserted.',
      example: ['*'],
      required: true
    },

    index: {
      friendlyName: 'Insert at (index)',
      description: 'The index to insert the new item at.',
      example: 1,
      required: true
    },

    value: {
      friendlyName: 'New item',
      description: 'The new item to insert into the array.',
      example: '*',
      required: true
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
    },

    invalidIndex: {
      description: 'The specified index was not a non-negative integer.'
    },

  },


  fn: function (inputs,exits) {

    if (inputs.index < 0) {
      return exits.error('Index must be least zero.');
    }
    if (inputs.array.length < inputs.index) {
      return exits.notFound();
    }

    // Insert item
    inputs.array.splice(inputs.index, 0, inputs.value);

    return exits.success(inputs.array);

  },



};
