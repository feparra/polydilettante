import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization check
    const authHeader = req.headers.get("authorization");
    const ingestKeyHeader = req.headers.get("x-ingest-key");
    const configuredKey = process.env.PHILOMATHUB_INGEST_KEY || process.env.POLYDILETTANTE_INGEST_KEY;

    const providedKey =
      ingestKeyHeader ||
      (authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null);

    if (configuredKey && providedKey !== configuredKey) {
      return NextResponse.json(
        { error: "Unauthorized. Provide valid PHILOMATHUB_INGEST_KEY in x-ingest-key or Authorization Bearer header." },
        { status: 401 }
      );
    }

    // 2. Parse & Validate JSON payload
    const body = await req.json();

    if (!body.id || !body.category || !body.title_es || !body.title_en) {
      return NextResponse.json(
        {
          error:
            "Invalid node payload. Minimum required fields: id, category, title_es, title_en, metaphor_es, metaphor_en.",
        },
        { status: 400 }
      );
    }

    const payload = {
      id: String(body.id).trim().toLowerCase(),
      category: body.category,
      title_es: body.title_es,
      title_en: body.title_en,
      tags: Array.isArray(body.tags) ? body.tags : [],
      simulator_id: body.simulator_id || body.id,
      connections: Array.isArray(body.connections) ? body.connections : [],
      position_x: Number(body.position_x) || Math.floor(Math.random() * 500) + 100,
      position_y: Number(body.position_y) || Math.floor(Math.random() * 400) + 100,
      metaphor_es: body.metaphor_es || "",
      metaphor_en: body.metaphor_en || "",
      anatomy_engine_es: body.anatomy_engine_es || "",
      anatomy_engine_en: body.anatomy_engine_en || "",
      anatomy_failure_es: body.anatomy_failure_es || "",
      anatomy_failure_en: body.anatomy_failure_en || "",
      anatomy_rule_es: body.anatomy_rule_es || "",
      anatomy_rule_en: body.anatomy_rule_en || "",
      case_standard_es: body.case_standard_es || "",
      case_standard_en: body.case_standard_en || "",
      case_edge_es: body.case_edge_es || "",
      case_edge_en: body.case_edge_en || "",
      case_crosspollination_es: body.case_crosspollination_es || "",
      case_crosspollination_en: body.case_crosspollination_en || "",
      blueprint_code: body.blueprint_code || "// PhilomatHub Blueprint",
      blueprint_lang: body.blueprint_lang || "typescript",
    };

    // 3. Upsert into Supabase
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("nodes")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Supabase upsert failed: " + error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Node [${payload.id}] successfully ingested into PhilomatHub!`,
        node: data,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server error during ingest: " + message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("nodes")
    .select("id, category, title_es, title_en, connections, simulator_id, created_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data?.length || 0, nodes: data });
}

