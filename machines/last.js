module.exports = {


  friendlyName: 'Get last item',


  description: 'Look up the last item in an array.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array containing the desired item.',
      example: ['*'],
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notFound: {
      description: 'The array is empty, so it doesn\'t have any items.',
    },

    success: {
      description: 'Returns the last item in the array.',
      getExample: function (inputs,env) {
        var _ = env._;

        // If the array is not available yet, or none of its items are, then
        // the best we can do is guarantee that this result will be some sort
        // of JSON-compatible value.
        if (_.isUndefined(inputs.array) || inputs.array.length < 1) {
          return '*';
        }

        // If the array is available and has one item, we can just borrow the
        // last item to build our example.
        return inputs.array[inputs.array.length-1];
      }
    },

  },


  fn: function (inputs,exits) {

    if (inputs.array.length===0) {
      return exits.notFound();
    }
    return exits.success(inputs.array[inputs.array.length-1]);

  },



};
