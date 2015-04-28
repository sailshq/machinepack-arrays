module.exports = {


  friendlyName: 'Build array',


  description: 'Build an array using the specified values.',


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
      description: 'Returns created array.',
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
