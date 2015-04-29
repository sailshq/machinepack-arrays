module.exports = {


  friendlyName: 'Slice array',


  description: 'Copy a sub-array of consecutive items from the specified array.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array to slice.',
      typeclass: 'array',
      required: true
    },

    start: {
      friendlyName: 'Start from (index)',
      description: 'The index of the first item to include in the new array.',
      extendedDescription: 'This index should be zero or a positive number.',
      example: 2,
      required: true
    },

    end: {
      friendlyName: 'End with (index)',
      description: 'The index of the last item to include in the new array.',
      extendedDescription: 'This index should be zero or a positive number. Omitting this input value will include the rest of the array.',
      example: 5,
      min: 0
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      getExample: function (inputs) {
        return [inputs.array[0]];
      }
    },

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');

    if (inputs.start < 0) {
      return exits.error('`start` index must be least zero.');
    }
    if (typeof inputs.end === 'undefined') {
      return exits.success(_.slice(inputs.array, inputs.start));
    }

    if (inputs.end < 0) {
      return exits.error('`end` index must be least zero.');
    }
    // Increment `end` by 1 (since the third arg to `_.slice` is exclusive)
    return exits.success(_.slice(inputs.array, inputs.start, inputs.end+1));
  },



};
