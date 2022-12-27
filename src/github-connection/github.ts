import {Octokit} from "octokit";
import {Result} from "./interfaces/interfaces";
import * as dotenv from 'dotenv'
dotenv.config();


const octokit: Octokit = new Octokit({
    auth: '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'
});

async function retrievePullRequests(repo: string): Promise<Promise<Array<Result>> | undefined> {
    try {
        const pull_requests = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
            owner: "uhawaii-system-its-ti-iam",
            repo,
        });
        return pull_requests.data.map(pr => ({
            title: pr.title,
            author_name: pr.user!.login,
            merged_date_time: pr.merged_at,
            
        }));
    } catch (e) {
        console.log(`Error finding UI pull requests`, e);
    }
}

function main() {
    setInterval(async () => {
        // Retrieve PR's from 
        const list_of_ui_prs = await retrievePullRequests("uh-groupings-ui");
        const list_of_api_prs = await retrievePullRequests("uh-groupings-api");
        if (list_of_api_prs != undefined) {
            const merged_api_prs: Array<Result> = list_of_api_prs.filter((pr) => (pr.merged_date_time != null));
            merged_api_prs.forEach(() => { 
                
            })
        }
        if (list_of_ui_prs != undefined) {
            const merged_ui_prs: Array<Result> = list_of_ui_prs.filter((pr) => (pr.merged_date_time != null));
        }
    }, 500);
}

await main();