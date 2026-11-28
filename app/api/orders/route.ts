import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PHOTO_FIELDS = ["heroPhoto", "extraPhotos", "portraitPhotos", "memoryPhotos"] as const;
const STATUSES = ["new", "accepted", "rejected"] as const;

// Убираем тяжёлые base64-фото из выдачи списка
function stripPhotos(data: Record<string, unknown>) {
  const copy = { ...data };
  for (const key of PHOTO_FIELDS) delete copy[key];
  return copy;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const light = searchParams.get("light") === "1";

  let query = supabase
    .from("orders")
    .select("id, created_at, data")
    .order("created_at", { ascending: false });

  if (id) query = query.eq("id", id);

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase GET] ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedOrders = (data || []).map((order) => {
    const orderData = (order.data || {}) as Record<string, unknown>;
    return {
      id: order.id,
      date: new Date(order.created_at).toLocaleString("ru-RU"),
      status: orderData.status || "new",
      ...(light ? stripPhotos(orderData) : orderData),
    };
  });

  // Если запросили конкретный заказ — вернём один объект
  if (id) return NextResponse.json(formattedOrders[0] || null);

  return NextResponse.json(formattedOrders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[POST /api/orders] Получены данные:", Object.keys(body));

    const { data, error } = await supabase
      .from("orders")
      .insert({ data: { ...body, status: "new" } })
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

// Смена статуса заказа: new | accepted | rejected
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Нужны id заказа и корректный статус" },
        { status: 400 }
      );
    }

    // Забираем текущие данные, чтобы не затереть анкету
    const { data: existing, error: fetchError } = await supabase
      .from("orders")
      .select("data")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const newData = { ...(existing?.data || {}), status };

    const { error: updateError } = await supabase
      .from("orders")
      .update({ data: newData })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    console.error("[PATCH /api/orders] ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Не удалось обновить статус" },
      { status: 500 }
    );
  }
}
