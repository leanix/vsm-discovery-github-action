const github = require("@actions/github");

function getGitHubRepoName() {
    return github.event.repository.name
}

function getGitHubRepoDescription() {
    return github.event.repository.description
}

function getGitHubOrgName() {
    return github.event.repository.organization.name
}

module.exports = {getGitHubOrgName, getGitHubRepoDescription, getGitHubRepoName}