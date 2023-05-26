const github = require("@actions/github");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

function getGitHubRepoId() {
  return github.context.repo.id;
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getGitHubRepoId };
