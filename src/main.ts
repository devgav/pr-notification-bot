import dotenv from "dotenv";
import pkg from "@slack/bolt";
import {
    addMemberToChannel,
    createChannel, getChannelHistory,
    getChannelMembers,
    listenForPullRequest,
    sendMessage
} from "./slack/slack.js";
// @ts-ignore
import {ChannelsHistoryResponse} from "@slack/client";
import {Message} from "./interfaces/interfaces";

const { App } = pkg;
dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_LEVEL_TOKEN
});

let regex = /https:\/\/github\.com\/[a-zA-Z-]+\/[a-zA-Z-]+\/pull\/\d+/;

function mapfeature(history: ChannelsHistoryResponse): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        try {
            const historyMap: Array<string> = [];
            if (history.messages.length > 0) {
                for (let key of history.messages as Message[]) {
                    if (key.bot_id) {
                        // find the url
                        let text = key.text;
                        let url = text.match(regex)![0];
                        historyMap.push(url);
                    }
                }
            }
            resolve(historyMap);
        } catch (e) {
            reject(e);
        }
    })
}
(async () => {
    const port = 3000;
    await app.start(process.env.PORT || port);
    console.log(`Slack Bolt is running on port ${port}!`);
    
    const { id, name } = await createChannel('pr-notification-channel');
    const channelMembers = await getChannelMembers();
    // { id, name, is_owner, is_primary_owner, is_bot }
    for (const channelMember of channelMembers) {
        if (channelMember.is_owner) {
            await addMemberToChannel(id!, channelMember.id!);
        }
    }
    let now = new Date();
    let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    utc.setUTCHours(0,0,0,0);
    let timestamp = utc.getTime() / 1000;

    while (true) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const data = await listenForPullRequest(date);
        let message = '';
        let history: ChannelsHistoryResponse = await getChannelHistory(id!, timestamp.toString());
        let hmap = await mapfeature(history);
        console.log(`Current hmap is: `, hmap);
        for (const pull_request of data) {
            message = `Merged ${pull_request.html_url} to ${pull_request.number} *${pull_request.head.repo.name} ${pull_request.base.ref}* branch. Please update your branches whenever you are ready for the new changes.`;
            if (!hmap.includes(pull_request.html_url)) {
                await sendMessage(name!, message);
            }
        }
    }
})();

export const { client } = app;

