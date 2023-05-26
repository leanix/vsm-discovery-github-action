const github = require("@actions/github");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

function getGitHubRepoId() {
  // without GitHub token we can't receive the repoId, using the repoName as identifier for now
  return github.context.repo.repo
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getGitHubRepoId };
