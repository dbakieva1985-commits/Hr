import { useEffect, useRef, useState } from 'react';

export function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-emerald-600 text-white active:bg-emerald-700 disabled:opacity-40',
    secondary: 'bg-stone-200 text-stone-900 active:bg-stone-300 dark:bg-stone-800 dark:text-stone-100 dark:active:bg-stone-700',
    ghost: 'text-stone-600 active:bg-stone-200 dark:text-stone-300 dark:active:bg-stone-800',
    danger: 'text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950',
  };
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 font-medium transition-colors ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-stone-500 active:bg-stone-200 disabled:opacity-25 dark:text-stone-400 dark:active:bg-stone-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({ active, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`min-h-8 rounded-full border px-3 text-sm whitespace-nowrap ${
        active
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-stone-300 text-stone-700 dark:border-stone-700 dark:text-stone-300'
      } ${className}`}
      {...props}
    />
  );
}

export const inputCls =
  'w-full min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100';

export function Header({ title, subtitle, right }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-stone-200 bg-stone-50/95 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold">{title}</h1>
        {subtitle && <div className="text-sm text-stone-500 dark:text-stone-400">{subtitle}</div>}
      </div>
      {right}
    </header>
  );
}

export function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 pb-[max(env(safe-area-inset-bottom),16px)] shadow-xl sm:rounded-2xl dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

/** Row that reports a left swipe (used for «есть дома»). */
export function SwipeRow({ onSwipeLeft, hint = 'Есть дома', children }) {
  const start = useRef(null);
  const [dx, setDx] = useState(0);
  const moved = useRef(false);
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-end bg-amber-500 pr-4 text-sm font-medium text-white">
        {hint} →
      </div>
      <div
        className="relative bg-stone-50 dark:bg-stone-950"
        style={{ transform: `translateX(${dx}px)`, transition: start.current ? 'none' : 'transform .2s', touchAction: 'pan-y' }}
        onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY }; moved.current = false; }}
        onPointerMove={(e) => {
          if (!start.current) return;
          const ddx = e.clientX - start.current.x;
          if (Math.abs(ddx) > 8 && Math.abs(ddx) > Math.abs(e.clientY - start.current.y)) moved.current = true;
          if (moved.current) setDx(Math.min(0, ddx));
        }}
        onPointerUp={() => {
          if (dx < -90) onSwipeLeft();
          start.current = null;
          setDx(0);
        }}
        onPointerCancel={() => { start.current = null; setDx(0); }}
        onClickCapture={(e) => { if (moved.current) { e.stopPropagation(); moved.current = false; } }}
      >
        {children}
      </div>
    </div>
  );
}

export function Empty({ children }) {
  return <div className="px-6 py-10 text-center text-stone-500 dark:text-stone-400">{children}</div>;
}
