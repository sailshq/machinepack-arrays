module.exports = {


  friendlyName: 'Find index of...',


  description: 'Look up the first occurrence of the dictionary matching the specified criteria and return its array index.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'In array',
      description: 'The array to search in (i.e. "haystack").',
      example: ['*'],
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
      outputFriendlyName: 'Found at index',
      outputDescription: 'The zero-based index where the array item is located.',
      outputExample: 8
    },
    notFound: {
      description: 'The array did not contain the specified item.'
    },
  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    var item = _.find(inputs.array, inputs.criteria);
    if (!item) {
      return exits.notFound();
    }
    var index = _.indexOf(inputs.array, item);
    if (index === -1 ) {
      return exits.notFound();
    }
    return exits.success(index);
  }


};

