module.exports = {


  friendlyName: 'Slice',


  description: 'Create a slice of the provided array from `start` to `end` (inclusive)',


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
      description: 'The index to start the slice from.',
      example: 2,
      required: true
    },

    end: {
      friendlyName: 'End with (index)',
      description: 'The index to end the slice with.',
      extendedDescription: 'A negative value will result in a slice built from wrapping around.',
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
