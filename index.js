/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var util   = require('util'),
    gulp   = require('gulp'),
    cache  = require('gulp-cached'),
    eslint = require('gulp-eslint'),
    Plugin = require('spasdk/lib/plugin'),
    plugin = new Plugin({name: 'eslint', entry: 'lint', config: require('./config')});


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    // lint + watch
    profile.watch('', profile.data.watch,
        profile.task(plugin.entry, function () {
            var files = [];

            return gulp
                .src(profile.data.source || [])
                .pipe(cache('eslint'))
                .pipe(eslint())
                .pipe(eslint.results(function ( results ) {
                    // collect all problematic files
                    results.forEach(function ( result ) {
                        if ( result.errorCount || result.warningCount ) {
                            files.push(util.format('%s %s/%s',
                                result.filePath, result.errorCount, result.warningCount
                            ));
                        }
                    });

                    // success message
                    if ( files.length === 0 ) {
                        profile.notify({
                            info: 'no problems found',
                            tags: [self.entry]
                        });
                    }
                }))
                .pipe(eslint.format(profile.data.format, function ( result ) {
                    // failure message
                    profile.notify({
                        type: 'fail',
                        info: result,
                        data: files,
                        tags: [self.entry]
                    });
                }));
        })
    );
});


// public
module.exports = plugin;
