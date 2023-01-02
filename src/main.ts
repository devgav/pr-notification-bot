import dotenv from "dotenv";
import pkg from "@slack/bolt";
import {getChannelMembers, listenForPullRequest} from "./slack/slack.js";

const { App } = pkg;
dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.APP_LEVEL_TOKEN
});

(async () => {
    const port = 3000;
    await app.start(process.env.PORT || port);
    await listenForPullRequest();
    await getChannelMembers();
    console.log(`Slack Bolt is running on port ${port}!`);
})();

export const { client } = app;

