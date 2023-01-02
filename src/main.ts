import dotenv from "dotenv";
import {RTMClient, WebClient} from "@slack/client";
import pkg from "@slack/bolt";
import {Channel, ChannelMembers} from "./interfaces/interfaces";

const { App } = pkg;
dotenv.config();

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN!);
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_LEVEL_TOKEN
});

(async () => {
    const port = 3000;
    await app.start(process.env.PORT || port);
    await rtm.start();
    console.log(`Slack Bolt is running on port ${port}!`);
})();
const { client } = app;

/**
 * Generates a new slack channel.
 * 
 * @param name - name of the channel
 * @return { id: string, name: string } - id of the slack channel and name of the slack channel.
 */
async function createChannel(name: string): Promise<Channel> {
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
async function getChannelMembers(): Promise<Array<ChannelMembers>> {
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
async function addMemberToChannel(channel: string, users: string): Promise<void> {
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
async function sendMessage(channel: string, text: string): Promise<void> {
    try {
        const result = await web.chat.postMessage({ channel, text });
        console.log(`Successfully sent message to ${result.channel}`); 
    } catch (e) {
        console.log(e);
    }
}

// ask for owner and repo when first getting started, either create web app or keep it with one channel using RTM (https://slack.dev/node-slack-sdk/rtm-api)


// await getChannelList();
const users = await getChannelMembers();
console.log(users);
// const channel = await createChannel("pr-notifications");
// await sendMessage('pr-notifications', 'a pr has been merged');
