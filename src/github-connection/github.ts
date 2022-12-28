import {Octokit} from "octokit";
import {PRData, Result} from "./interfaces/interfaces";
import NodeCache from "node-cache";
import dotenv from 'dotenv'

dotenv.config();

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS = 'uh-groupings-ui';
const OWNER = "devgav";
const REPO = "stock-trading-bot";

const cache = new NodeCache();
const octokit: Octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY
});

/**
 * Retrieves a list of pull requests
 * @param repo - the repo name that you are accessing
 * @param owner - the owner of the repo or organization if there is no owner
 * @return  { title: string, author_name: string, merged_date_time: date, project_version: string, url: string, repo_name: string }
 */
async function retrievePullRequests(repo: string, owner: string): Promise<Promise<Array<PRData>> | undefined> {
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

/**
 * Caches the given result of a given pull request to node-cache
 * The cached result will be in the form of { key: string, val: obj }
 */
async function cachePullRequests(requests: Array<PRData>): Promise<void> {
    try {
        const cacheItem = requests.map((requestItem, index) => ({ key: index, val: requestItem }));
        cache.mset(cacheItem);
    } catch (e) {
        console.error(`Error: `, e);
    }
}


console.log(await retrievePullRequests(REPO, OWNER));