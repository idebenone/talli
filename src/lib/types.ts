export interface Event {
    event_id: string;
    event_owner: string;
    event_name: string;
    event_description: string;
    event_location: string;
    event_type: string;
    created_at: string;
    modified_at: string;
}

export interface SavedUser {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}

export interface EventUsers {
    event_user_id: string;
    user_role: string;
    users: SavedUser
}