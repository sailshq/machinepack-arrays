module.exports = {


  friendlyName: 'Pick random item',


  description: 'Randomly select one item from an array',


  sync: true,


  inputs: {

    array: {
      example: ['*'],
      description: 'The array of items to pick from',
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      friendlyName: 'then',
      description: 'Returns a randomly selected item.',
      variableName: 'randomItem',
      getExample: function(inputs, env) {
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
      },
    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    return exits.success(_.sample(inputs.array));
  }

};
