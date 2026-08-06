export type FlashSaleUiState = 'active' | 'upcoming' | 'ended' | 'sold_out';

export type FlashSaleStateInput = {
  activityStatus: string;
  startAt: number;
  endAt: number;
  stock: number | null;
  availability: string;
};

const includesAny = (value: string, words: readonly string[]) =>
  words.some((word) => value.includes(word));

export function evaluateFlashSaleState(
  input: FlashSaleStateInput,
  now = Date.now(),
): FlashSaleUiState | null {
  const status = input.activityStatus.trim();
  const availability = input.availability.trim();

  if (!status || includesAny(status, ['草稿', '停用', '未启用', '取消', '下架', '无效'])) {
    return null;
  }
  if (includesAny(status, ['未开始', '即将开始']) || input.startAt > now) return 'upcoming';
  if (includesAny(status, ['已结束', '结束']) || input.endAt <= now) return 'ended';
  if (
    input.stock === 0 ||
    includesAny(status, ['已抢完', '售罄']) ||
    includesAny(availability, ['不可售', '已抢完', '售罄', '无库存'])
  ) {
    return 'sold_out';
  }
  return 'active';
}

export const flashSaleButtonLabels: Record<FlashSaleUiState, string> = {
  active: '立即抢购',
  upcoming: '即将开始',
  ended: '活动已结束',
  sold_out: '已抢完',
};
