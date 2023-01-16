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

export interface ChannelHistory {
    bot_id: string | undefined,
    type: string | undefined,
    text: string | undefined,
    user: string | undefined,
}