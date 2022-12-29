import {PRInformation} from "../types/types";
import NodeCache from "node-cache";
import _ from 'underscore';
const cache = new NodeCache();

class Cache {
    /**
     * Caches the given result of a given pull request to node-cache.
     * The cached result will be in the form of { key: string, val: obj }
     *
     * @param request - the requested data to cache
     * @param key - the key to cache the result
     */
    async cachePullRequests(request: PRInformation, key: string): Promise<void> {
        return new Promise((resolve, reject) => {
           try {
               const retrievedPr: PRInformation = cache.get(key);
               if (retrievedPr) {
                   cache.del(key);
               }
               cache.set(key, request, 0);
               resolve();
           } catch (e) {
               reject(e);
           }
        });
    }

    /**
     * Retrieve the cached pull requests
     * @param key - the key to access the requested data
     */
    async retrieveCachedPullRequests(key: string): Promise<PRInformation> {
        return new Promise((resolve, reject) => {
           try {
               resolve(cache.get(key));
           } catch (e) { 
               reject(e);
           }
        });
    }

    /**
     * Retrieve all pull requests that were merged by returning the difference between the pr in cache and current pr's listed.
     * @param currentPrs
     * @param key
     */
    async retrieveMergedPullRequests(currentPrs: PRInformation, key: string): Promise<PRInformation> {
        return new Promise((resolve, reject) => {
            try {
                const cachedData: PRInformation = cache.get(key);
                let mergedPullRequest: PRInformation = [];
                if (cachedData !== undefined && currentPrs !== undefined) {
                    for (const pr of currentPrs) {
                        for (const cache of cachedData) {
                            if (!_.isEqual(pr, cache)) {
                                mergedPullRequest.push(pr);
                            }
                        }
                    }
                }
                resolve(mergedPullRequest);
            } catch (e) {
                reject(e);
            }
        });
    }
}

export default Cache;