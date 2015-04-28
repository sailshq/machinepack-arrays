module.exports = {


  friendlyName: 'Reverse',


  description: 'Build a new array which is an exact clone of `array`, but in reverse order.',


  extendedDescription: '',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array',
      description: 'The array to reverse.',
      typeclass: 'array',
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
        return inputs.array.reverse();
      }
    }

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.reverse());
  }



};
