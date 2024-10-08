'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addInvitedUser(data: any) {
    const supabase = createClient();
    const { data: eventUser, error } = await supabase.from("event_users").select("user_id").eq("event_id", data.event_id);
    if (error) redirect("/invite/error")

    if (eventUser[0]?.user_id !== data.user_id) {
        const { error } = await supabase.from("event_users").insert([data])
        if (error) redirect("/invite/error")
    }
    revalidatePath('/', 'layout');
    redirect(`/events/${data.event_id}`);
} 
