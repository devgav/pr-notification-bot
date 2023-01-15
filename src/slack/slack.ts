import {Channel, ChannelMembers} from "../interfaces/interfaces";
import {client} from "../main.js";
import {retrieveMergedPullRequests} from "../github-connection/github.js";
import cron from 'node-cron';
import {ListPullsResponse} from "../types/types";

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS_UI = 'uh-groupings-ui';
const REPO_GROUPINGS_API = 'uh-groupings-api';

/**
 * Generates a new slack channel.
 *
 * @param name - name of the channel
 * @return { id: string, name: string } - id of the slack channel and name of the slack channel.
 */
export function createChannel(name: string): Promise<Channel> {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await client.conversations.create({
                name,
            });
            const channelInformation: Channel = {
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
export function getChannelMembers(): Promise<Array<ChannelMembers>> {
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

export function retrieveDate(): Promise<Date> {
    return new Promise((resolve, reject) => {
        try {
            cron.schedule('0 0 * * *', () => {
                const date = new Date();
                date.setHours(0, 0, 0, 0);
                resolve(date);
            });
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Listens for activity on a GitHub repo based on a specific number of times. By default, it will ping the repo every 30 seconds.
 * 
 * @param time(optional) - allows the bot to be pinged at a specific time see https://www.npmjs.com/package/node-cron on how to format the date
 * @param date - the current date
 */
export function listenForPullRequest( date: Date, time?: string): Promise<ListPullsResponse["data"]> {
    return new Promise((resolve, reject) => {
        try {
            const PING_FOR_EVERY_30_SECONDS = '*/30 * * * * *';
            const PING_TIME = time ? time : PING_FOR_EVERY_30_SECONDS;
            cron.schedule(PING_TIME, async () => {
                const merged_requests_ui = await retrieveMergedPullRequests(REPO_GROUPINGS_UI, OWNER_GROUPINGS, date);
                const merged_requests_api = await retrieveMergedPullRequests(REPO_GROUPINGS_API, OWNER_GROUPINGS, date);
                resolve([...merged_requests_ui, ...merged_requests_api])
            });
        } catch (e) {
            reject(e);
        }
    })
}