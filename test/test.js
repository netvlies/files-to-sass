var filesToSass = require('../index.js');

console.log('\nRunning with result set to normal variables...\n');

filesToSass({
    src: 'test/input/',
    dest: 'test/output/variables.scss',
    debug: true
}, function(fileList) {
    console.log('\nSuccesfully executed with normal variables, callback with file list object:\n');
    console.log(fileList);
});

console.log('\nRunning with result set to Sass map...\n');

filesToSass({
    src: 'test/input/',
    dest: 'test/output/sassmap.scss',
    sassMap: true,
    sassMapName: 'files',
    debug: true
}, function(fileList) {
    console.log('\nSuccesfully executed with Sass map, callback with file list object:\n');
    console.log(fileList);
});

console.log('\nDone testing.');
