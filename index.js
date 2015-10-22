var fs = require('fs'),
    chalk = require('chalk'),
    parsePath = require('parse-filepath');

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

module.exports = function (options, cb) {
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
  options.destPath = parsePath(options.dest).dirname;

  fs.stat(options.destPath, function(err, stats) {
    if(!err && stats.isDirectory()) {
      createSassFile(options, cb);
    } else {
      fs.mkdir(options.destPath, function(err) {
        if(options.debug) {
          log('Created directory ' + chalk.yellow(options.destPath));
        }
        
        createSassFile(options, cb);
      });
    }
  });
};

function createSassFile(options, cb) {
  options.files.forEach(function(file, i) {
    var fileName = file.replace(/\.[^/.]+$/, ''),
        fileContents = fs.readFileSync(options.src + file, 'utf8');

    options.fileList[fileName] = fileContents.replace(/\n|\r/gi, '');
    options.content += fileAs(fileName, options.fileList[fileName], options, i);

    if(options.debug) {
      log('Processed file ' + chalk.cyan(file));
    }
  });

  options.content = (options.sassMap) ? '$' + options.sassMapName + ': (\n' + options.content + ');\n' : options.content;

  fs.writeFile(options.dest, options.content, function(err, data) {
    if(err) {
      throw Error('\nWriting to ' + chalk.cyan(options.dest) + ' didn\'t work out. :(');
    } else {
      if(options.debug) {
        log('Writing to ' + chalk.cyan(options.dest) + ' succesfull!');
      }

      if(cb) {
        cb(options.fileList);
      }
    }
  });
}

function log(stuff) {
  console.log(chalk.grey('[files-to-sass] ') + stuff);
}
