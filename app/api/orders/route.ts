import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, data")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Supabase GET] ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedOrders = (data || []).map((order) => ({
    id: order.id,
    date: new Date(order.created_at).toLocaleString("ru-RU"),
    ...order.data,
  }));

  return NextResponse.json(formattedOrders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[POST /api/orders] Получены данные:", Object.keys(body));

    const { data, error } = await supabase
      .from("orders")
      .insert({ data: body })
      .select();

    if (error) {
      console.error("[Supabase INSERT] ERROR:");
      console.error("  code:", error.code);
      console.error("  message:", error.message);
      console.error("  details:", error.details);
      console.error("  hint:", error.hint);
      throw new Error(error.message);
    }

    console.log("[Supabase INSERT] OK, добавлено:", data?.length);
    return NextResponse.json({ success: true, order: data?.[0] });
  } catch (error: any) {
    console.error("[POST /api/orders] EXCEPTION:", error.message);
    return NextResponse.json(
      { error: error.message || "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}