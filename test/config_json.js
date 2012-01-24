var assert = require('assert')
  , fs = require('fs')
  , ensure = require('ensure')
  , historian = require(__dirname + '/../lib/historian')
  , tests = exports;

tests.config_json = function (callback) {
  fs.stat(__dirname + '/../conf/config.json', function (err, stat) {
    err ? callback (false) : callback (true);
  });
};


tests.config_json_ok = function (t) {
  this.t.ok (t, '"config.json" exists');
};

tests.config_json_parse = function (callback) {
  fs.readFile(__dirname + '/../conf/config.json', function (err, data) {
    if (err) {
      return callback (false);
    }
    else {

      try {
	JSON.parse (data);
      }
      catch (e) {
	return callback (false);
      }
      callback (true);

    }

  });
};

tests.config_json_parse_ok = function (t) {
  this.t.ok (t, 'valid json in "config.json"');
}


ensure('config.json', tests, module);
