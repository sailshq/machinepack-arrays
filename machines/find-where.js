module.exports = {


  friendlyName: 'Filter where...',


  description: 'Search an array of dictionaries and return all items that match the specified criteria.',


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
      description: 'The Lodash-style criteria used to perform the search.',
      moreInfoUrl: 'https://github.com/lodash/lodash/blob/3.10.1/doc/README.md#_findcollection-predicate_identity-thisarg',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Filtered array items',
      outputDescription: 'The array of items matching the criteria.',
      like: 'array'
    }
  },


  fn: function(inputs, exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // Attempt to find items in the array that match the specified criteria.
    // Note that if no items match, this will return an empty array.
    var foundItems = _.where(inputs.array, inputs.criteria);

    // Return the array of found items (or an empty array) through the `success` exit.
    return exits.success(foundItems);
  }


};

