module.exports = {


  friendlyName: 'Combine two arrays',


  description: 'Combine (aka concatenate) two arrays into a single array- one in front of the other.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    firstArray: {
      description: 'The first array.',
      example: ['==='],
      required: true
    },

    secondArray: {
      description: 'The second array.',
      example: ['==='],
      required: true
    }

  },

  exits: {

    success: {
      outputFriendlyName: 'Concatenated array',
      outputDescription: 'The result of concatenating the input arrays.',
      getExample: function (inputs, env){
        var _ = env._;

        // If either array is not avaiable yet, the best we can do is guarantee
        // that this result will be some sort of array.
        if (_.isUndefined(inputs.firstArray) || _.isUndefined(inputs.secondArray)) {
          return ['==='];
        }

        // Otherwise create exemplars out of both of the input arrays, and return their union.
        // Use "strict" mode for the exemplar, so that [{name:1},{name:'Estelle'}] coerces to
        // [{name: '*'}] and not [{name: 'string'}]
        var exemplarRepresenting1stArray = env.rttc.coerceExemplar(inputs.firstArray, false, false, true);
        var exemplarRepresenting2ndArray = env.rttc.coerceExemplar(inputs.secondArray, false, false, true);

        // Use "strict" mode for the union (fourth argument) so that
        // (for example) "number"+"string"="*" instead of "string".
        var exemplarRepresentingConcatedResult = env.rttc.union(exemplarRepresenting1stArray, exemplarRepresenting2ndArray, true, true);

        // Return the unioned exemplar.
        return exemplarRepresentingConcatedResult;
      }
    }

  },


  fn: function(inputs, exits) {

    // Use the native `Array.concat()` method and return the result through
    // the `success` exit.
    return exits.success(inputs.firstArray.concat(inputs.secondArray));

  },

};
