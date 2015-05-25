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
      example: ['*'],
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


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      getExample: function (inputs,env) {
        var _ = env._;

        // If the array is not available yet, or none of its items are, the best we
        // can do is guarantee that this result will be some sort of homogeneous array
        // of JSON-compatible values.
        if (_.isUndefined(inputs.array) || inputs.array.length < 1) {
          return ['*'];
        }

        // If the array is available and has at least one item, we can just borrow that
        // first item to build our example.
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
