'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* individual event details */
export async function getEvent(event_id: string) {
    try {
        const supabase = createClient();
        const { data } = await supabase.from("events").select("*").eq("event_id", event_id);
        revalidatePath('/', 'layout')
        return data;
    } catch (error) {
        redirect("/error")
    }
}

/* event users api goes here */