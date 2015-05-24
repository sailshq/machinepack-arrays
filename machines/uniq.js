module.exports = {


  friendlyName: 'Remove duplicates',


  description: 'Build a duplicate-free version of an array.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      description: 'The array to remove duplicates from.',
      example: ['*'],
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns duplicate-free version of array.',
      friendlyName: 'then',
      getExample: function(inputs, exits) {
        var _ = env._;

        // If the array is not available yet, the best we can do is guarantee
        // that this result will be some sort of homogeneous array of JSON-compatible
        // values.
        if (_.isUndefined(inputs.array)) {
          return ['*'];
        }

        // If the array is available and has one item, we can just borrow that first item
        // to build our example.
        if (inputs.array.length > 0) {
          return [inputs.array[0]];
        }

        // Otherwise, the best we can do is send back ['*'].
        return ['*'];
      }
    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    return exits.success(_.uniq(inputs.array));
  }

};
