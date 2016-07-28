module.exports = {


  friendlyName: 'Find collection items',


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
      description: 'The Lodash-style criteria to use (i.e. "metal detector").',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Found array items',
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

