module.exports = {


  friendlyName: 'Find index of...',


  description: 'Look up the first occurrence of the dictionary matching the specified criteria and return its array index.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'In array',
      description: 'The array to search in (i.e. "haystack")',
      example: ['*'],
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
      description: 'Array does not contain specified item.'
    },
    success: {
      friendlyName: 'found',
      variableName: 'foundAtIndex',
      description: 'Returns the array index where the item is located (starting with 0)',
      example: 8
    }
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

