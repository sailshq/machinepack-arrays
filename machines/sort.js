module.exports = {


  friendlyName: 'Sort',


  description: 'Sort an array of strings or numbers, lowest to highest.',


  extendedDescription: '',


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'An array of strings or numbers to sort.',
      typeclass: 'array',
      required: true,
      validate: function (array){
        if (typeof array[0] === 'string' || typeof array[0] === 'number') {
          return true;
        }
        return false;
      }
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Returns the sorted array.',
      getExample: function (inputs) {
        return inputs.array;
      }
    },

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.sort());
  },



};
