import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import del from 'del';
import path from 'path';
import { fileURLToPath } from 'url';

const {
  src, dest, series, parallel
} = gulp;
function clean() {
  return del(['dist']);
}

function styles() {
  return src(['./src/components/**/*.scss'])
    .pipe(rename((p) => {
      const splitPath = p.dirname.split('/');
      // eslint-disable-next-line no-param-reassign
      p.dirname = splitPath[splitPath.length - 1];
    }))
    .pipe(dest('dist'));
}

function icons() {
  return src(['./src/components/base/Icon/assets/*.svg'])
    .pipe(dest('dist/Icon/assets'));
}

const aliases = {
  'MayflowerReactGenTeaser/(.*)$': './\\1',
  'MayflowerReactComponents/(.*)$': './\\1',
  'MayflowerReactAtoms/(.*)$': './\\1',
  'MayflowerReactAnimations/(.*)$': './\\1',
  'MayflowerReactButtons/(.*)$': './\\1',
  'MayflowerReactContact/(.*)$': './\\1',
  'MayflowerReactDivider/(.*)$': './\\1',
  'MayflowerReactHeadings/(.*)$': './\\1',
  'MayflowerReactLinks/(.*)$': './\\1',
  'MayflowerReactLists/(.*)$': './\\1',
  'MayflowerReactMedia/(.*)$': './\\1',
  'MayflowerReactPlaceholder/(.*)$': './\\1',
  'MayflowerReactTable/(.*)$': './\\1',
  'MayflowerReactText/(.*)$': './\\1',
  'MayflowerReactBase/(.*)$': './\\1',
  'MayflowerReactDataviz/(.*)$': './\\1',
  'MayflowerReactForms/(.*)$': './\\1',
  'MayflowerReactMolecules/(.*)$': './\\1',
  'MayflowerReactOrganisms/(.*)$': './\\1',
  'MayflowerReactPages/(.*)$': './\\1',
  'MayflowerReactTemplates/(.*)$': './\\1',
  'MayflowerReactUtilities/(.*)$': './\\1',
};

const sources = [
  'src/**/*.js',
  '!src/**/*.stories.js',
  '!src/**/*.knobs.options.js',
  '!src/**/*.knob.options.js',
  '!src/**/Colors/**',
  '!src/**/storyutils.js'
];

function resolvePath(sourcePath, currentFile, opts) {
  const entryPoint = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/index.js');
  const rootPath = currentFile === entryPoint ? './' : '../';
  let resolvedPath = null;
  Object.keys(opts.alias).forEach((alias) => {
    const check = new RegExp(alias);
    if (check.test(sourcePath)) {
      const matches = check.exec(sourcePath);
      resolvedPath = `${rootPath}${matches[1]}`;
      // ES Modules need to list out the extension on the end of the path,
      // otherwise index.js will be used instead of index.mjs.
      if (opts.hasOwnProperty('isES5') && opts.isES5 === true) {
        // List of exports that are files and not directories.
        const excludes = [
          'Input/error',
          'Input/context',
          'Input/utility',
          'Input/validate',
          'TabContainer/tab',
          'TabContainer/tab-body',
          'TabContainer/context',
          'utilities/componentPropTypeCheck',
          'Breadcrumb/item',
          'GenTeaser/utils'
        ];
        // If the current path is a file and not a directory...
        if (excludes.some((rule) => sourcePath.includes(rule))) {
          // Add the .mjs extension.
          resolvedPath = `${resolvedPath}.cjs`;
        } else {
          // Else, add the path to the index.mjs file the ES module needs.
          resolvedPath = `${resolvedPath}/index.cjs`;
        }
      }
    }
  });
  return resolvedPath || sourcePath;
}

function transpileES5() {
  return src(sources)
    
    .pipe(babel({
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            modules: 'commonjs'
          }
        ],
        [
          '@babel/preset-react',
          {
            development: false
          }
        ],
        [
          'babel-preset-proposals',
          {
            loose: true,
            decorators: true,
            classProperties: true,
            exportDefaultFrom: true,
            exportNamespaceFrom: true,
            absolutePaths: true
          }
        ]
      ],
      plugins: [
        [
          'module-resolver',
          {
            resolvePath,
            alias: aliases,
            isES5: true
          }
        ],
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        [
          'babel-plugin-transform-react-remove-prop-types',
          {
            mode: 'wrap'
          }
        ],
        [
          '@babel/plugin-transform-runtime',
          {
            absoluteRuntime: false,
            useESModules: false,
            helpers: false
          }
        ],
        'babel-plugin-add-module-exports'
      ]
    }))
    .pipe(rename((p) => {
      const splitPath = p.dirname.split('/');
      // eslint-disable-next-line no-param-reassign
      p.dirname = splitPath[splitPath.length - 1];
      // eslint-disable-next-line no-param-reassign
      p.extname = '.cjs';
    }))
    .pipe(dest('dist'));
}
function transpileES6() {
  return src(sources)
  .pipe(rename((p) => {
    const splitPath = p.dirname.split('/');
    // eslint-disable-next-line no-param-reassign
    p.dirname = splitPath[splitPath.length - 1];
  }))
    .pipe(babel({
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            modules: false
          }
        ],
        [
          '@babel/preset-react',
          {
            development: false
          }
        ],
        [
          'babel-preset-proposals',
          {
            loose: true,
            decorators: true,
            classProperties: true,
            exportDefaultFrom: true,
            exportNamespaceFrom: true,
            absolutePaths: true
          }
        ]
      ],
      plugins: [
        [
          'module-resolver',
          {
            resolvePath,
            alias: aliases,
            isES5: false
          }
        ],
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        [
          'babel-plugin-transform-react-remove-prop-types',
          {
            mode: 'wrap'
          }
        ],
        [
          '@babel/plugin-transform-runtime',
          {
            absoluteRuntime: false,
            useESModules: true,
            helpers: false
          }
        ]
      ]
    }))
    
    .pipe(dest('dist'));
}
export default series(clean, parallel(transpileES5, transpileES6, styles, icons));
