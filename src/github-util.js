const github = require("@actions/github");
const core = require('@actions/core');


function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

function getRepoId() {
  const token = core.getInput("github-token")
  const context= github.context
  const octo = github.getOctokit(token)
  const { data.node_id: repoId } = await octo.rest.repos.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
  })

  return repoId;
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getRepoId};
