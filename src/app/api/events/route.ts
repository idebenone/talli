import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = createClient();
    const body = await request.json()
    const data = await supabase.auth.getUser();
    const { error } = await supabase.from("events").insert([
        { event_owner: data.data.user?.id, ...body }
    ]).select()
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 201 });
}

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.from("events").select();
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 })
}