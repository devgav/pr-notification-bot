export interface PRData {
    title: string,
    author_name: string,
    merged_date_time: string | null,
    project_version: string,
    url: string,
    repo_name: string,
    pull_number: number,
}

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