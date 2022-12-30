import {Octokit} from "octokit";
import dotenv from 'dotenv';
import Cache from "../cache/cache.js";
import {PRInformation} from "../types/types";
import _ from "underscore";

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
    return new Promise(async (resolve, reject) => {
        try {
            const pull_requests = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
                owner,
                repo,
            });
            resolve(pull_requests.data.map(pr => ({
                title: pr.title,
                author_name: pr.user!.login,
                merged_date_time: pr.merged_at,
                project_version: pr.base.ref,
                url: pr.html_url,
                repo_name: pr.head.repo.name,
            })));
        } catch (e) {
            reject(e);
        }
    });
}

// const cache = new Cache();
// setInterval(async () => {
//     // Retrieve the list of prs
//     const list_of_prs = await retrievePullRequests(REPO, OWNER);
//     // Cache prs
//     await cache.cachePullRequests(list_of_prs, REPO);
//     // Retrieve the cached prs
//     const retrievedData = await cache.retrieveCachedPullRequests(REPO);
//     console.log(`The retrieved data: `, retrievedData);
//     setTimeout(() => {
//         console.log()}, 5000);
//     const newPrs = await retrievePullRequests(REPO, OWNER);
//     const mergedPullRequests = await cache.retrieveMergedPullRequests(newPrs, REPO);
//     console.log(`The merged pull request data: `, mergedPullRequests);
// }, 5000);

// TODO: FIX THIS ERROR 
/**
 * The retrieved data:  [
 *   {                                                           
 *     title: 'test',                                            
 *     author_name: 'devgav',                                    
 *     merged_date_time: null,                                   
 *     project_version: 'main',                                  
 *     url: 'https://github.com/devgav/stock-trading-bot/pull/7',
 *     repo_name: 'stock-trading-bot'                            
 *   },
 *   {
 *     title: 'Add those lines back',
 *     author_name: 'devgav',
 *     merged_date_time: null,
 *     project_version: 'main',
 *     url: 'https://github.com/devgav/stock-trading-bot/pull/6',
 *     repo_name: 'stock-trading-bot'
 *   }
 * ]
 * The merged pull request data:  [
 *   {
 *     title: 'test',
 *     author_name: 'devgav',
 *     merged_date_time: null,
 *     project_version: 'main',
 *     url: 'https://github.com/devgav/stock-trading-bot/pull/7',
 *     repo_name: 'stock-trading-bot'
 *   },
 *   {
 *     title: 'Add those lines back',
 *     author_name: 'devgav',
 *     merged_date_time: null,
 *     project_version: 'main',
 *     url: 'https://github.com/devgav/stock-trading-bot/pull/6',
 *     repo_name: 'stock-trading-bot'
 *   }
 * ]
 */

const retrievedArray = [
    {
        title: 'test',
        author_name: 'devgav',
        merged_date_time: null,
        project_version: 'main',
        url: 'https://github.com/devgav/stock-trading-bot/pull/7',
        repo_name: 'stock-trading-bot'
    },
    {
        title: 'Add those lines back',
        author_name: 'devgav',
        merged_date_time: null,
        project_version: 'main',
        url: 'https://github.com/devgav/stock-trading-bot/pull/6',
        repo_name: 'stock-trading-bot'
    }
]

const mergeArray = [
    {
        title: 'test',
        author_name: 'devgav',
        merged_date_time: null,
        project_version: 'main',
        url: 'https://github.com/devgav/stock-trading-bot/pull/7',
        repo_name: 'stock-trading-bot'
    },
    // {
    //     title: 'Add those lines back',
    //     author_name: 'devgav',
    //     merged_date_time: null,
    //     project_version: 'main',
    //     url: 'https://github.com/devgav/stock-trading-bot/pull/6',
    //     repo_name: 'stock-trading-bot'
    // }
];

const uniqueResultOne = retrievedArray.filter(function(obj) {
    return !mergeArray.some(function(obj2) {
        return obj.title == obj2.title;
    });
});

const equals = _.isEqual(mergeArray[0], retrievedArray[0]);
const test = mergeArray[0] == retrievedArray[0];
console.log(`Filtered Data: `, uniqueResultOne);


 

