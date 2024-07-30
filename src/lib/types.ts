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

export type About = {
    index: number;
    title: string;
    description: string;
}[]

export type Authors = {
    name: string;
    pfp: string;
    description: string;
    socials: {
        twitter: string;
        github: string;
        linkedin: string;
        mail: string;
        discord: string;
    }
}[]

export interface UserProfile {
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

export interface CreateAnnouncement {
    event_id: string
    user_id: string
    an_content: {
        content: string
        gif: string
    }
}

export interface CreatePoll {
    user_id: string
    event_id: string
    poll_title: string
    poll_choices: {
        poll_choice_content: string
    }[]
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
    users: UserProfile
}

export interface Owner {
    name: string
    avatar_url: string
}

export interface Poll {
    type: string
    data: {
        poll_id: number
        event_id: string
        poll_owner: string
        poll_title: string
        created_at: Date
        modified_at: Date
    },
    created_at: Date,
    owner: Owner
    choices: PollChoices[]
    votes?: PollVotes[]
}

export interface PollChoices {
    choice_id: number
    poll_id: number
    poll_choice: string
    vote_count: number
    created_at: Date
    modified_at: Date
}

export interface PollVotes {
    vote_id: number
    poll_id: number
    choice_id: number
    user_id: string
    created_at: Date
    modified_at: Date
}

export interface Split {
    type: string
    data: {
        split_id: number
        event_id: string
        split_owner: string
        split_title: string
        split_amount: number
        created_at: Date
        modified_at: Date
    },
    created_at: Date,
    owner: Owner
    split_users: SplitUsers[]
}

export interface SplitUsers {
    split_user_id: number
    split_id: number
    user_id: string
    split_user_amount: number
    created_at: Date
    modified_at: Date
}

export interface Announcement {
    type: string
    data: {
        an_id: number
        event_id: string
        user_id: string
        an_content: {
            content: string
            gif: string
        },
        created_at: Date
        modified_at: Date
    }
    created_at: Date
    owner: Owner
}
