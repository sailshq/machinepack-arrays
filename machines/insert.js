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
      typeclass: 'array',
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
      typeclass: '*',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notFound: {
      description: 'The array does not have enough items for anything to exist at the specified index.',
    },

    success: {
      description: 'Returns the last item in the array.',
      getExample: function (inputs) {
        if (inputs.index < 0) {
          return;
        }
        if (inputs.array.length <= inputs.index) {
          return;
        }
        return [inputs.value];
      }
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
