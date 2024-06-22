'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* create a rpc to handle the transaction on supabase */
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
