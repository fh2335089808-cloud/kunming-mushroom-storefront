'use client';

import Image from 'next/image';
import { Check, Copy, MessageCircle, X } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config/site';

type WechatContactDialogProps = {
  children?: ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function WechatContactDialog({ children, className, onOpenChange }: WechatContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const updateOpen = useCallback((value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
    if (!value) setCopied(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') updateOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, updateOpen]);

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.wechatNumber);
    } catch {
      const input = document.createElement('input');
      input.value = siteConfig.wechatNumber;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button type="button" onClick={() => updateOpen(true)} className={className} aria-haspopup="dialog">
        {children ?? <><MessageCircle size={18} />联系微信</>}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-end bg-black/45 p-0 sm:items-center sm:justify-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) updateOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="wechat-dialog-title"
            className="w-full rounded-t-3xl bg-[#f7f4ec] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:max-w-sm sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[.18em] text-forest-500">WECHAT CONTACT</p>
                <h2 id="wechat-dialog-title" className="mt-2 font-serif text-2xl text-forest-900">联系微信</h2>
              </div>
              <button ref={closeButtonRef} type="button" onClick={() => updateOpen(false)} aria-label="关闭微信联系方式" className="grid h-10 w-10 place-items-center rounded-full text-stone-500 active:bg-stone-200">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-white p-3 shadow-soft">
              <Image src="/images/wechat-qr.png" alt="菌鲜到微信二维码" width={300} height={444} className="mx-auto h-auto max-h-[48svh] w-auto max-w-full object-contain" />
            </div>
            <p className="mt-4 text-center text-sm text-stone-600">长按识别二维码，或复制微信号后添加</p>
            <button type="button" onClick={copyWechat} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-3 text-sm font-semibold text-white">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? '微信号已复制' : '复制微信号 ' + siteConfig.wechatNumber}
            </button>
            <button type="button" onClick={() => updateOpen(false)} className="mt-2 inline-flex min-h-11 w-full items-center justify-center text-sm font-medium text-stone-500">关闭</button>
          </section>
        </div>
      ) : null}
    </>
  );
}