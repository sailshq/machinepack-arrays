module.exports = {


  friendlyName: 'Find all by...',


  description: 'Search the array and return all dictionaries that match the specified criteria.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array to search in (i.e. "haystack")',
      example: [{}],
      required: true
    },

    criteria: {
      friendlyName: 'Criteria',
      example: {},
      description: 'The Lodash-style criteria to use (i.e. "metal detector")',
      required: true
    }

  },


  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      variableName: 'foundItems',
      description: 'Returns the matching dictionaries.',
      getExample: function (inputs, env){
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
    var foundItems = _.where(inputs.array, inputs.criteria);
    return exits.success(foundItems);
  }


};

