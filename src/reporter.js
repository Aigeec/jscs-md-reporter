var templates = require('./templates');

var replaceAt = function(str, index, replaceStr) {
  return str.substr(0, index) + replaceStr + str.substr(index + replaceStr.length);
};

var formatCode = function(errors, line, column) {
  return replaceAt(errors._file.getLines()[line - 1], column, '\u2193');
};

var getContent = function(errorsCollection) {
  var content = '';

  //Run per file
  errorsCollection.forEach(function(errors) {
    if (!errors.isEmpty()) {
      //File Header
      content += templates.fileHeader.replace('{file}', errors._file._filename);

      //Per error
      errors.getErrorList().forEach(function(error) {
        content += '\r\n' + templates.error
          .replace('{line}', error.line)
          .replace('{column}', error.column)
          .replace('{rule}', error.rule)
          .replace('{message}', error.message)
          .replace('{evidence}', formatCode(errors, error.line, error.column));
      });
    }
  });

  return content;
};

var getSummary = function(errorCount) {
  return templates.summary.replace('{errorCount}', errorCount || 0);
};

var getErrorCount = function(previousValue, errors) {
  var errorList = errors.getErrorList() || [];
  return previousValue + errorList.length;
};

var getWriter = function(isTest) {
  return function(text) {
    return isTest ? text : process.stdout.write(text);
  };
};

/**
 * @param {Errors[]} errorsCollection
 */
module.exports = function(errorsCollection, isTest) {

  var writer = getWriter(isTest);

  var errorCount = errorsCollection.reduce(getErrorCount, 0);

  var content = getContent(errorsCollection);
  var summary = getSummary(errorCount);

  var report = templates.body
    .replace('{content}', content)
    .replace('{summary}', summary);

  return writer(errorCount > 0 ? report : templates.noErrors);
};
