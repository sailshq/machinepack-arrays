module.exports = {


  friendlyName: 'Find one by...',


  description: 'Search the array for the first dictionary that matches the specified criteria.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array to search in (i.e. "haystack").',
      example: [{}],
      required: true
    },

    criteria: {
      example: {},
      description: 'The Lodash-style criteria to use (i.e. "metal detector").',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Found item',
      outputDescription: 'The first dictionary item in the array that matches the criteria.',
      itemOf: 'array'
    },
    notFound: {
      description: 'The array did not contain an item matching the specified criteria.'
    },
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

