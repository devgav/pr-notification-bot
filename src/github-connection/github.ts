import {Octokit} from "octokit";
import {PRData} from "../interfaces/interfaces";
import dotenv from 'dotenv';
import Cache from "../cache/cache.js";
import {PRInformation} from "../types/types";

dotenv.config();

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS = 'uh-groupings-ui';
const OWNER = "devgav";
const REPO = "stock-trading-bot";

const octokit: Octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY
});

/**
 * Retrieves a list of pull requests
 * @param repo - the repo name that you are accessing
 * @param owner - the owner of the repo or organization if there is no owner
 * @return  { title: string, author_name: string, merged_date_time: date, project_version: string, url: string, repo_name: string }
 */
async function retrievePullRequests(repo: string, owner: string): Promise<PRInformation> {
    try {
        const pull_requests = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
            owner,
            repo,
        });
        return pull_requests.data.map(pr => ({
            title: pr.title,
            author_name: pr.user!.login,
            merged_date_time: pr.merged_at,
            project_version: pr.base.ref,
            url: pr.html_url,
            repo_name: pr.head.repo.name,
        }));
    } catch (e) {
        console.error(`Error finding UI pull requests`, e);
    }
}

const cache = new Cache();
setInterval(async () => {
    const list_of_prs = await retrievePullRequests(REPO, OWNER);
    await cache.cachePullRequests(list_of_prs, REPO);
    const retrievedData = await cache.retrieveCachedPullRequests(REPO);
    const newPrs = await retrievePullRequests(REPO, OWNER);
    const mergedPullRequests = await cache.retrieveMergedPullRequests(newPrs, REPO);
    console.log(`The retrieved data: `, retrievedData);
    console.log(`The merged pull request data: `, mergedPullRequests);
}, 1000);
