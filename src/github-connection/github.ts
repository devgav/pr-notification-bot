import {Octokit} from "octokit";
import {Result} from "./interfaces/interfaces";
import dotenv from 'dotenv'

dotenv.config();

const octokit: Octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY
});

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS = 'uh-groupings-ui';
const OWNER = "devgav"; 
const REPO = "stock-trading-bot";
async function retrievePullRequests(repo: string, owner: string): Promise<Promise<Array<Result>> | undefined> {
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
        console.log(`Error finding UI pull requests`, e);
    }
}

console.log(await retrievePullRequests(REPO, OWNER));