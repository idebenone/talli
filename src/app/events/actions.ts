'use server'

import { CreateCountDown, CreatePoll } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* TODO -> create a rpc to handle the transaction on supabase */
export async function createEvent(data: any) {
    const supabase = createClient();
    const { data: eventData, error } = await supabase.from("events").insert([data]).select();
    if (error) redirect("/error")
    if (eventData) {
        await supabase.from("event_users").insert([{ event_id: eventData[0].event_id, user_id: data.event_owner, user_role: "owner" }]);
        revalidatePath('/', 'layout');
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
    revalidatePath('/', 'layout');
    return data;
}

/* individual event details and countdown */
export async function getEvent(event_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("events").select(`*, countdown(*)`).eq("event_id", event_id);
    if (error) redirect("/error")
    revalidatePath('/', 'layout')
    return data;
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
    revalidatePath("/", 'layout')
    return data;
}

/* havent tested yet*/
export async function removeEventUser(event_user_id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("event_users").delete().eq("event_user_id", event_user_id);
    if (error) redirect("/error")
    revalidatePath("/", "layout")
}

/* create countdown */
export async function createCountDown(countdown: CreateCountDown) {
    const supabase = createClient();
    const { error } = await supabase.from("countdown").insert([countdown]);
    if (error) redirect("/error")
    revalidatePath("/", "layout")
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
    revalidatePath("/", 'layout')
}

export async function removePoll(poll_id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("poll").delete().eq("poll_id", poll_id);
    if (error) redirect("/error")
    revalidatePath("/", 'layout')
}
