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
      getExample: function (inputs, env) {
        var _ = env._;

        // If neither the array nor the value to add are not available yet, the best we
        // can do is guarantee that this result will be some sort of homogeneous array.
        if (_.isUndefined(inputs.array) && _.isUndefined(inputs.value)) {
          return ['*'];
        }

        // If the array is available and has at least one item, we can just borrow
        // that first item to build our example.
        if (inputs.array.length > 0) {
          return [inputs.array[0]];
        }

        // If the new vlue is available, we can borrow that to build our example
        if (_.isUndefined(inputs.value)) {
          return [inputs.value];
        }

        // Otherwise, the best we can do is send back ['*'].
        return ['*'];
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
