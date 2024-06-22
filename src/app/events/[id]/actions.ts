'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* individual event details */
export async function getEvent(event_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("events").select("*").eq("event_id", event_id);
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
                raw_user_meta_data
            )
        `)
        .eq('event_id', event_id);
    if (error) redirect("/error")
    revalidatePath("/", 'layout')
    return data;
}

export async function removeEventUser(event_user_id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("event_users").delete().eq("event_user_id", event_user_id);
    if (error) redirect("/error")
    revalidatePath("/", "layout")
}