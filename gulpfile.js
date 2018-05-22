var jsonfile = require('jsonfile');
//var path = require('path');
//var runSequence = require('run-sequence');
var gulp = require('gulp');
//var exit = require('gulp-exit');
//var argv = require('yargs').argv;
var mocha = require('gulp-mocha');
var mochawesome=require('mochawesome');
var mergeDirtreeAndMochawesome=require('merge-dirtree-and-mochawesome');
//var handlebars = require('gulp-compile-handlebars');
//var rename = require('gulp-rename');


var testsRootPath='Tests';
var mochAwesomeJsonFilePath='./mochawesome-report/mochawesome.json';
var mergedDirtreeAndMochawesomeJsonFilePath='./mochawesome-report/mergedDirtreeAndMochawesome.json';

gulp.task('runAll',function () {

    runSequence('mocha',
              'mergeDirtreeAndMochawesome'
              );

});

gulp.task('mocha', function () {
    gulp.src(testsRootPath, { read: false })
        .pipe(mocha({
            recursive: '',
            reporter: 'mochawesome'
        }))
        .on('error', function (e) {
            this.emit('end');
        })
        .on('end', function () {
            process.exit(0);
        });
});

gulp.task('mergeDirtreeAndMochawesome',function(){

    //var mochawesomeJson=jsonfile.readFileSync(mochAwesomeJsonFilePath);
    var config={
        dirTreeRootPath:testsRootPath,
        mochAwesomeJsonPath:mochAwesomeJsonFilePath,
        fileType:'js',
    };
    var mergedDirtreeAndMochawesomeJson=mergeDirtreeAndMochawesome(config);
    jsonfile.writeFileSync(mergedDirtreeAndMochawesomeJsonFilePath, mergedDirtreeAndMochawesomeJson, { spaces: 2 });
    
});

gulp.task('mochaDashboardReport', function () {
    
    var reportData = jsonfile.readFileSync(protractorMochaConfig.config.pathForMergedMochaJson);
    options = {
        ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
        partials: {
            footer: '<footer>the end</footer>'
        },
        batch: ['./MochaDashboardReport/partials'],
        helpers: {
            environment: function () {
                return env.environment;
            },
            capitals: function (str) {
                return str.toUpperCase();
            },
            hasFailed: function (statusFailedCount) {
                if (statusFailedCount > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
    return gulp.src('MochaDashboardReport/report.handlebars')
        .pipe(handlebars(reportData, options))
        .pipe(rename('mochaReport_' + env.environment + '.html'))
        .pipe(gulp.dest('MochaDashboardReport'));
});





//Only used if sharding test files is not used
/*gulp.task('mochaMergeTreeWithTestReport', function () { //To merge json out of the mocha directory structure

    var treeFilePath = protractorMochaConfig.config.pathForMochaDirectoryTreeJSON;
    var treeJson = jsonfile.readFileSync(treeFilePath);

    var testReportFilePath = protractorMochaConfig.config.pathForMochaJSON;
    var testReportJson = jsonfile.readFileSync(testReportFilePath);

    mergedJson = mochaMergeTreeWithTestReport(treeJson, testReportJson);

    jsonfile.writeFileSync(protractorMochaConfig.config.pathForMergedMochaJson, mergedJson, { spaces: 2 });

});*/
/*
gulp.task('mochaDirTree', function () { //To create json out of the mocha directory structure

    var tree = dirTree(protractorMochaConfig.config.pathMochaDirectory, ['.js']);
    var file = protractorMochaConfig.config.pathForMochaDirectoryTreeJSON;

    var text = __dirname;

    jsonfile.writeFileSync(file, tree, { spaces: 2 }, function (err) {
        
    });
});*/










