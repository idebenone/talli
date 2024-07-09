'use server'

import { CreateAnnouncement, CreateEvent, CreatePoll, CreateSplit, Event } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

export async function createEvent(data: CreateEvent) {
    const supabase = createClient();
    return await supabase.rpc("insert_event_and_owner", data);
}

export async function getEvents(user_id: string) {
    const supabase = createClient();
    return await supabase
        .from("event_users")
        .select("events(*)")
        .eq("user_id", user_id);
}

export async function getEvent(event_id: string, user_id: string) {
    const supabase = createClient();
    return await supabase.from("event_users").select(`events(*)`).eq("event_id", event_id).eq("user_id", user_id).limit(1);
}

export async function updateEvent(event: Event) {
    const supabase = createClient();
    return await supabase.from("events").update([event]).eq("event_id", event.event_id).eq("event_owner", event.event_owner);
}

export async function deleteEvent(event_id: string) {
    const supabase = createClient();
    return await supabase.from("events").delete().eq("event_id", event_id);
}

export async function getEventUsers(event_id: string) {
    const supabase = createClient();
    return await supabase
        .from('event_users')
        .select(`
            event_user_id,
            user_role, 
            users (
                id,
                name,
                email,
                avatar_url
            )
        `)
        .eq('event_id', event_id);
}

export async function removeEventUser(event_user_id: string) {
    const supabase = createClient();
    return await supabase.from("event_users").delete().eq("event_user_id", event_user_id);
}

export async function createPoll(poll: CreatePoll) {
    const supabase = createClient();
    return await supabase.rpc("insert_poll_and_choices", {
        user_id: poll.user_id,
        event_id: poll.event_id,
        poll_title: poll.poll_title,
        poll_choices: poll.poll_choices
    })
}

export async function removePoll(poll_id: string) {
    const supabase = createClient()
    return await supabase.from("poll").delete().eq("poll_id", poll_id);
}

export async function createSplit(data: CreateSplit) {
    const supabase = createClient();
    return await supabase.rpc("insert_split_and_users", data);
}

export async function createAnnouncement(data: CreateAnnouncement) {
    const supabase = createClient();
    return await supabase.from("announcements").insert([data]);
}

export async function getEventBody(event_id: string) {
    const supabase = createClient();
    return await supabase.rpc('get_event_body', { event_id });
}
