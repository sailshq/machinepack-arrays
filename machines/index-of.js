module.exports = {


  friendlyName: 'Get index of item',


  description: 'Look up the first occurrence of the specified item and return its array index.',


  extendedDescription: 'This machine uses deep equality (`_.isEqual()`) for comparison.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'In array',
      description: 'The array to search in (i.e. "haystack")',
      example: ['*'],
      required: true
    },

    item: {
      example: '*',
      friendlyName: 'Search for',
      description: 'The value to search for (i.e. "needle")',
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

    var foundAtIndex;
    _.each(inputs.array, function (item, i){
      if (!_.isUndefined(foundAtIndex)) {
        return;
      }
      if (_.isEqual(item, inputs.item)) {
        foundAtIndex = i;
      }
    });
    if (_.isUndefined(foundAtIndex)) {
      return exits.notFound();
    }
    return exits.success(foundAtIndex);
  }


};

