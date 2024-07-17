'use server'

import { CreateAnnouncement, CreateEvent, CreatePoll, CreateSplit, Event } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';

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
    return await supabase.from("announcements").insert([data]).select().single();
}

export async function getEventBody(event_id: string) {
    const supabase = createClient();
    return await supabase.rpc('get_event_body', { event_id });
}

export async function addVote(poll_id: any, user_id: any,choice_id: any) {
    const supabase = createClient();
    
    const { data: existingVote, error: fetchError } = await supabase
    .from("poll_votes").select("*").eq("poll_id", poll_id).eq("user_id", user_id).single();
    
    if(existingVote){

        const { data: existingChoice, error: existingChoiceError } = await supabase
        .from("poll_choices").select("vote_count").eq("choice_id", existingVote.choice_id).single();

        if(existingChoiceError) return

        const { error: incrementError } = await supabase
            .from("poll_choices").update({ vote_count: existingChoice.vote_count - 1 })
            .eq("choice_id", existingVote.choice_id).eq("poll_id", poll_id);
        

        const { data, error } = await supabase
        .from("poll_votes").update({ choice_id })
        .eq("poll_id", poll_id).eq("user_id", user_id);

        if (error) {
            console.error(error);
            return;
        }

        

    }
    else {
        const { data, error } = await supabase.from("poll_votes")
        .insert([{ poll_id, user_id, choice_id }]).select();

        if (error) {
        console.error("Error inserting new vote:", error);
        return;
        }

        
    }
    const { data: newChoice, error: newChoiceError } = await supabase
        .from("poll_choices").select("vote_count").eq("choice_id", choice_id).eq("poll_id", poll_id).single();

        if (newChoiceError) {
            console.error(newChoiceError);
            return;
        }

        const { error: incrementError } = await supabase
            .from("poll_choices").update({ vote_count: newChoice.vote_count + 1 })
            .eq("choice_id", choice_id).eq("poll_id", poll_id);
     
}

export async function getPollVotesByUser(event_id:any,user_id:any){
    const supabase = createClient();
    const { data, error } = await supabase.from("poll_votes").
    select("*").eq("event_id",event_id).eq("user_id",user_id)

    return data
}