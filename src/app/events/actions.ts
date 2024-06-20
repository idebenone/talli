'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* create an rpc to handle the transaction on supabase */
export async function createEvent(data: any) {
    try {
        const supabase = createClient();
        const response = await supabase.from("events").insert([data]).select()
        if (response.data) {
            await supabase.from("event_users").insert([{ event_id: response.data[0].event_id, user_id: data.event_owner, user_role: "owner" }]);
            revalidatePath('/', 'layout')
            redirect('/events')
        }
    } catch (error) {
        redirect("/error")
    }
}

/* fetch all events where an user exists */
/* currently its fetching only events created by the user i,e owner */
/* TODO -> fetch other events where the user exists */
export async function getEvents(user_id: string) {
    try {
        const supabase = createClient();
        const { data } = await supabase.from("events").select("*").eq("event_owner", user_id);
        revalidatePath('/', 'layout')
        return data;
    } catch (error) {
        redirect("/error")
    }
}
