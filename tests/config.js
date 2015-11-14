'use strict';

var equal = require('deep-equal'),
    assert = require('assert'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    path = require('path'),
    merge = require('merge'),
    config = require('../lib/config');

var custOptions = function () {
  return {
    'options': {
      'formatter': 'stylish',
      'cache-config': false
    },
    'files': {
      'ignore': [
        'foo',
        'bar'
      ]
    },
    'rules': {
      'no-duplicate-property': 0,
      'indentation': [
        2,
          {
            'size': 4
          }
      ]
    }
  };
};

describe('config', function () {
  it('should return the defaults if no config is passed in', function (done) {
    var defaultConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'lib', 'config', 'sass-lint.yml'), 'utf8')),
        conf = config();

    assert(
      equal(
        conf,
        defaultConfig,
        {
          'strict': true
        }
      )
    );

    done();
  });

  it('should merge options when passed in', function (done) {

    var defaultConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'lib', 'config', 'sass-lint.yml'), 'utf8')),
        tempOptions = custOptions(),
        conf = config(tempOptions),
        merged = merge.recursive(defaultConfig, tempOptions);

    assert(
      equal(
        conf,
        merged,
        {
          'strict': true
        }
      )
    );

    done();
  });

  it('should use a config file if one is provided', function (done) {
    var defaultConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'lib', 'config', 'sass-lint.yml'), 'utf8')),
        tempOptions = {
          'options': {
            'config-file': 'tests/yml/.stylish-output.yml',
            'cache-config': false
          }
        },
        conf = config(tempOptions),
        merged = merge.recursive(tempOptions, defaultConfig, yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'yml', '.stylish-output.yml'), 'utf8')));

    assert(
      equal(
        conf,
        merged,
        {
          'strict': true
        }
      )
    );

    done();
  });

  it('should not merge rules when `merge-default-rules` is false', function (done) {
    var defaultConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'lib', 'config', 'sass-lint.yml'), 'utf8')),
        tempOptions = custOptions(),
        conf,
        merged;

    tempOptions.options['merge-default-rules'] = false;

    conf = config(tempOptions);

    merged = merge.recursive(tempOptions, defaultConfig);
    merged.rules = tempOptions.rules;

    assert(
      equal(
        conf,
        merged,
        {
          'strict': true
        }
      )
    );

    done();
  });
});
