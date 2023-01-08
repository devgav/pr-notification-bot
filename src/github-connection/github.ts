import {Octokit} from "octokit";
import dotenv from 'dotenv';
import {PRInformation} from "../types/types";
import {PRData} from "../interfaces/interfaces";

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
function filterByTime(pr: any, date: Date) {
    const d = new Date(pr.merged_at);
    if (d.getTime() >= date.getTime() && pr.head.repo.name) {
        return {
            title: pr.title,
            author_name: pr.user!.login,
            merged_date_time: pr.merged_at,
            project_version: pr.base.ref,
            url: pr.html_url,
            repo_name: pr.head.repo.name,
            pull_number: pr.number,
        }
    }
}
/**
 * Retrieves a list of pull requests
 * @param repo - the repo name that you are accessing
 * @param owner - the owner of the repo or organization if there is no owner
 * @return  { title: string, author_name: string, merged_date_time: date, project_version: string, url: string, repo_name: string }
 */
export async function retrieveMergedPullRequests(repo: string, owner: string): Promise<Array<PRData>> {
    return new Promise(async (resolve, reject) => {
        try {
            // Set the current dates milliseconds and seconds to 0.
            const date = new Date();
            // const current_utc_date = new Date(date.setSeconds(0));
            // current_utc_date.setMilliseconds(0);
            date.setHours(0, 0, 0, 0);
            console.log(date);
            // state=closed&sort=updated&direction=desc&merged=true&since=${date}
            const pull_requests = await octokit.request(`GET /repos/{owner}/{repo}/pulls`, {
                owner,
                repo,
                state: 'closed',
                merged: true,
                sort: 'updated',
                direction: 'desc',
                per_page: 10,
            });
            resolve(pull_requests.data.filter((pr: any) => filterByTime(pr, date)));
        } catch (e) {
            reject(e);
        }
    });
}
// console.log(await retrieveMergedPullRequests(REPO_GROUPINGS, OWNER_GROUPINGS))