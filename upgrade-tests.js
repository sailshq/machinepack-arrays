var util = require('util');
var _ = require('lodash');
var rttc = require('rttc');
var async = require('async');
var Filesystem = require('machinepack-fs');
var Machines = require('machinepack-machines');
var Paths = require('machinepack-paths');


var pack = require('./');


Filesystem.ls({
  dir: Paths.resolve({paths: ['./tests']}).execSync(),
  depth: 1
}).exec({
  error: function (err) {},
  success: function (testPaths) {

    async.each(testPaths, function (path, next) {

      Filesystem.readJson({
        source: path,
        schema: {
          machine: 'some-machine',
          expectations: [{
            using: {},
            outcome: 'someoutcome',
            returns: '*',
          }]
        }
      }).exec({
        error: function(err) {
          console.error('ERROR READING JSON FOR TEST (@`%s`):\n',path,err);
          console.error('Skipping test...');
          return next();
        },
        success: function (jsonData){

          var machineDef = _.find(pack, {identity: jsonData.machine});
          if (!machineDef) {
            console.error('TEST REFERENCED UNKNOWN MACHINE (`%s`)',jsonData.machine);
            console.error('Skipping test...');
            return next();
          }

          try {

            jsonData.expectations = _.map(jsonData.expectations, function (expectation){

              expectation.using = _.map(expectation.using, function (inputVal, inputName) {

                var inputDef = machineDef.inputs[inputName];
                if (!inputDef) {
                  throw new Error(util.format('TEST REFERENCED UNKNOWN INPUT (`%s`) FOR  MACHINE (`%s`)',inputName, jsonData.machine));
                }

                // If this input of the machine is NOT expecting a string specifically,
                // and the provided thing here is a string, attempt to JSON.parse() it
                // and if it works, swap in that parsed data instead of the original JSON
                // string.
                var isExpectingString = (rttc.infer(inputDef.example) === 'string');
                if (isExpectingString && _.isString(inputVal)) {
                  try {
                    expectation.using[inputName] = JSON.parse(inputVal);
                  }
                  catch (e) {
                    // This is weird that we cannot parse this JSON-- it must be encoded
                    // as a normal JS string.  But since the machine is not expecting a
                    // string, we should stringify this.
                    expectation.using[inputName] = JSON.stringify(inputVal);
                  }
                }

              });
            });
          }
          catch (e) {
            return next(e);
          }

          Filesystem.writeJson({
            destination: path,
            json: jsonData,
            force: true
          }).exec({
            error: function (err) {
              console.error('ERROR WRITING JSON FOR TEST (@`%s`):\n',path,err);
              console.error('Skipping test...');
              return next();
            },
            success: function () {
              return next();
            }
          });
        }
      });
    }, function afterwards (err) {
      if (err) {
        console.error('Fatal error:',err);
        return;
      }

      console.log('Done.');
    });

  },
});
