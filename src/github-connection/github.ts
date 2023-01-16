import {Octokit} from "octokit";
import dotenv from 'dotenv';
import {ListPullsResponse} from "../types/types";

dotenv.config();

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS = 'uh-groupings-ui';
const OWNER = "devgav";
const REPO = "stock-trading-bot";

const octokit: Octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY
});

/**
 * Filters the pr's based on the date
 * @param pr - pr object
 * @param date - pr date
 */
function filterByTime(pr: any, date: Date): boolean {
    const d = new Date(pr.merged_at);
    d.setUTCHours(0, 0, 0, 0);
    return d.getTime() === date.getTime();
}

/**
 * Retrieves a list of pull requests
 * @param repo - the repo name that you are accessing
 * @param owner - the owner of the repo or organization if there is no owner
 * @param date - the day you want to filter for pull requests
 */
export async function retrieveMergedPullRequests(repo: string, owner: string, date: Date): Promise<ListPullsResponse["data"]> {
    return new Promise(async (resolve, reject) => {
        try {
            const pull_requests: ListPullsResponse = await octokit.request(`GET /repos/{owner}/{repo}/pulls`, {
                owner,
                repo,
                state: 'closed',
                merged: true,
                sort: 'updated',
                direction: 'desc',
                per_page: 10,
            });
            const octokit_response = pull_requests.data.filter((pr: any) => filterByTime(pr, date));
            resolve(octokit_response);
        } catch (e) {
            reject(e);
        }
    });
}
