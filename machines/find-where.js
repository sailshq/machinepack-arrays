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
      like: 'array'
    }
  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    var foundItems = _.where(inputs.array, inputs.criteria);
    return exits.success(foundItems);
  }


};

