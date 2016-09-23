module.exports = {


  friendlyName: 'Find one where...',


  description: 'Search an array of dictionaries for the first item that matches the specified criteria.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array to search in.',
      example: [{}],
      required: true
    },

    criteria: {
      example: {},
      description: 'The Lodash-style criteria to search using.',
      moreInfoUrl: 'https://github.com/lodash/lodash/blob/3.10.1/doc/README.md#_findcollection-predicate_identity-thisarg',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Found array item',
      outputDescription: 'The first dictionary item in the array that matches the criteria.',
      itemOf: 'array'
    },
    notFound: {
      description: 'The array did not contain an item matching the specified criteria.'
    },
  },


  fn: function(inputs, exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // Attempt to find an item in the array that matches the specified criteria.
    var foundItem = _.find(inputs.array, inputs.criteria);

    // If no such item could be found, return through the `notFound` exit.
    if (!foundItem) {
      return exits.notFound();
    }

    // Otherwise return the found item through the `notFound` exit.
    return exits.success(foundItem);
  }


};

