var fs = require('fs'),
    chalk = require('chalk');
    sassMapName = 'fileMap'

function filesAsVariables(fileName, fileContents) {
  return '$' + fileName + ': \''  + fileContents + '\'\;\n';
}

function filesAsSassMap(fileName, fileContents) {
  return '  ' + fileName + ': \''  + fileContents + '\'\n';
}


module.exports = function (options) {
  var useSassMap = false,
    fileAs = filesAsVariables;

  if (!options) {
    throw Error('No config options are given.');
  }

  if (!options.src || options.src.length === 0) {
    throw Error('No source folder given.');
  }

  if (!options.dest || options.dest.length === 0) {
    throw Error('No destination file given.');
  }

  if (options.useSassMap && options.useSassMap === true) {
    useSassMap = true;
    fileAs = filesAsSassMap;
  }

  if(options.sassMapName && options.sassMapName.length > 0) {
    sassMapName = options.sassMapName;
  }

  options.files = fs.readdirSync(options.src);
  options.fileList = {};
  options.content = '';

  options.files.forEach(function(file, i) {
    var fileName = file.replace(/\.[^/.]+$/, ''),
        fileContents = fs.readFileSync(options.src + file, 'utf8');

    options.fileList[fileName] = fileContents.replace(/\n|\r/gi, '');
    options.content +=  fileAs(fileName,options.fileList[fileName]);

    if(options.debug) {
      console.log('Processing file ' + chalk.cyan(file));
    }
  });

  options.content = (useSassMap) ? '$' + sassMapName + ': (\n' + options.content + ');' : options.content;

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
