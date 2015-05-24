module.exports = {


  friendlyName: 'Reverse',


  description: 'Build a new array which is an exact clone of an existing array, but in reverse order.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array to reverse.',
      example: ['*'],
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      getExample: function(inputs, env) {
        var _ = env._;

        // If the array is not available yet, or none of its items are, then
        // the best we can do is guarantee that this result will be some sort
        // of homogeneous array.
        if (_.isUndefined(inputs.array) || inputs.array.length < 1) {
          return '*';
        }

        // If the array is available and has one item, we can just go ahead
        // and actually reverse the array.
        return inputs.array.reverse();
      }
    }

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.reverse());
  }



};
