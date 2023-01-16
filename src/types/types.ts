import {Endpoints} from "@octokit/types";
import {ChannelHistory} from "../interfaces/interfaces";

export type ListPullsResponse = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"];
export type ChannelHistoryResponse = Array<ChannelHistory> | undefined;