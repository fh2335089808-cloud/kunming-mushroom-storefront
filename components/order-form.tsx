'use client';

import { CheckCircle2, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { WechatContactDialog } from '@/components/wechat-contact-dialog';
import { siteConfig } from '@/config/site';

const ORDER_API_URL = 'https://order.kunming-mushroom.asia/api/order/submit';
const DRAFT_KEY = 'order_form_draft';
const IDEMPOTENCY_KEY = 'order_form_idempotency_key';
const RECEIPT_KEY = 'order_form_submission_receipt';
const SOURCE_KEY = 'junxiandao_traffic_source';
const RECEIPT_TTL = 30 * 60 * 1000;

const mushrooms = ['鸡枞菌', '青头菌', '松茸', '牛肝菌', '其他当季野生菌'];
const quantities = ['500g', '1kg', '2kg', '其他数量'];
const deliveryTypes = ['官渡区同城配送', '到店自取', '外地寄送咨询'];
const deliveryTimes = ['今天', '明天', '预约其他日期'];

type Draft = {
  name: string;
  phone: string;
  wechat: string;
  mushrooms: string[];
  quantity: string;
  otherQuantity: string;
  deliveryType: string;
  deliveryAddress: string;
  deliveryTime: string;
  appointmentDate: string;
  remarks: string;
  src: string;
};

type SubmissionResult = {
  success: true;
  duplicate: boolean;
  recordId: string;
  message: string;
};

type StoredReceipt = SubmissionResult & { savedAt: number };
type FieldErrors = Partial<Record<keyof Draft, string>>;

const emptyDraft: Draft = {
  name: '',
  phone: '',
  wechat: '',
  mushrooms: [],
  quantity: '',
  otherQuantity: '',
  deliveryType: '',
  deliveryAddress: '',
  deliveryTime: '',
  appointmentDate: '',
  remarks: '',
  src: '',
};

const inputClass =
  'mt-2 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-100';

function parseResult(value: unknown): SubmissionResult | null {
  if (!value || typeof value !== 'object') return null;
  const result = value as Record<string, unknown>;
  if (result.success !== true) return null;
  const duplicate = result.duplicate === true;
  return {
    success: true,
    duplicate,
    recordId: typeof result.recordId === 'string' ? result.recordId.trim() : '',
    message:
      typeof result.message === 'string' && result.message.trim()
        ? result.message
        : duplicate
          ? '购买需求已经登记，无需再次提交。'
          : '登记已收到，工作人员会尽快联系您确认。',
  };
}

function validate(draft: Draft) {
  const errors: FieldErrors = {};
  if (!draft.name.trim()) errors.name = '请填写姓名';
  if (!/^1[3-9]\d{9}$/.test(draft.phone.trim())) errors.phone = '请输入正确的11位手机号';
  if (draft.mushrooms.length === 0) errors.mushrooms = '请至少选择一种野生菌';
  if (!draft.quantity) errors.quantity = '请选择购买数量';
  if (draft.quantity === '其他数量' && !draft.otherQuantity.trim()) {
    errors.otherQuantity = '请填写需要的数量';
  }
  if (!draft.deliveryType) errors.deliveryType = '请选择配送方式';
  if (draft.deliveryType === '官渡区同城配送' && !draft.deliveryAddress.trim()) {
    errors.deliveryAddress = '请填写配送地址';
  }
  if (!draft.deliveryTime) errors.deliveryTime = '请选择期望送达时间';
  if (draft.deliveryTime === '预约其他日期' && !draft.appointmentDate) {
    errors.appointmentDate = '请选择预约日期';
  }
  return errors;
}

function ChoiceGroup({
  error,
  label,
  name,
  onChange,
  options,
  value,
}: {
  error?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-stone-800">
        {label} <span className="text-clay">*</span>
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm transition active:scale-[0.98] ${
              value === option
                ? 'border-forest-500 bg-forest-50 font-semibold text-forest-700'
                : 'border-stone-300 bg-white text-stone-700'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </fieldset>
  );
}

export function OrderForm() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const keyRef = useRef('');

  useEffect(() => {
    try {
      const storedReceipt = window.localStorage.getItem(RECEIPT_KEY);
      if (storedReceipt) {
        const receipt = JSON.parse(storedReceipt) as StoredReceipt;
        const parsed = parseResult(receipt);
        if (parsed && Date.now() - Number(receipt.savedAt || 0) < RECEIPT_TTL) {
          setResult(parsed);
        } else {
          window.localStorage.removeItem(RECEIPT_KEY);
          window.localStorage.removeItem(IDEMPOTENCY_KEY);
        }
      }

      const savedDraft = window.localStorage.getItem(DRAFT_KEY);
      const parsedDraft = savedDraft ? (JSON.parse(savedDraft) as Partial<Draft>) : {};
      const query = new URLSearchParams(window.location.search);
      const querySource = query.get('src')?.trim();
      const queryProductId = query.get('productId')?.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
      const queryProductName = query.get('productName')?.trim().slice(0, 80);
      const storedSource = window.localStorage.getItem(SOURCE_KEY)?.trim();
      const source =
        querySource === 'flash-sale' && queryProductId
          ? `flash-sale:${queryProductId}`
          : querySource || parsedDraft.src || storedSource || 'website';
      if (querySource) window.localStorage.setItem(SOURCE_KEY, querySource);
      const selectedMushrooms = [...(parsedDraft.mushrooms ?? [])];
      const knownMushroom = queryProductName
        ? mushrooms.find((item) => queryProductName.includes(item) || item.includes(queryProductName))
        : undefined;
      if (knownMushroom && !selectedMushrooms.includes(knownMushroom)) selectedMushrooms.push(knownMushroom);
      const productNote = queryProductName && !knownMushroom ? `限时抢购商品：${queryProductName}` : '';
      const remarks = [productNote, parsedDraft.remarks].filter(Boolean).join('\n');
      setDraft({ ...emptyDraft, ...parsedDraft, mushrooms: selectedMushrooms, remarks, src: source });
    } catch {
      setDraft({ ...emptyDraft, src: 'website' });
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || result) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // 浏览器禁用存储时，表单仍可正常提交。
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft, ready, result]);

  const update = <Key extends keyof Draft>(key: Key, value: Draft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const toggleMushroom = (mushroom: string) => {
    update(
      'mushrooms',
      draft.mushrooms.includes(mushroom)
        ? draft.mushrooms.filter((item) => item !== mushroom)
        : [...draft.mushrooms, mushroom],
    );
  };

  const getIdempotencyKey = () => {
    if (keyRef.current) return keyRef.current;
    try {
      const stored = window.localStorage.getItem(IDEMPOTENCY_KEY);
      if (stored) {
        keyRef.current = stored;
        return stored;
      }
    } catch {
      // Storage may be unavailable in private or embedded browser modes.
    }
    const created =
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    keyRef.current = created;
    try {
      window.localStorage.setItem(IDEMPOTENCY_KEY, created);
    } catch {
      // The in-memory key still prevents duplicate clicks in this page session.
    }
    return created;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || result) return;

    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('请先补全带星号的必填信息。');
      return;
    }
    if (!navigator.onLine) {
      setSubmitError('当前网络不可用，请恢复网络后重试；填写内容已保留。');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);

    const payload: Record<string, string | string[]> = {
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      mushrooms: draft.mushrooms,
      quantity: draft.quantity,
      deliveryType: draft.deliveryType,
      deliveryTime: draft.deliveryTime,
      src: draft.src || 'website',
    };
    if (draft.wechat.trim()) payload.wechat = draft.wechat.trim();
    if (draft.otherQuantity.trim()) payload.otherQuantity = draft.otherQuantity.trim();
    if (draft.deliveryAddress.trim()) payload.deliveryAddress = draft.deliveryAddress.trim();
    if (draft.appointmentDate) payload.appointmentDate = draft.appointmentDate;
    if (draft.remarks.trim()) payload.remarks = draft.remarks.trim();

    try {
      const response = await fetch(ORDER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': getIdempotencyKey(),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => null);
      const parsed = parseResult(body);
      if (!response.ok || !parsed) {
        const message =
          body && typeof body.error === 'string'
            ? body.error
            : '提交失败，请稍后重试；填写内容已保留。';
        setSubmitError(message);
        return;
      }

      setResult(parsed);
      try {
        window.localStorage.removeItem(DRAFT_KEY);
        window.localStorage.setItem(
          RECEIPT_KEY,
          JSON.stringify({ ...parsed, savedAt: Date.now() } satisfies StoredReceipt),
        );
      } catch {
        // 成功结果已显示，存储失败不影响本次登记。
      }
    } catch (error) {
      setSubmitError(
        error instanceof DOMException && error.name === 'AbortError'
          ? '提交超时，请检查网络后重试；填写内容已保留。'
          : '网络连接异常，请稍后重试；填写内容已保留。',
      );
    } finally {
      window.clearTimeout(timeout);
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <section aria-live="polite" className="rounded-3xl bg-white p-7 text-center shadow-soft sm:p-10">
        <CheckCircle2 aria-hidden="true" className="mx-auto text-forest-600" size={58} />
        <h2 className="mt-5 font-serif text-3xl text-forest-900">
          {result.duplicate ? '购买需求已经登记' : '登记已收到'}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-600">{result.message}</p>
        <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-stone-500">
          提交表单不代表订单已经确认，请以工作人员最终回复为准。
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/#wechat"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest-700 px-5 py-3 text-sm font-semibold text-white"
          >
            联系微信
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-forest-500 px-5 py-3 text-sm font-semibold text-forest-700"
          >
            返回首页
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-8 rounded-3xl bg-white p-5 shadow-soft sm:p-8">
      <section className="space-y-5">
        <h2 className="text-sm font-semibold tracking-[0.14em] text-forest-700">联系信息</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-stone-800">
            姓名 <span className="text-clay">*</span>
            <input
              name="name"
              autoComplete="name"
              maxLength={30}
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              className={inputClass}
              placeholder="请输入姓名"
            />
            {errors.name ? <span className="mt-2 block text-xs text-red-600">{errors.name}</span> : null}
          </label>
          <label className="text-sm font-medium text-stone-800">
            联系电话 <span className="text-clay">*</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={11}
              value={draft.phone}
              onChange={(event) => update('phone', event.target.value.replace(/\D/g, ''))}
              className={inputClass}
              placeholder="请输入11位手机号"
            />
            {errors.phone ? <span className="mt-2 block text-xs text-red-600">{errors.phone}</span> : null}
          </label>
        </div>
        <label className="block text-sm font-medium text-stone-800">
          微信号
          <input
            name="wechat"
            autoComplete="off"
            maxLength={50}
            value={draft.wechat}
            onChange={(event) => update('wechat', event.target.value)}
            className={inputClass}
            placeholder="方便工作人员联系并发送当天鲜菌图片"
          />
        </label>
      </section>

      <hr className="border-stone-200" />

      <section className="space-y-6">
        <h2 className="text-sm font-semibold tracking-[0.14em] text-forest-700">选购信息</h2>
        <fieldset>
          <legend className="text-sm font-semibold text-stone-800">
            需要的野生菌 <span className="text-clay">*</span>
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {mushrooms.map((mushroom) => {
              const checked = draft.mushrooms.includes(mushroom);
              return (
                <label
                  key={mushroom}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition active:scale-[0.98] ${
                    checked
                      ? 'border-forest-500 bg-forest-50 font-semibold text-forest-700'
                      : 'border-stone-300 text-stone-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMushroom(mushroom)}
                    className="h-4 w-4 accent-[#24452c]"
                  />
                  {mushroom}
                </label>
              );
            })}
          </div>
          {errors.mushrooms ? <p className="mt-2 text-xs text-red-600">{errors.mushrooms}</p> : null}
        </fieldset>

        <ChoiceGroup
          label="购买数量"
          name="quantity"
          options={quantities}
          value={draft.quantity}
          onChange={(value) => update('quantity', value)}
          error={errors.quantity}
        />
        {draft.quantity === '其他数量' ? (
          <label className="block text-sm font-medium text-stone-800">
            其他数量 <span className="text-clay">*</span>
            <input
              value={draft.otherQuantity}
              onChange={(event) => update('otherQuantity', event.target.value)}
              className={inputClass}
              placeholder="例如：3kg 或 5人份"
            />
            {errors.otherQuantity ? <span className="mt-2 block text-xs text-red-600">{errors.otherQuantity}</span> : null}
          </label>
        ) : null}
      </section>

      <hr className="border-stone-200" />

      <section className="space-y-6">
        <h2 className="text-sm font-semibold tracking-[0.14em] text-forest-700">配送信息</h2>
        <ChoiceGroup
          label="配送方式"
          name="deliveryType"
          options={deliveryTypes}
          value={draft.deliveryType}
          onChange={(value) => update('deliveryType', value)}
          error={errors.deliveryType}
        />
        {draft.deliveryType === '官渡区同城配送' ? (
          <label className="block text-sm font-medium text-stone-800">
            配送地址 <span className="text-clay">*</span>
            <input
              autoComplete="street-address"
              value={draft.deliveryAddress}
              onChange={(event) => update('deliveryAddress', event.target.value)}
              className={inputClass}
              placeholder="请填写官渡区内详细地址"
            />
            {errors.deliveryAddress ? <span className="mt-2 block text-xs text-red-600">{errors.deliveryAddress}</span> : null}
          </label>
        ) : null}
        <ChoiceGroup
          label="期望送达时间"
          name="deliveryTime"
          options={deliveryTimes}
          value={draft.deliveryTime}
          onChange={(value) => update('deliveryTime', value)}
          error={errors.deliveryTime}
        />
        {draft.deliveryTime === '预约其他日期' ? (
          <label className="block text-sm font-medium text-stone-800">
            预约日期 <span className="text-clay">*</span>
            <input
              type="date"
              value={draft.appointmentDate}
              onChange={(event) => update('appointmentDate', event.target.value)}
              className={inputClass}
            />
            {errors.appointmentDate ? <span className="mt-2 block text-xs text-red-600">{errors.appointmentDate}</span> : null}
          </label>
        ) : null}
      </section>

      <hr className="border-stone-200" />

      <label className="block text-sm font-medium text-stone-800">
        补充信息
        <textarea
          rows={4}
          maxLength={500}
          value={draft.remarks}
          onChange={(event) => update('remarks', event.target.value)}
          className={inputClass}
          placeholder="可填写清洗需求、烹饪建议、送礼包装等需求"
        />
      </label>

      <div aria-live="polite">
        {submitError ? (
          <div className="mb-4 rounded-2xl bg-red-50 p-4">
            <p role="alert" className="text-sm leading-6 text-red-700">{submitError}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={siteConfig.orderFormUrl} className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-white px-3 py-2 text-center text-xs font-semibold text-red-700">
                重新打开登记表
              </a>
              <WechatContactDialog className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest-700 px-3 py-2 text-xs font-semibold text-white">
                微信咨询
              </WechatContactDialog>
            </div>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !ready}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />
              提交中…
            </>
          ) : (
            '提交登记'
          )}
        </button>
      </div>
      <p className="text-xs leading-6 text-stone-500">
        本表单仅用于订购需求登记，不直接收款。野生菌价格、库存、配送费用和送达时间以工作人员最终确认为准。
      </p>
    </form>
  );
}
