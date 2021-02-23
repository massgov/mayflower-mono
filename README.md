# Mayflower

Mayflower is the enterprise design system for the Commonwealth of Massachusetts.

* *[Documentation](/docs)*: Documentation for the overall design system, including guiding principals.
* *Implementations*: Implementations of Mayflower in various languages and technologies. Each implementation has its own documentation explaining how to use and work with it.
  - *[Mayflower Patternlab](/patternlab)* [![GitHub version][patternlab-github-badge]](/patternlab)
  - *[Mayflower React](/react)* [![npm package][react-npm-badge]](npm)
* *[Mayflower Site](/site)*: Static homepage site that is built with Mayflower React and Gatsby. Live at [mayflower.digital.mass.gov](https://mayflower.digital.mass.gov)

## License

This project is licensed under the is licensed under the GNU General Public License v2.0 - see the [LICENSE.txt](LICENSE.txt) file for details.

[patternlab-github-badge]: https://badge.fury.io/gh/massgov%2Fmayflower.svg
[react-npm-badge]: https://img.shields.io/npm/v/@massds/mayflower-react.png
[npm]: https://www.npmjs.com/package/@massds/mayflower-react

## Monorepo Package Management
This monorepo is managed using [Rush](https://rushjs.io/) and [PNPM](https://pnpm.js.org/).
#### Getting Started on Development
To get started, install rush globally by running the following command:

```
npm install -g @microsoft/rush
```

Once installed, run `rush install`. This will install pnpm and each package's dependencies on disk and symlink together all local packages that depend on one another.

To start developing mayflower react:
- `rush start:react`

To start developing mayflower patternlab:
- `rush start:patternlab`

To start developing mayflower site:
- `cd packages/react && rushx build` (build local @massds/mayflower-react)
- `rush start:site`

#### Monorepo Structure
All uses of `npm` or `yarn` have been replaced by `rushx`. `rushx` uses `pnpm run` behind the scenes to execute scripts within a package. For the moment, the following are defined as packages for the mayflower monorepo:

- Mayflower Assets (located under `packages/assets/`)
- Mayflower React (located under `packages/react/`)
- Mayflower Artifacts (located under `packages/patternlab/styleguide/`)
- `packages/site/`
```
// Mayflower monorepo

├── docs
├── packages
|  ├── assets *
|  |   ├── scss
|  |   └── static
|  |       ├── fonts
|  |       └── images
|  ├── patternlab
|  |   └── styleguide *
|  ├── react *
|  └── site *
```

Each packages' dependencies from npm are installed using Rush's cli tools. When using `rush install`, rush will use `pnpm install` behind the scenes within each package's directories. Each dependency is actually installed in a directory (.pnpm) located in your home directory and hardlinked to within Rush's internal temporary store at `common/temp/`. Each dependency of a package located under `<package-name>/node_modules/` is actually a hard symlink to rush's own temporary store at `common/temp/`.

Rush configuration is stored in the root directory as `rush.json`.

Each package also no longer uses package-lock.json or yarn.lock. Instead, a single pnpm-lock.yaml file is made under `common/temp/` which is created/updated when running rush commands.

Rush also either symlinks (by default) or local installs a copy of every package that uses one another from the monorepo. An example of this is Mayflower React. Mayflower React depends on Mayflower Assets, so under Mayflower React's `node_modules/` there is a symlink that points directly to the location of Mayflower Assets on disk instead of the rush temporary store under `common/temp/`.

#### Useful Commands

- `rush install` - Use this to install dependencies for all packages.
- `rush update` - Use this after updating rush/pnpm configurations.
- `rush build` - Use this to make production builds for all packages.
- `rush add` - Use this to add a new dependency to a package.
  - To add a dependency for a package, `cd` into the specific package directory and run `rush add --package "example@^1.2.3"`

> For more rush commands, see the [rush command documentation](https://rushjs.io/pages/commands/rush_add/).

#### Other Commands
When needing to run other commands for a package (such as starting up development mode), use `rushx` instead of `npm` or `yarn` in the package directory. For example, to run development mode for react, instead of using `npm run start`, move to the `packages/react/` direction and use `rushx start`.

### Custom Commands
Custom commands for rush are defined within `common/config/rush/command-line.json`. The following custom commands exist:
- `rush start:react` - Starts storybook in development mode for Mayflower React.
- `rush start:patternlab` - Starts patternlab in development mode for Mayflower Artifacts
- `rush start:site` - Starts gatsby in development mode for `packages/site`.

> For more information on custom commands see the [Rush custom commands documentation](https://rushjs.io/pages/maintainer/custom_commands/).

## Continuous Integration using CircleCI
By default, each push to a remote branch will trigger build and tests for React Storybook and Patternlab, deploy the Patternlab site build bundle to S3, as well as run the distribution build for the mayflower-tokens package in the [assets](/assets) folder.
For efficiency purposes, we allow CircleCI to bypass certain jobs based on the prefix of the branch name. Please only use these prefixes for the following scenarios:

| Branch name prefix  | Rule | Scenario |
|---|---|---|
| `react/`  | This will bypass Patternlab build, deploy and tests | This prefix should only be used if all your changes are in the [react](/react) folder, and nothing in the shared [assets](/assets) folder that could potentially impact the build of the Patternlab implementation  |
| `pattern/`  | This will bypass React Storybook build and tests | This prefix should only be used if all your changes are in the [patternlab](/patternlab) folder, and nothing in the shared [assets](/assets) folder that could potentially impact the build of the React implementation  |
| `site/`  | This will bypass all React and Patternlab and assets build, deploy and tests. |  Only use this prefix if all the changes are in the [site](/site) folder. e.g. Content changes to the homepage site that won't impact React, Patternlab and shared assets. |
| `docs`  | This will bypass all React and Patternlab and assets build, deploy and tests, as well as Mayflower site build and tests. | Only use this prefix if all the changes are in the [docs](/docs) folder. e.g. Documentation changes for the repo and the Mayflower Gitbook that won't impact React, Patternlab, shared assets and the homepage static site. |
