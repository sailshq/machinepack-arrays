var util = require('util');
var _ = require('lodash');
var rttc = require('rttc');
var async = require('async');
var Filesystem = require('machinepack-fs');
var Machines = require('machinepack-machines');
var Paths = require('machinepack-paths');


var packRoot = process.env.PACK_PATH || process.cwd();

var pack = require(Paths.resolve({paths: [packRoot]}).execSync());
Filesystem.ls({
  dir: Paths.resolve({paths: [packRoot, './tests']}).execSync(),
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
            todo: true,
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

              // Remove `todo` tests.
            jsonData.expectations = _.reduce(jsonData.expectations, function (memo, expectation){
              if (expectation.todo){
                return memo;
              }
              delete expectation.todo;
              memo.push(expectation);
              return memo;
            }, []);


            jsonData.expectations = _.map(jsonData.expectations, function (expectation){

              expectation.using = _.reduce(expectation.using, function (memo, inputVal, inputName) {

                var inputDef = machineDef.inputs[inputName];
                if (!inputDef) {
                  throw new Error(util.format('TEST REFERENCED UNKNOWN INPUT (`%s`) FOR  MACHINE (`%s`)',inputName, jsonData.machine));
                }

                // If this input of the machine is NOT expecting a string specifically,
                // but the provided thing here is a string, attempt to JSON.parse() it
                // and if it works, swap in that parsed data instead of the original JSON
                // string.
                var typeSchema = rttc.infer(inputDef.example);
                var isExpectingString = (typeSchema === 'string');
                // console.log('%s...%s -> ISEXPECTINGSTRING: ',machineDef.identity, inputName, isExpectingString);
                if (!isExpectingString && _.isString(inputVal)) {
                  try {
                    memo[inputName] = JSON.parse(inputVal);
                    // console.log('parsed %s!', inputName);
                  }
                  catch (e) {
                    // This is weird that we cannot parse this JSON-- it must be encoded
                    // as a normal JS string.  But since the machine is not expecting a
                    // string, we should stringify this.
                    memo[inputName] = JSON.stringify(inputVal);
                  }
                }
                else {
                  memo[inputName] = inputVal;
                }


                return memo;
              }, {});

                // Validate outcome
                var exitDef = machineDef.exits[expectation.outcome];
                if (!exitDef) {
                  throw new Error('Test referneces unknown exit ('+expectation.outcome+')!');
                }

                // Do the same thing we did for `using` for `returns`.
                if (!_.isUndefined(exitDef.example)) {
                  var outputTypeSchema = rttc.infer(exitDef.example);

                  var expectsStringOutput = (outputTypeSchema === 'string');
                  if (!expectsStringOutput && _.isString(expectation.returns)) {
                    try {
                      expectation.returns = JSON.parse(expectation.returns);
                      // console.log('parsed %s!', inputName);
                    }
                    catch (e) {
                      // This JSON-- it must be encoded as a normal JS string.
                      // But since the machine is not expecting a string specifically,
                      // we should stringify this.
                      expectation.returns = JSON.stringify(expectation.returns);
                    }
                  }
                }

              // Prune out null and undefined properties
              if (_.isUndefined(expectation.returns) || _.isNull(expectation.returns)) {
                delete expectation.returns;
              }
              if (_.isUndefined(expectation.using)) {
                delete expectation.using;
              }

              return expectation;
            });
          }
          catch (e) {
            return next(e);
          }

          // console.log('For %s, would write:',path, util.inspect(jsonData, false, null));
          // return next();

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
