var expect = require('chai').expect;
var reporter = require('../src/reporter');

describe('#jscs-md-reporter', function() {

  var withErrors = [
    {
      _file: {
        _filename: 'src/mandrill-webhook-authenticator.js',
        _lines: [
          '  var NOT_AUTHORIZED = \'Not Authorized\'',
        ],
        getLines: function() {
          return this._lines;
        },
      },
      _errorList:
        [
          {
            filename: 'src/mandrill-webhook-authenticator.js',
            rule: 'requireSemicolons',
            message: 'Missing semicolon after statement',
            line: 1,
            column: 39,
            additional: [Object],
            fixed: undefined,
          },
        ],
      getErrorList: function() {
        return this._errorList;
      },

      isEmpty: function() {
        return false;
      },
    },
  ];

  var withOutErrors = [
    {
      _file: {
        _filename: 'src/mandrill-webhook-authenticator.js',
        _lines: [
          '  var NOT_AUTHORIZED = \'Not Authorized\';',
        ],
        getLines: function() {
          return this._lines;
        },
      },      
      getErrorList: function() {
        return this._errorList;
      },

      isEmpty: function() {
        return true;
      },

      getFileName: function() {
        return 'src/mandrill-webhook-authenticator.js';
      },
    },
  ];

  describe('With Errors', function() {

    var text = reporter(withErrors, true);
    it('should output the file name', function() {
      expect(text).to.contain('src/mandrill-webhook-authenticator.js');
    });

    it('should give details of error location', function() {
      expect(text).to.contain('| 1 | 39 |');
    });

    it('should output the rule that is broken', function() {
      expect(text).to.contain('requireSemicolons');
    });

    it('should give a detailed message of the rule that is broken', function() {
      expect(text).to.contain('Missing semicolon after statement');
    });

    it('should provide a code snippet of what code has the issue indicating where the issue is with an arror', function() {
      expect(text).to.contain('var NOT_AUTHORIZED = \'Not Authorized\'\u2193');
    });

    it('should output a summary', function() {
      expect(text).to.contain('1 code style error(s) found.');
    });

  });

  describe('Without Errors', function() {
    var text = reporter(withOutErrors, true);

    it('should display a message saying there are now errors', function() {
      expect(text).to.contain('#### No Errors - w00t!');
    });

  });

  describe('Normal Operation', function() {

    it('should write to process.stdout.write', function() {
      var write = process.stdout.write;
      process.stdout.write = function(text) {
        expect(text).to.contain('#### No Errors - w00t!');
      };

      reporter(withOutErrors);

      process.stdout.write = write;
    });

  });

});
