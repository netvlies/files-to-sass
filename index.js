var fs = require('fs'),
    chalk = require('chalk');

module.exports = function (options) {
  if (!options.src || options.src.length === 0) {
    throw Error('No source folder given.');
  }

  if (!options.dest || options.dest.length === 0) {
    throw Error('No destination file given.');
  }

  options.files = fs.readdirSync(options.src);
  options.fileList = {};
  options.content = '';

  options.files.forEach(function(file, i) {
    var fileName = file.replace(/\.[^/.]+$/, ''),
        fileContents = fs.readFileSync(options.src + file, 'utf8');

    options.fileList[fileName] = fileContents.replace(/\n/gi, '');
    options.content += '$' + fileName + ': \''  + options.fileList[fileName] + '\'\;\n';

    if(options.debug) {
      console.log('Processing file ' + chalk.cyan(file));
    }
  });


  fs.writeFile(options.dest, options.content, function(err, data) {
    if(err) {
      console.log('Writing to ' + chalk.cyan(options.dest) + ' didn\'t work out. :(');
      return;
    }
    if(options.debug) {
      console.log('Writing to ' + chalk.cyan(options.dest) + ' succesfull!');
    }
  });
};
