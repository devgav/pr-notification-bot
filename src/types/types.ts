import {Endpoints} from "@octokit/types";

export type ListPullsResponse = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"];
