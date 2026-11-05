import { useState } from 'react';
import { Button, Sheet, inputCls } from './ui.jsx';

/**
 * Sends text to WhatsApp/Telegram: native share sheet when installed as an app,
 * otherwise copies to the clipboard; if that is refused, shows the text for manual copying.
 */
export function ShareButton({ label, getText, copiedMsg = 'Скопировано — вставьте в WhatsApp или Telegram' }) {
  const [manual, setManual] = useState(null);
  const [msg, setMsg] = useState('');

  const share = async () => {
    const text = await getText();
    setMsg('');
    try {
      if (navigator.share && window.matchMedia?.('(display-mode: standalone)').matches) {
        await navigator.share({ text });
        return;
      }
    } catch { /* fall through to copy */ }
    try {
      await navigator.clipboard.writeText(text);
      setMsg(copiedMsg);
    } catch {
      setManual(text);
    }
  };

  return (
    <>
      <Button variant="secondary" className="w-full" onClick={share}>{label}</Button>
      {msg && <p role="status" className="mt-1 text-center text-sm text-emerald-700 dark:text-emerald-400">{msg}</p>}
      <Sheet open={manual != null} onClose={() => setManual(null)} title="Скопируйте текст">
        <p className="mb-2 text-sm text-stone-500">Нажмите на текст, выберите «Выделить всё» → «Копировать» и вставьте в WhatsApp или Telegram.</p>
        <textarea
          readOnly
          value={manual ?? ''}
          onFocus={(e) => e.target.select()}
          className={`${inputCls} min-h-64 py-2 font-mono text-sm`}
          aria-label="Текст для отправки"
        />
      </Sheet>
    </>
  );
}
