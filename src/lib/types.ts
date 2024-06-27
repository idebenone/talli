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

