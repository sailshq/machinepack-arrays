module.exports = {


  friendlyName: 'Construct array',


  description: 'Construct an array.',


  extendedDescription: 'This machine is not designed for everyday use-- it is an identity operator for the Array type-- but it can certainly be used in any way you see fit.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      description: 'The homogeneous array to build.',
      example: ['*'],
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns new array.',
      variableName: 'newArray',
      friendlyName: 'then',
      getExample: function(inputs, exits) {
        var _ = env._;

        // If the array is not available yet, the best we can do is guarantee
        // that this result will be some sort of homogeneous array of JSON-compatible
        // values, as per the machine description.
        if (_.isUndefined(inputs.array)) {
          return ['*'];
        }

        // If the array is available and has one item, we can just borrow that first item
        // to build our example.
        if (inputs.array.length > 0) {
          return [inputs.array[0]];
        }

        // Otherwise, the best we can do is send back ['*'].
        return ['*'];
      }
    }

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.array);
  }

};
