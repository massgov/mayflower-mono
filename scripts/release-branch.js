const { octokit, minor } = require('./release-vars');
const fs = require('fs');
const path = require('path');
const tempLogsPath = `${path.resolve(__dirname, '../')}/tempLogs.json`;
// Get data from tempLogs JSON
const { newLogsWithTitle, changelogs } = JSON.parse(fs.readFileSync(tempLogsPath, 'utf-8'))

// Added shelljs to use maybe in the script "npm install shelljs"
// https://github.com/shelljs/shelljs
const shell = require('shelljs');

// Added simple-git to use for git add "npm install simple-git"
// Could not use the shell.exec to git add the remove changelogs.
const git = require('simple-git/promise')();


// Checkout the branch.
const releaseBranch = 'release/' + minor;

(async function() {
  // This asynchronous logic will happen sequentially.
  // If an error is thrown, it will break out of this
  // asynchronous function immediately and exit 1.

  // Create the release branch and push to Github.
  shell.exec(`git branch -D ${releaseBranch}`)
  await git.checkoutLocalBranch(releaseBranch)
  await git.add('./*');
  await git.commit('Changelog update and remove old changelog files');
  // Use a force-push so if we have an old version of the branch sitting around
  // (eg: an unreleased one from last week), it gets updated regardless.
  await git.push('origin', releaseBranch, {'--force': null});

  // Create the pull request in GitHub
  await octokit.pulls.create({
    owner: 'massgov',
    repo: 'mayflower',
    title: `Release ${minor}`,
    head: releaseBranch,
    base: 'master',
    body: newLogsWithTitle
  });
})().catch(function(err) {
  console.error(`There was an error thrown during the cutting of the release PR: ${err.toString()}`);
  process.exit(1);
})
