export interface ChannelMembers {
    id: string | undefined,
    name: string | undefined,
    is_owner: boolean | undefined,
    is_primary_owner: boolean | undefined,
    is_bot: boolean | undefined
}

export interface Channel {
    id: string | undefined,
    name: string | undefined,
}

export interface Message {
    bot_id: string,
    type: string,
    text: string,
    user: string,
    ts: string,
    app_id: string,
    team: string
}
