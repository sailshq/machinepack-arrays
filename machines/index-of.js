module.exports = {


  friendlyName: 'Get index of item',


  description: 'Look up the first occurrence of the specified item and return its array index.',


  extendedDescription: 'This machine uses deep equality (`_.isEqual()`) for comparison.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'In array',
      description: 'The array to search in (i.e. "haystack").',
      example: ['*'],
      required: true
    },

    item: {
      example: '*',
      friendlyName: 'Search for',
      description: 'The value to search for (i.e. "needle").',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Found at index',
      outputDescription: 'The index where the array item is located.',
      outputExample: 8
    },
    notFound: {
      description: 'The array did not contain the specified item.'
    },
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

