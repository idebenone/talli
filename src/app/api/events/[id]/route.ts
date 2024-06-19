import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

type Context = {
    params: {
        id: string;
    };
};


export async function GET(request: NextRequest, { params }: Context) {
    const supabase = createClient();
    const { id } = params;

    if (id) {
        const { data, error } = await supabase.from("events").select("*").eq("event_id", id);
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify(data), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "Some parameters are missing" }), { status: 422 });
}