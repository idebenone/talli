'use server'

import { CreateEvent, CreatePoll, Event } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

/* TODO -> create a rpc to handle the transaction on supabase */
export async function createEvent(data: CreateEvent) {
    const supabase = createClient();
    const { data: eventData, error } = await supabase.from("events").insert([data]).select();
    console.log(error)
    if (error) redirect("/error")
    if (eventData) {
        await supabase.from("event_users").insert([{ event_id: eventData[0].event_id, user_id: data.event_owner, user_role: "owner" }]);
        redirect('/events');
    }
}

/* fetch all events where an user exists */
/* currently its fetching only events created by the user i,e owner */
/* TODO -> fetch other events where the user exists */
export async function getEvents(user_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("events").select("*").eq("event_owner", user_id);
    if (error) redirect("/error");
    return data;
}

/* individual event details */
export async function getEvent(event_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("events").select(`*`).eq("event_id", event_id);
    if (error) redirect("/error")
    return data;
}

/* update event details */
export async function updateEvent(event: Event) {
    const supabase = createClient();
    const { status } = await supabase.from("events").update([event]).eq("event_id", event.event_id).eq("event_owner", event.event_owner);
    return status
}

/* delete an event */
export async function deleteEvent(event_id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("event_id", event_id);
    console.log(error)
}

/* event users api goes here */
export async function getEventUsers(event_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
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
    if (error) redirect("/error")
    return data;
}

/* havent tested yet*/
export async function removeEventUser(event_user_id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("event_users").delete().eq("event_user_id", event_user_id);
    if (error) redirect("/error")
}

/* create poll */
export async function createPoll(poll: CreatePoll) {
    const supabase = createClient();
    const { error } = await supabase.rpc("insert_poll_and_choices", {
        user_id: poll.user_id,
        event_id: poll.event_id,
        poll_title: poll.poll_title,
        poll_choices: poll.poll_choices
    })
    console.log(error)
    if (error) redirect("/error")
}

export async function removePoll(poll_id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("poll").delete().eq("poll_id", poll_id);
    if (error) redirect("/error")
}
