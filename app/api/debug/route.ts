export async function GET() {
  const v = process.env.HF_TOKEN;
  return Response.json({
    hasHF: !!v,
    hfLen: v?.length ?? 0,
    hfPrefix: v ? v.slice(0, 7) : null,
    allKeysWithHF: Object.keys(process.env).filter((k) =>
      k.toUpperCase().includes("HF")
    ),
  });
}