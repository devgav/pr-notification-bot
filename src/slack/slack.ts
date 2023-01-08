import {Channel, ChannelMembers} from "../interfaces/interfaces";
import {client} from "../main.js";
import {retrieveMergedPullRequests} from "../github-connection/github.js";
import cron from 'node-cron';

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS_UI = 'uh-groupings-ui';
const REPO_GROUPINGS_API = 'uh-groupings-api';

/**
 * Generates a new slack channel.
 *
 * @param name - name of the channel
 * @return { id: string, name: string } - id of the slack channel and name of the slack channel.
 */
export async function createChannel(name: string): Promise<Channel> {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await client.conversations.create({
                name,
            });
            const channelInformation = {
                id: result.channel?.id,
                name: result.channel?.name,
            }
            console.log(`Successfully created channel: ${result.channel?.name} with channel id ${result.channel?.id}`);
            resolve(channelInformation);
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
}

// retrieve a list of members from a slack channel 
export async function getChannelMembers(): Promise<Array<ChannelMembers>> {
    return new Promise(async (resolve, reject) => {
        try {
            const results = await client.users.list();
            let channelMembers: Array<ChannelMembers> = [];
            if (results?.members && results?.members?.length > 0) {
                channelMembers = results.members.map((member) => {
                    const { id, name, is_owner, is_primary_owner, is_bot } = member;
                    return {
                        id,
                        name,
                        is_owner,
                        is_primary_owner,
                        is_bot,
                    }
                });
            }
            resolve(channelMembers);
        } catch (e) {
            reject(e);
            console.log(e);
        }
    });
}

// add new members to channel.
export async function addMemberToChannel(channel: string, users: string): Promise<void> {
    try {
        await client.conversations.invite({ channel, users });
    } catch (e) {
        console.log(e);
    }
}
/**
 * Send message to a slack channel.
 *
 * @param text - the message you want to send to your channel
 * @param channel - the channel you want to send your message to
 */
export async function sendMessage(channel: string, text: string): Promise<void> {
    try {
        const result = await client.chat.postMessage({ channel, text });
        console.log(`Successfully sent message to ${result.channel}`);
    } catch (e) {
        console.log(e);
    }
}

export async function listenForPullRequest(time?: string) {
    const d = '30 * * * * *';
    // Queue every minute
    const v = '*/1 * * * *'
    const merged_requests_api = await retrieveMergedPullRequests(REPO_GROUPINGS_UI, OWNER_GROUPINGS);
    console.log(merged_requests_api)

    // cron.schedule(d, async () => {
    //     const currentTime = new Date().toISOString();
    //     const merged_requests_ui = await retrieveMergedPullRequests(REPO_GROUPINGS_UI, OWNER_GROUPINGS);
    //     const merged_requests_api = await retrieveMergedPullRequests(REPO_GROUPINGS_API, OWNER_GROUPINGS);
    //     // console.log(merged_requests_ui);
    //     // filter the ui and api for if they were queued in the last n seconds
    //     // if (merged_requests_api && merged_requests_api.length > 0) {
    //     //     merged_requests_api.filter((api_pr) => (new Date(api_pr.merged_date_time as string).getTime() <= new Date().getTime() ))
    //     // }
    //     // if (merged_requests_ui && merged_requests_ui.length > 0) {
    //     //     // Filter for the date
    //     //     // Filter for the 
    //     //     merged_requests_ui.filter((ui_pr) => (new Date(ui_pr.merged_date_time as string).getTime() <= new Date().getTime()))
    //     // }
    //     // console.log(merged_requests_ui);
    //     // combine the ui and api merges together 
    //     console.log('running every two minutes');
    // });

    const merged = [];
    
}