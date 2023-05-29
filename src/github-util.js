const github = require("@actions/github");

function getGitHubRepoName() {
  return github.context.repo.repo;
}

function getGitHubOrgName() {
  return github.context.repo.owner;
}

async function getGitHubRepoId() {
  console.log("##############################")
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  console.log("token: " + process.env.GITHUB_TOKEN);

  const query = `
    {
      repository(owner:"${github.context.repo.owner}", name:"${github.context.repo.repo}") {
        id
      }
    }
    `;
  console.log("Query: " + query);

  const response = await octokit.graphql(query);

  console.log("Response: " + response);
  console.log("repoId : " + response.repository.id);

  return response.repository.id;
}

module.exports = { getGitHubOrgName, getGitHubRepoName, getGitHubRepoId };
