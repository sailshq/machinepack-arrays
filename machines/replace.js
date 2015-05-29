module.exports = {


  friendlyName: 'Replace item',


  description: 'Replace the item located at the specified index and return the result (a new array).',


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
      friendlyName: 'Replace at (index)',
      description: 'The index of the item to replace.',
      example: 1,
      required: true
    },

    value: {
      friendlyName: 'New value',
      description: 'The new value to replace the old one with.',
      example: '*',
      required: true
    }

  },


  exits: {

    notFound: {
      description: 'The array does not have enough items for anything to exist at the specified index.',
    },

    success: {
      description: 'Returns the new array.',
      getExample: function (inputs, env) {
        var _ = env._;

        // If neither the array nor the new value are available yet, the best we
        // can do is guarantee that this result will be some sort of homogeneous array.
        if (_.isUndefined(inputs.array) && _.isUndefined(inputs.value)) {
          return ['*'];
        }

        // If the new vlue is available, we can borrow that to build our example
        if (_.isUndefined(inputs.value)) {
          return [inputs.value];
        }

        // If the array is available and has at least one item, we can just borrow
        // that first item to build our example.
        if (inputs.array.length > 0) {
          return [inputs.array[0]];
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

    // Replace item
    inputs.array.splice(inputs.index, 1, inputs.value);

    return exits.success(inputs.array);

  },



};
