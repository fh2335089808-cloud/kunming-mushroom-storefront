import { FEISHU_TABLE_DEFINITIONS, getFeishuConfigStatus } from "@/lib/feishu/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const environment = getFeishuConfigStatus();
  return Response.json(
    {
      environment,
      tables: FEISHU_TABLE_DEFINITIONS.map(({ name, envKey }) => ({
        name,
        envKey,
        status: environment[envKey],
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}