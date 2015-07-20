module.exports = {


  friendlyName: 'Insert item in array',


  description: 'Insert or append an item and return the result (a new array).',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
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

    error: {
      description: 'Unexpected error occurred.',
    },

    notFound: {
      description: 'The array does not have enough items for anything to exist at the specified index.',
    },

    success: {
      description: 'Returns the new array.',
      like: 'array'
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
