import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

/* create a new event */
export async function POST(request: NextRequest) {
    const supabase = createClient();
    const body = await request.json()

    const { error } = await supabase.from("events").insert([body]).select()
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: "Event has been created" }), { status: 201 });
}

/* fetch all events where an user exists */
/* currently its fetching only events created by the user i,e owner */
/* TODO -> fetch other events where the user exists */
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { data, error } = await supabase.from("events").select("*").eq("event_owner", id);
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 })
}