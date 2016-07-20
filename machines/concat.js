module.exports = {


  friendlyName: 'Combine two arrays',


  description: 'Combine (aka concatenate) two arrays into a single array- one in front of the other.',


  extendedDescription: 'Warning: Both arrays must be homogeneous, and their items must have matching/compatible types. Also, both arrays must be JSON-compatible.',


  sync: true,


  cacheable: true,


  inputs: {

    firstArray: {
      friendlyName: 'First array',
      description: 'The first array',
      example: ['*'],
      required: true
    },

    secondArray: {
      friendlyName: 'Second array',
      description: 'The second array',
      example: ['*'],
      required: true
    }

  },

  exits: {

    success: {
      outputFriendlyName: 'Concatenated Array',
      outputDescription: 'The result of concatenating the input arrays.',
      getExample: function (inputs, env){
        var _ = env._;

        // If neither array is avaiable yet, the best we can do is guarantee
        // that this result will be some sort of homogeneous array of JSON-compatible
        // values, as per the machine description.
        if (_.isUndefined(inputs.firstArray) && _.isUndefined(inputs.secondArray)) {
          return ['*'];
        }

        // If at least one array is available, and has at least one item, we can use
        // it to determine the pattern type. This is possible because this machine makes
        // it clear in the description that both arrays must share a common pattern type.
        if (inputs.firstArray&&inputs.firstArray.length>0) {
          return [inputs.firstArray[0]];
        }
        else if (inputs.secondArray&&inputs.secondArray.length>0) {
          return [inputs.secondArray[0]];
        }

        // If neither array has this information available yet, the best we can
        // do is return `['*']`, since we know that, barring any weird complications
        // that would cause a different exit to be traversed, this will be the
        // result for our machine.
        return ['*'];
      }
    }

  },


  fn: function(inputs, exits) {
    return exits.success(inputs.firstArray.concat(inputs.secondArray));
  },

};
