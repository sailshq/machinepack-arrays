module.exports = {


  friendlyName: 'Dedupe',


  description: 'Build a duplicate-free version of an array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array to remove duplicates from.',
      example: ['==='],
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

    // Remove duplicate items from the array and return the result
    // through the `success` exit.
    return exits.success(_.uniq(inputs.array));
  }

};
