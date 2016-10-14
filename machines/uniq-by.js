module.exports = {


  friendlyName: 'Dedupe by...',


  description: 'Build a duplicate-free version of an array of dictionaries, judging uniqueness based on a particular key.',


  sync: true,


  sideEffects: 'cacheable',


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

    success: {
      like: 'array',
      outputFriendlyName: 'De-duplicated Array',
      outputDescription: 'The resulting array after removing duplicate items.'

    }

  },


  fn: function(inputs, exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // Use `_.uniq()` to get a set of elements from the array of dictionaries whose
    // values for the given key are unique.
    var set = _.uniq(inputs.array, false, inputs.key);

    // Return the set through the `success` exit.
    return exits.success(set);

  }

};
