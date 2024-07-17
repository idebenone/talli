export type Site = {
    name: string;
    title: string;
    description: string;
    keywords: string[];
    siteUrl: string;
    creator: {
        name: string;
        url: string;
    }[]
    ogImage: string;
    links: {
        x: string;
        github: string;
    }
}

export interface SavedUser {
    id: string
    name: string
    email: string
    avatar_url: string
}

export interface CreateEvent {
    event_owner: string,
    event_name: string
    event_description: string
    event_location: string
    event_target?: string
    event_theme: string
}

export interface Event {
    event_id: string
    event_owner: string
    event_name: string
    event_description: string
    event_location: string
    event_target: string
    event_theme: string
    created_at: string
    modified_at: string
}

export interface EventUsers {
    event_user_id: string
    user_role: string
    users: SavedUser
}

export interface CreatePoll {
    user_id: string
    event_id: string
    poll_title: string
    poll_choices: {
        poll_choice_content: string
    }[]
}

export interface Poll {
    poll_id: string
    user_id: string
    event_id: string
    poll_content: string
    created_at: Date
    modified_at: Date
}

export interface PollChoices {
    choice_id: string
    poll_id: string
    poll_choice: string
    vote_count: string
    creatd_at: Date
    modified_at: Date
}

export interface CreateSplit {
    event_id: string
    split_owner: string
    split_title: string
    split_amount: number
    split_users: {
        user_id: string
        split_user_amount: number
    }[]
}

export interface Split {
    split_id: number
    event_id: string
    split_owner: string
    split_title: string
    split_amount: number
    created_at: Date
    modified_at: Date
    owner: Owner
    split_users: SplitUsers[]
}

export interface Owner {
    name: string
    avatar_url: string
}

export interface SplitUsers {
    split_user_id: number
    split_id: number
    user_id: string
    split_user_amount: number
    created_at: Date
    modified_at: Date
}


export interface CreateAnnouncement {
    event_id: string
    user_id: string
    an_content: {
        content: string
        gif: string
    }
}

export interface Announcement {
    an_id: number
    event_id: string
    user_id: string
    an_content: {
        content: string
        gif: string
    },
    owner: Owner
    created_at: Date
    modified_at: Date
}
