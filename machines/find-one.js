module.exports = {


  friendlyName: 'Find one by...',


  description: 'Search the array for the first dictionary that matches the specified criteria.',


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
    notFound: {
      friendlyName: 'not found',
      description: 'Array does not contain an item matching the specified criteria.'
    },
    success: {
      friendlyName: 'found',
      variableName: 'foundItem',
      description: 'Returns the matching dictionary.',
      itemOf: 'array'
    }
  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    var foundItem = _.find(inputs.array, inputs.criteria);
    if (!foundItem) {
      return exits.notFound();
    }
    return exits.success(foundItem);
  }


};

