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
            user_role,
            users (
                raw_user_meta_data
            )
        `)
        .eq('event_id', event_id);
    console.log(error)
    if (error) redirect("/error")
    revalidatePath("/", 'layout')
    return data;
}