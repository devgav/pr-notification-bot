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
    const PING_FOR_EVERY_30_SECONDS = '30 * * * * *';
    // Queue every minute
    const PING_FOR_EVERY_1_MINUTE = '*/1 * * * *'

    cron.schedule(PING_FOR_EVERY_30_SECONDS, async () => {
        const currentTime = new Date().toISOString();
        const merged_requests_ui = await retrieveMergedPullRequests(REPO_GROUPINGS_UI, OWNER_GROUPINGS);
        const merged_requests_api = await retrieveMergedPullRequests(REPO_GROUPINGS_API, OWNER_GROUPINGS);

        
    });

    const merged = [];
    
}