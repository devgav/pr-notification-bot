import {Octokit} from "octokit";
import dotenv from 'dotenv';
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
export async function retrieveMergedPullRequests(repo: string, owner: string): Promise<PRInformation> {
    return new Promise(async (resolve, reject) => {
        try {
            const pull_requests = await octokit.request("GET /repos/{owner}/{repo}/pulls?state=closed&sort=updated&direction=desc&merged=true", {
                owner,
                repo,
            });
            resolve(pull_requests.data.map((pr: any) => ({
                title: pr.title,
                author_name: pr.user!.login,
                merged_date_time: pr.merged_at,
                project_version: pr.base.ref,
                url: pr.html_url,
                repo_name: pr.head.repo.name,
                pull_number: pr.number,
            })));
        } catch (e) {
            reject(e);
        }
    });
}

console.log(`Todays Date: ${new Date().toISOString()}`)
console.log(await retrieveMergedPullRequests(REPO_GROUPINGS, OWNER_GROUPINGS))