import type { ReactNode } from 'react';

/** Шапка внутренних страниц в стиле главной: вступительная строка, заголовок, пояснение, чипы и кнопки. */
export default function PageHead({ kicker, title, text, chips, actions }: {
  kicker: string;
  title: string;
  text?: string;
  chips?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="pg-head">
      <div className="hm-kicker">{kicker}</div>
      <h1 className="font-heading">{title}</h1>
      {text && <p>{text}</p>}
      {chips && <div className="pg-chips">{chips}</div>}
      {actions && <div className="pg-actions">{actions}</div>}
    </header>
  );
}
