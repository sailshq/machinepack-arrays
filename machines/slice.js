module.exports = {


  friendlyName: 'Slice array',


  description: 'Copy a subset of consecutive items from the specified array.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      description: 'The array to slice.',
      example: ['==='],
      required: true
    },

    start: {
      friendlyName: 'Start from (index)',
      description: 'The index of the first item to include in the new array.',
      extendedDescription: 'Must be a non-negative integer.',
      example: 2,
      required: true
    },

    end: {
      friendlyName: 'End with (index)',
      description: 'The index of the last item to include in the new array.',
      extendedDescription: 'Must be a non-negative integer, greater than or equal to the start index.  Omitting this input value will include the rest of the array.',
      example: 5
    }

  },


  exits: {

    success: {
      like: 'array',
      outputFriendlyName: 'Array slice',
      outputDescription: 'The requested slice of the input array.'

    },

  },


  fn: function (inputs,exits) {

    // Import `lodash`.
    var _ = require('lodash');


    // If an invalid start index is given, return through the `error` exit.
    if (inputs.start < 0 || Math.floor(inputs.start) !== inputs.start) {
      return exits.error(new Error('Starting index must be a non-negative integer.'));
    }

    // If no ending index is give, return the rest of the array (beginning
    // with the start index) through the `success` exit.
    if (typeof inputs.end === 'undefined') {
      return exits.success(_.slice(inputs.array, inputs.start));
    }

    // If an invalid end index is given, return through the `error` exit.
    if (inputs.end < 0 || Math.floor(inputs.end) !== inputs.end) {
      return exits.error(new Error('Ending index must be a non-negative integer.'));
    }

    // If the end index is less than the beginning, return through the `error` exit.
    if (inputs.end < inputs.start) {
      return exits.error(new Error('Ending index must >= starting index.'));
    }

    // Increment `end` by 1 (since the third arg to `_.slice` is exclusive),
    // and return the result of the Lodash `_.slice()` function through the
    // `success` exit.
    return exits.success(_.slice(inputs.array, inputs.start, inputs.end+1));
  },



};
