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
      like: 'array'
    }

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.array);
  }

};
