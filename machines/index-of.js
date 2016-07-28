module.exports = {


  friendlyName: 'Get array item index',


  description: 'Look up the first occurrence of the specified item and return its array index.',


  extendedDescription: 'This machine uses deep equality (`_.isEqual()`) for comparison.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'In array',
      description: 'The array to search in (i.e. "haystack").',
      example: ['==='],
      required: true
    },

    item: {
      example: '===',
      friendlyName: 'Search for',
      description: 'The value to search for (i.e. "needle").',
      required: true,
      readOnly: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Array item index',
      outputDescription: 'The index where the array item is located.',
      outputExample: 8
    },
    notFound: {
      description: 'The array did not contain the specified item.'
    },
  },


  fn: function(inputs, exits) {

    // Attempt to find the index of the specified item in the input array.
    var index = _.indexOf(inputs.array, inputs.item);

    // If no such item is found, return through the `notFound` exit.
    if (index === -1) {return exits.notFound();}

    // Otherwise return the index of the found item through the `success` exit.
    return exits.success(index);

  }


};

