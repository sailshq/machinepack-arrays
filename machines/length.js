module.exports = {


  friendlyName: 'Count items',


  description: 'Get the length of the provided array.',


  sync: true,


  cacheable: true,


  inputs: {

    array: {
      friendlyName: 'Array to count',
      example: ['*'],
      description: 'The array of items to count',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Returns the number of items in the array.',
      example: 32
    }

  },


  fn: function (inputs,exits) {
    return exits.success(inputs.array.length);
  },


};
