/**
 * This is a Gulp Task Registry.
 *
 * This file defines a multistage build with the following stages:
 *
 * Stage 1: Compile CSS/JS and copy assets to an intermediate directory (dist).
 * Stage 2: Copy all dist assets into the patternlab directory and build patternlab.
 *
 * The dist directory is what we base our composer package on, and it is in the same
 * general structure as what gets copied into the patternlab public directory.
 */

const DefaultRegistry = require("undertaker-registry");
const path = require("path");
const gulp = require("gulp");
const {exec} = require("child-process-promise");
const merge = require("merge-stream");
const browserSync    = require("browser-sync");
const del = require("del");
const filter = require("gulp-filter");

const e = require("./helpers/escape");
const cssPipe = require("./pipelines/css");
const jsPipe = require("./pipelines/js");


const task = function(name, cb, watch) {
    cb.displayName = name;
    cb.watchFiles = watch;
    return cb;
};

class DistRegistry extends DefaultRegistry {
    constructor(config) {
        super();
        this.config = config;
    }
    init(taker) {
        const self = this;
        const {config} = this;
        const {sources} = config;

        const clean = task("clean", function() {
            return del(self.resolveDist(), {force: true});
        });
        const css = task("css", function() {
            return gulp.src(sources.scss)
                .pipe(cssPipe(config.minify, self.resolveRoot()))
                .pipe(gulp.dest(self.resolveDist("assets/css")));
        });
        css.watchFiles = config.sources.scss;
        const assets = task("assets", function() {
            var pipes = [
                gulp.src(sources.distFiles).pipe(gulp.dest(self.resolveDist())),
                gulp.src(sources.images).pipe(gulp.dest(self.resolveDist("assets/images"))),
                gulp.src(sources.fonts).pipe(gulp.dest(self.resolveDist("assets/fonts"))),
                gulp.src(sources.data).pipe(gulp.dest(self.resolveDist("assets/data"))),
                gulp.src(sources.templates).pipe(gulp.dest(self.resolveDist("assets/js/templates"))),
                gulp.src(sources.modernizr).pipe(gulp.dest(self.resolveDist("assets/js/vendor"))),
                gulp.src(sources.patterns).pipe(filter("**/*.twig")).pipe(gulp.dest(self.resolveDist("twig")))
            ];
            return merge(pipes);
        });
        assets.watchFiles = [sources.images, sources.fonts, sources.data, sources.templates, sources.modernizr];

        const js = task("js", function() {
            var pipes = [
                gulp.src(sources.js)
                    .pipe(jsPipe.custom(config.minify))
                    .pipe(gulp.dest(self.resolveDist("assets/js")))
            ];
            return merge(pipes);
        });
        js.watchFiles = sources.jsWatch;

        const cleanPatterns = task('patternlab:clean-patterns', function() {
            return del(self.resolvePatternlab('patterns'))
        })
        const patterns = taker.series(cleanPatterns, task("patternlab:patterns", function() {
            return exec(`php ${e(self.resolveRoot("core/console"))} --generate --patternsonly`, {verbose: 3}).catch(function (err) {
                console.error('ERROR: ', err);
            });
        }));
        const copyPatterns = task("assets", function() {
           return gulp.src(sources.patterns).pipe(filter("**/*.twig")).pipe(gulp.dest(self.resolveDist("twig")))
        });
        patterns.watchFiles = sources.patterns;

        const copyDist = task("dist:copy", function() {
            return gulp.src(self.resolveDist("**"))
                .pipe(gulp.dest(self.resolvePatternlab()));
        });

        console.log('!!!!!!!!')
        console.log(js.watchFiles)
        console.log(patterns.watchFiles)

        taker.task("dist:build", taker.series(clean, taker.parallel(
            css,
            js,
            assets,
            copyPatterns
        )));
        taker.task("dist:watch", taker.series("dist:build", task("watcher", function() {
            taker.watch(css.watchFiles, css);
            taker.watch(js.watchFiles, js);
            taker.watch(assets.watchFiles, assets);
            taker.watch(patterns.watchFiles, copyPatterns);
        })));

        taker.task("patternlab:build", taker.series("dist:watch", copyDist, patterns ));
        taker.task("patternlab:serve", taker.series("patternlab:build", task("server", () => {
            const sync = browserSync.create();
            sync.init({
                port: 3000,
                open: false, // or  "external"
                notify: false,
                ghostMode: false,
                reloadDelay: 200,
                server: self.resolvePatternlab()
            });
            const reload = function(done) {
                sync.reload();
                done();
            };
            const copyAndReload = gulp.series(copyDist, reload);
            taker.watch(css.watchFiles, gulp.series(css, copyAndReload));
            taker.watch(js.watchFiles, gulp.series(js, copyAndReload));
            taker.watch(assets.watchFiles, gulp.series(assets, copyAndReload));
            taker.watch(patterns.watchFiles, gulp.series(patterns, copyPatterns, reload));
        })));
    }
    resolveRoot(subPath) {
        if(!this.config.sources.root) {
            throw new Error("Unable to determine root directory!");
        }
        return subPath ? path.resolve(this.config.sources.root, subPath) : this.config.sources.root;
    }
    resolveDist(subPath) {
        if(!this.config.dest.dist) {
            throw new Error("Please set config.dest.dist");
        }
        return subPath ? path.resolve(this.config.dest.dist, subPath) : this.config.dest.dist;
    }
    resolvePatternlab(subPath) {
        if(!this.config.dest.patternlab) {
            throw new Error("Please set config.dest.patternlab");
        }
        return subPath ? path.resolve(this.config.dest.patternlab, subPath) : this.config.dest.patternlab;
    }
}

module.exports = DistRegistry;
