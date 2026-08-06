import 'server-only';

import { unstable_cache } from 'next/cache';
import { todayProducts } from '@/data/today-products';
import { readFeishuServerConfig } from '@/lib/feishu/config';
import {
  evaluateFlashSaleState,
  flashSaleButtonLabels,
  type FlashSaleUiState,
} from '@/lib/feishu/flash-sale-state';

type FeishuRecord = {
  record_id?: string;
  fields?: Record<string, unknown>;
};

type TenantTokenResponse = {
  code?: number;
  tenant_access_token?: string;
};

type RecordsResponse = {
  code?: number;
  data?: { items?: FeishuRecord[] };
};

export type FlashSale = {
  recordId: string;
  productId: string;
  productName: string;
  price: string;
  startAt: number;
  endAt: number;
  stock: number | null;
  availability: string;
  activityStatus: string;
  uiState: FlashSaleUiState;
  buttonLabel: string;
  href: string;
  purchaseHref: string;
};

const textValue = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(' / ');
  if (!value || typeof value !== 'object') return '';
  const item = value as Record<string, unknown>;
  return textValue(item.text ?? item.name ?? item.value ?? item.label);
};

const relationId = (value: unknown): string => {
  if (typeof value === 'string' && /^rec/i.test(value)) return value.trim();
  if (Array.isArray(value)) {
    for (const item of value) {
      const id = relationId(item);
      if (id) return id;
    }
    return '';
  }
  if (!value || typeof value !== 'object') return '';
  const item = value as Record<string, unknown>;
  const direct = item.record_id ?? item.recordId ?? item.id;
  if (typeof direct === 'string') return direct.trim();
  return relationId(item.record_ids ?? item.linked_record_ids);
};

const timestampValue = (value: unknown): number => {
  if (typeof value === 'number') return value < 10_000_000_000 ? value * 1000 : value;
  const text = textValue(value);
  if (!text) return Number.NaN;
  const numeric = Number(text);
  if (Number.isFinite(numeric)) return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
  return Date.parse(text);
};

const numericValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = textValue(value).replace(/[^\d.-]/g, '');
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

const priceValue = (value: unknown): string => {
  const text = textValue(value);
  if (!text) return '';
  return /[¥￥元]/.test(text) ? text : `¥${text}`;
};

const field = (fields: Record<string, unknown>, name: string) => fields[name];

const comparableName = (value: string) =>
  value.replace(/[（(].*?[）)]/g, '').replace(/\s+/g, '').trim();

const destinationFor = (productId: string, productName: string) => {
  const product = todayProducts.find(
    (item) => item.id === productId || comparableName(item.name) === comparableName(productName),
  );
  if (product) return `/products/${encodeURIComponent(product.id)}`;
  const query = new URLSearchParams({ src: 'flash-sale', productId, productName });
  return `/order?${query.toString()}`;
};

const normalizeRecord = (record: FeishuRecord, now: number): FlashSale | null => {
  const fields = record.fields ?? {};
  const activityStatus = textValue(field(fields, '活动状态'));
  const startAt = timestampValue(field(fields, '活动开始时间'));
  const endAt = timestampValue(field(fields, '活动结束时间'));
  const productField = field(fields, '活动商品');
  const productName = textValue(productField);
  const productId = relationId(productField) || record.record_id?.trim() || '';
  const price = priceValue(field(fields, '活动价格'));
  const stock = numericValue(field(fields, '活动库存'));
  const availability = textValue(field(fields, '可售状态'));

  if (
    !record.record_id ||
    !activityStatus ||
    !Number.isFinite(startAt) ||
    !Number.isFinite(endAt) ||
    endAt <= startAt ||
    !productId ||
    !productName ||
    !price
  ) {
    return null;
  }

  const uiState = evaluateFlashSaleState(
    { activityStatus, startAt, endAt, stock, availability },
    now,
  );
  if (!uiState) return null;

  return {
    recordId: record.record_id,
    productId,
    productName,
    price,
    startAt,
    endAt,
    stock,
    availability,
    activityStatus,
    uiState,
    buttonLabel: flashSaleButtonLabels[uiState],
    href: destinationFor(productId, productName),
    purchaseHref: `/order?${new URLSearchParams({ src: 'flash-sale', productId, productName }).toString()}`,
  };
};

const priority: Record<FlashSaleUiState, number> = {
  active: 0,
  upcoming: 1,
  sold_out: 2,
  ended: 3,
};

const fetchFlashSaleUnsafe = async (): Promise<FlashSale | null> => {
  const config = readFeishuServerConfig();
  const appId = config.appId?.trim();
  const appSecret = config.appSecret?.trim();
  const appToken = config.contentAppToken?.trim();
  const tableId = config.tableIds.flashSale?.trim();
  if (!appId || !appSecret || !appToken || !tableId) return null;

  const tokenResponse = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
      cache: 'no-store',
    },
  );
  const tokenBody = (await tokenResponse.json()) as TenantTokenResponse;
  const token = tokenBody.tenant_access_token;
  if (!tokenResponse.ok || tokenBody.code !== 0 || !token) return null;

  const recordsResponse = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(tableId)}/records?page_size=100`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );
  const recordsBody = (await recordsResponse.json()) as RecordsResponse;
  if (!recordsResponse.ok || recordsBody.code !== 0) return null;

  const now = Date.now();
  return (recordsBody.data?.items ?? [])
    .map((record) => normalizeRecord(record, now))
    .filter((item): item is FlashSale => item !== null)
    .sort((left, right) => priority[left.uiState] - priority[right.uiState] || left.startAt - right.startAt)[0] ?? null;
};

const fetchFlashSale = async (): Promise<FlashSale | null> => {
  try {
    return await fetchFlashSaleUnsafe();
  } catch {
    // 鉴权、网络或表结构异常时隐藏整个模块，避免首页出现空白卡片或错误按钮。
    return null;
  }
};

export const getCurrentFlashSale = unstable_cache(fetchFlashSale, ['current-feishu-flash-sale'], {
  revalidate: 60,
});

export async function getActiveFlashSaleForProduct(productId: string, productName: string) {
  const sale = await getCurrentFlashSale();
  if (!sale || sale.uiState !== 'active') return null;
  const matches =
    sale.productId === productId || comparableName(sale.productName) === comparableName(productName);
  return matches ? sale : null;
}
