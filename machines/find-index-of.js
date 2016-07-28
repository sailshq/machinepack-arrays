module.exports = {


  friendlyName: 'Find collection item index',


  description: 'Look up the first occurrence of the dictionary matching the specified criteria and return its array index.',


  extendedDescription: 'A _collection_ is an array of dictionaries.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array to search in.',
      example: ['==='],
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
      outputFriendlyName: 'Array item index',
      outputDescription: 'The zero-based index where the array item is located.',
      outputExample: 8
    },
    notFound: {
      description: 'The array did not contain the specified item.'
    },
  },


  fn: function(inputs, exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // Attempt to find the index of the first item in the array that matches the specified criteria.
    var index = _.findIndex(inputs.array, inputs.criteria);

    // If no such item is found, return through the `notFound` exit.
    if (index === -1) {return exits.notFound();}

    // Otherwise return the index of the found item through the `success` exit.
    return exits.success(index);

  }


};

