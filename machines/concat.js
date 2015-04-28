module.exports = {


  friendlyName: 'Combine two arrays',


  description: 'Combine (aka concatenate) two arrays into a single array- one in front of the other.',


  extendedDescription: 'Warning: Both arrays must be homogenous, and their items must have matching/compatible types.',


  sync: true,


  cacheable: true,


  inputs: {

    firstArray: {
      description: 'The first array',
      typeclass: 'array',
      required: true
    },

    secondArray: {
      description: 'The second array',
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
      friendlyName: 'then',
      description: 'Returns a new array consisting of the items of both arrays, in order.',
      variableName: 'newArray',
      getExample: function (inputs){
        return [inputs.firstArray[0]];
      }
    }

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.firstArray.concat(inputs.secondArray));
  },

};
