import type { ReactNode } from 'react';
import PageHead from '@/components/PageHead';

export interface LegalSection {
  title: string;
  paragraphs?: ReactNode[];
  items?: ReactNode[];
}

/** Текстовая страница документов (правила, политика): шапка в стиле сайта и разделы с абзацами и списками. */
export default function LegalPage({ kicker, title, updated, sections }: {
  kicker: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <PageHead kicker={kicker} title={title} text={`Редакция от ${updated}`} />
      <div className="lg-doc">
        {sections.map((s, i) => (
          <section key={s.title}>
            <h2>{i + 1}. {s.title}</h2>
            {s.paragraphs?.map((p, k) => <p key={k}>{p}</p>)}
            {s.items && <ul>{s.items.map((it, k) => <li key={k}>{it}</li>)}</ul>}
          </section>
        ))}
      </div>
    </div>
  );
}
