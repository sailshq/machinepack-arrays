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


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notFound: {
      description: 'The array doesn\'t have an item at the specified index.'
    },

    success: {
      description: 'Returns the item at the specified index within the array.',
      getExample: function (inputs) {
        var _ = env._;

        // If the array is not available yet, or none of its items are, then
        // the best we can do is guarantee that this result will be some sort
        // of JSON-compatible value.
        if (_.isUndefined(inputs.array) || inputs.array.length < 1) {
          return '*';
        }

        // If the array is available and has one item, we can just borrow the
        // first item to build our example.
        return inputs.array[0];
      }
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
