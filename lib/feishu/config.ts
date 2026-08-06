import "server-only";

export const FEISHU_APP_ENV_KEYS = [
  "FEISHU_APP_ID",
  "FEISHU_APP_SECRET",
  "FEISHU_CONTENT_APP_TOKEN",
] as const;

export const FEISHU_TABLE_DEFINITIONS = [
  { key: "product", name: "商品中心表", envKey: "FEISHU_PRODUCT_TABLE_ID" },
  { key: "inventory", name: "商品规格与库存表", envKey: "FEISHU_INVENTORY_TABLE_ID" },
  { key: "flashSale", name: "限时抢购活动表", envKey: "FEISHU_FLASH_SALE_TABLE_ID" },
  { key: "marketPrice", name: "每日市场行情表", envKey: "FEISHU_MARKET_PRICE_TABLE_ID" },
  { key: "content", name: "网站内容配置表", envKey: "FEISHU_CONTENT_TABLE_ID" },
  { key: "feedback", name: "买家秀与客户反馈表", envKey: "FEISHU_FEEDBACK_TABLE_ID" },
] as const;

export const FEISHU_ENV_KEYS = [
  ...FEISHU_APP_ENV_KEYS,
  ...FEISHU_TABLE_DEFINITIONS.map(({ envKey }) => envKey),
] as const;

export type FeishuEnvKey = (typeof FEISHU_ENV_KEYS)[number];
export type FeishuEnvStatus = "已配置" | "未配置";

export type FeishuServerConfig = {
  appId: string | undefined;
  appSecret: string | undefined;
  contentAppToken: string | undefined;
  tableIds: {
    product: string | undefined;
    inventory: string | undefined;
    flashSale: string | undefined;
    marketPrice: string | undefined;
    content: string | undefined;
    feedback: string | undefined;
  };
};

function isConfigured(key: FeishuEnvKey) {
  return Boolean(process.env[key]?.trim());
}

export function getFeishuConfigStatus(): Record<FeishuEnvKey, FeishuEnvStatus> {
  return Object.fromEntries(
    FEISHU_ENV_KEYS.map((key) => [key, isConfigured(key) ? "已配置" : "未配置"]),
  ) as Record<FeishuEnvKey, FeishuEnvStatus>;
}

export function getMissingFeishuEnvKeys(): FeishuEnvKey[] {
  return FEISHU_ENV_KEYS.filter((key) => !isConfigured(key));
}

export function readFeishuServerConfig(): FeishuServerConfig {
  return {
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
    contentAppToken: process.env.FEISHU_CONTENT_APP_TOKEN,
    tableIds: {
      product: process.env.FEISHU_PRODUCT_TABLE_ID,
      inventory: process.env.FEISHU_INVENTORY_TABLE_ID,
      flashSale: process.env.FEISHU_FLASH_SALE_TABLE_ID,
      marketPrice: process.env.FEISHU_MARKET_PRICE_TABLE_ID,
      content: process.env.FEISHU_CONTENT_TABLE_ID,
      feedback: process.env.FEISHU_FEEDBACK_TABLE_ID,
    },
  };
}

export function requireFeishuServerConfig(): FeishuServerConfig {
  const missingKeys = getMissingFeishuEnvKeys();
  if (missingKeys.length > 0) {
    throw new Error("飞书服务端配置不完整：" + missingKeys.join(", "));
  }
  return readFeishuServerConfig();
}