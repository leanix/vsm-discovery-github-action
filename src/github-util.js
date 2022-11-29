const github = require("@actions/github");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

async function getRepoId(token) {
  const context = github.context;
  const octokit = github.getOctokit(token);
  const {
    data: { node_id: repoId },
  } = await octokit.rest.repos.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  console.log(repoId)

  return repoId;
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getRepoId };
