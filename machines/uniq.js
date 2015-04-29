module.exports = {


  friendlyName: 'Remove duplicates',


  description: 'Build a duplicate-free version of an array.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      description: 'The array to remove duplicates from.',
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
      description: 'Returns duplicate-free version of array.',
      friendlyName: 'then',
      getExample: function(inputs, exits) {
        return inputs.array;
      }
    }

  },


  fn: function(inputs, exits) {
    return exits.success(_.uniq(inputs.array));
  }

};
