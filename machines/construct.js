module.exports = {


  friendlyName: 'Construct array',


  description: 'Construct an array.',


  extendedDescription: 'This machine is not designed for everyday use-- it is an identity operator for the Array type.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      description: 'The array to build.',
      typeclass: 'array',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns new array.',
      friendlyName: 'then',
      getExample: function(inputs, exits) {
        return inputs.array;
      }
    }

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.array);
  }

};
