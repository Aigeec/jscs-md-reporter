var fs = require('fs');
var path = require('path');

var removeNewLines = function(str) {return str.replace(/^\s+|\s+$/g, '');};

var folder = path.resolve(__dirname);

var templates = {
  body: null,
  error: null,
  fileHeader: null,
  noErrors: null,
  summary: null,
};

var mdPath;
for (var template in templates) {
  mdPath = path.join(folder, template + '.md');
  templates[template] = removeNewLines(fs.readFileSync(mdPath).toString());
}

module.exports = templates;
