import dotenv from "dotenv";
import pkg from "@slack/bolt";
import cron from "node-cron";
import {retrieveMergedPullRequests} from "./github-connection/github.js";
import {
    addMemberToChannel,
    createChannel,
    getChannelMembers,
    listenForPullRequest,
    retrieveDate, sendMessage
} from "./slack/slack.js";

const { App } = pkg;
dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_LEVEL_TOKEN
});

const OWNER_GROUPINGS = "uhawaii-system-its-ti-iam";
const REPO_GROUPINGS_UI = 'uh-groupings-ui';
const REPO_GROUPINGS_API = 'uh-groupings-api';

(async () => {
    const port = 3000;
    await app.start(process.env.PORT || port);

    console.log(`Slack Bolt is running on port ${port}!`);
    
    const test_date = new Date('2023-01-06T00:00:00.000Z');
    const { id, name } = await createChannel('pr-notification-channel-2');
    const channelMembers = await getChannelMembers();
    // { id, name, is_owner, is_primary_owner, is_bot }
    for (const channelMember of channelMembers) {
        if (channelMember.is_owner) {
            await addMemberToChannel(id!, channelMember.id!);
        }
    }
    // const current_date = await retrieveDate();
    while (true) {
        const data = await listenForPullRequest(test_date);
        let message = '';
        // Check the history using the oldest  keyword which will chekc the message AFTER the given timestamp
        // send the messages that aren't in the history
        data.forEach((pull_request) => {
            message = `Merged ${pull_request.html_url} to ${pull_request.number} *${pull_request.head.repo.name} ${pull_request.base.ref}* branch. Please update your branches whenever you are ready for the new changes.`;
        });
        await sendMessage(name!, message);
    }
})();

export const { client } = app;

