const github = require("@actions/github");

function getGitHubRepoName() {
    // return github.context.repo.repo
    return 'repo'
}

function getGitHubRepoDescription() {
    // return github.context.repo.repo
    return 'repo'
}

function getGitHubOrgName() {
    // return github.context.repo.owner
    return 'leanix'
}

module.exports = {getGitHubOrgName, getGitHubRepoDescription, getGitHubRepoName}