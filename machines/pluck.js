module.exports = {


  friendlyName: 'Pluck by...',


  description: 'List the values of a particular key from an array of dictionaries.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    array: {
      friendlyName: 'Array of dictionaries',
      description: 'The array of dictionaries to iterate over.',
      example: [{}],
      required: true
    },

    key: {
      friendlyName: 'Key to pluck',
      description: 'The property to pluck from each dictionary.',
      example: 'id',
      required: true,
      constant: true
    }

  },


  exits: {

    success: {
      getExample: function(inputs, env) {
        var _ = env._;

        // If the array is not available yet, or none of its items are, the best we
        // can do is guarantee that this result will be some sort of homogeneous array
        // of JSON-compatible values.
        if (_.isUndefined(inputs.array) || inputs.array.length < 1) {
          return ['*'];
        }

        // If the name of the key is not available yet, we can't use it to figure out which
        // item to grab, so the best we can do is send back ['*'].
        if (_.isUndefined(inputs.key)) {
          return ['*'];
        }

        // But if we have the key name, and the array is available with at least one item,
        // we can run _.pluck() on the array and use RTTC to get an exemplar from the result.
        // Note the use of "strict" mode (the last argument to coerceExemplar) to ensure that
        // the arrays like [1,'1'] are coerced to ['*'] and not ['1']
        if (!_.isUndefined(inputs.array[0][inputs.key])) {
          return env.rttc.coerceExemplar(_.pluck(inputs.array, inputs.key), false, false, true);
        }

        // Otherwise, if it doesn't exist, we'll fall back to the same generic guarantee we
        // used above.
        return ['*'];
      },
      outputFriendlyName: 'Plucked array',
      outputDescription: 'The array of values gathered by plucking the specified key out of each array item.'
    }

  },


  fn: function (inputs,exits) {

    // Import `lodash`.
    var _ = require('lodash');

    // Perform the pluckin' and return the result through the `success` exit.
    return exits.success(_.pluck(inputs.array, inputs.key));
  }



};
