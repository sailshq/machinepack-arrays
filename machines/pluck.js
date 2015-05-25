module.exports = {


  friendlyName: 'Pluck',


  description: 'List the values of a particular key from an array of dictionaries.',


  sync: true,


  cacheable: true,


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
      required: true
    }

  },


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      getExample: function(inputs, env) {
        var _ = env._;

        // If the array is not available yet, or none of its items are, the best we
        // can do is guarantee that this result will be some sort of homogeneous array
        // of JSON-compatible values.
        if (_.isUndefined(inputs.array) || inputs.array.length < 1) {
          return ['*'];
        }

        // If the name of the key is not available yet, we can't use it to figure out which
        // item to grab, so the best we can do is send back ['*']
        if (_.isUndefined(inputs.key)) {
          return ['*'];
        }

        // But if we have the key name, and the array is available with at least one item,
        // we can just borrow that first item, grab the value of the `key`, and if that exists,
        // use that to build our example.
        if (!_.isUndefined(inputs.array[0][inputs.key])) {
          return [inputs.array[0][inputs.key]];
        }
        // Otherwise, if it doesn't exist, we'll fall back to the same generic guarantee we
        // used above.
        return ['*'];
      }
    }

  },


  fn: function (inputs,exits) {
    var _ = require('lodash');
    return exits.success(_.pluck(inputs.array, inputs.key));
  }



};
