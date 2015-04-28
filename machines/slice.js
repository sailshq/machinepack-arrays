module.exports = {


  friendlyName: 'Slice',


  description: 'Build a new array from consecutive items of an existing array.',


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
      example: 2,
      required: true
    },

    end: {
      friendlyName: 'End with (index)',
      description: 'The index of the last item to include in the new array.',
      extendedDescription: 'Omitting this value will include the rest of the original array.  Specifying a negative value will cause the slice to "wrap around" to the beginning; including the items with array indices of 0, 1, 2, etc.',
      example: 5
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
    if (typeof inputs.end === 'undefined') {
      return exits.success(_.slice(inputs.array, inputs.start));
    }
    return exits.success(_.slice(inputs.array, inputs.start, inputs.end-1));
  },



};
