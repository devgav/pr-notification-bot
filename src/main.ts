import dotenv from "dotenv";
import {RTMClient, WebClient} from "@slack/client";
import pkg from "@slack/bolt";

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
async function createChannel(name: string) {
    try {
        const result = await client.conversations.create({
            name,
        });
        console.log(`Successfully created channel: ${result.channel.name} with channel id ${result.channel.id}`);
    } catch (error) {
        console.log(error);
    }
}

// retrieve a list of members from a slack channel 
async function getChannelMembers(channelId: string) {
    try {
        const result = await client.conversations.members({channel: channelId});
        return result.members as String[];
    } catch (e) {
        console.log(e);
    }
}

// add members to channel.
async function addMembersToChannel(channel: string) {
    
}
// add new members to channel.

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

await createChannel("pr-notifications");
await sendMessage('pr-notifications', 'a pr has been merged');