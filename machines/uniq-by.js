module.exports = {


  friendlyName: 'Remove duplicate dictionaries',


  description: 'Build a duplicate-free version of an array of dictionaries, judging uniqueness based on a particular key.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array of dictionaries to remove duplicates from.',
      example: [{}],
      required: true
    },

    key: {
      friendlyName: 'Unique key',
      description: 'The key to use when determining uniqueness.',
      example: 'id',
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns a duplicate-free version of the array.',
      friendlyName: 'then',
      getExample: function(inputs, env) {
        var _ = env._;

        // If the array is not available yet, the best we can do is guarantee
        // that this result will be some sort of homogeneous array of dictionaries.
        if (_.isUndefined(inputs.array)) {
          return [{}];
        }

        // If the array is available and has one item, we can just borrow that first item
        // to build our example.
        if (inputs.array.length > 0) {
          return [inputs.array[0]];
        }

        // Otherwise, the best we can do is send back [{}].
        return [{}];
      }
    }

  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    var set = _.uniq(inputs.array, false, inputs.key);
    return exits.success(set);
  }

};
