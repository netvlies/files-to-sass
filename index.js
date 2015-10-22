var fs = require('fs'),
    chalk = require('chalk');

function filesAsVariables(fileName, fileContents, options, count) {
  return '$' + fileName + ': \''  + fileContents + '\'\;\n';
}

function filesAsSassMap(fileName, fileContents, options, count) {
  if(count === options.files.length - 1) {
    return '\t' + fileName + ': \''  + fileContents + '\'\n';
  } else {
    return '\t' + fileName + ': \''  + fileContents + '\'\,\n';
  }
}

var fileAs = filesAsVariables;

var options = {
  debug: false,
  sassMap: false,
  sassMapName: 'fileMap'
};

module.exports = function (options, callback) {
  if (!options) {
    throw Error('No config options are given.');
  }

  if (!options.src || options.src.length === 0) {
    throw Error('No source folder given.');
  }

  if (!options.dest || options.dest.length === 0) {
    throw Error('No destination file given.');
  }

  if (options.sassMap && options.sassMap === true) {
    fileAs = filesAsSassMap;
  }

  options.files = fs.readdirSync(options.src);
  options.fileList = {};
  options.content = '';

  // TODO: Fix this.
  // if(!fs.existsSync(options.dest)) {
  //   fs.mkdirSync(options.dest);
  // }

  options.files.forEach(function(file, i) {
    var fileName = file.replace(/\.[^/.]+$/, ''),
        fileContents = fs.readFileSync(options.src + file, 'utf8');

    options.fileList[fileName] = fileContents.replace(/\n|\r/gi, '');
    options.content += fileAs(fileName, options.fileList[fileName], options, i);

    if(options.debug) {
      console.log('Processed file ' + chalk.cyan(file));
    }
  });

  options.content = (options.sassMap) ? '$' + options.sassMapName + ': (\n' + options.content + ');' : options.content;

  fs.writeFile(options.dest, options.content, function(err, data) {
    if(err) {
      console.log('\nWriting to ' + chalk.cyan(options.dest) + ' didn\'t work out. :(');
      return;
    }

    if(options.debug) {
      console.log('\nWriting to ' + chalk.cyan(options.dest) + ' succesfull!');
    }

    if(callback) {
      callback(options.fileList);
    }
  });
};
