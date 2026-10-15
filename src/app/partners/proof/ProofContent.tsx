'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../partners.css';
import './proof.css';

interface ProofStats {
  collectedAt: string;
  windowDays: number;
  playersTotal: number;
  activeWeek: number;
  playersApproved: number;
  decided: number;
  approvedPercent: number | null;
  approved: number;
  autoApprovedPercent: number | null;
  manualDecided: number;
  rejectedManualPercent: number | null;
  submitted: number;
  duplicatePercent: number | null;
  retention7Percent: number | null;
  retentionCohort7: number;
}

const METHODS = [
  {
    icon: '🎮',
    title: 'Данные игры по API',
    desc: 'Игрок привязывает свой игровой тег, а мы сверяем прогресс с официальным API игры: победы, трофеи, ачивки и т. п. Считается прирост с момента, когда игрок взял квест. Ответ приходит автоматически, награда выдаётся после выполнения условия. Сейчас так работают квесты по Brawl Stars, Clash Royale и Clash of Clans.',
  },
  {
    icon: '🤝',
    title: 'Подтверждение от студии',
    desc: 'Для игр без открытого API: постбэк студии или сети, промокод либо выгрузка по согласованному формату. Игрок получает награду только после подтверждения с вашей стороны. Формат обсуждается индивидуально.',
  },
  {
    icon: '📸',
    title: 'Скриншот и модерация',
    desc: 'Игрок присылает скриншот, модератор одобряет, отклоняет с причиной или запрашивает уточнение. Это самый слабый способ, поэтому для результатов, за которые платит студия, мы предлагаем первые два.',
  },
];

const PROTECTIONS = [
  { title: 'Прирост от базовой линии', text: 'По API засчитывается только то, что произошло после взятия квеста, старые достижения не считаются.' },
  { title: 'Проверка повторных скриншотов', text: 'Скриншот сверяется с прошлыми заявками того же игрока и с чужими заявками; модератор видит предупреждение.' },
  { title: 'Мультиаккаунты', text: 'Подозрительные аккаунты разбираются вручную, нарушители блокируются.' },
  { title: 'Кулдауны и лимиты', text: 'Повторная сдача одного квеста ограничена периодом, на награды действуют лимиты.' },
  { title: 'Удержание выплат', text: 'В турнирах приз удерживается до решения модератора, если по результату есть вопросы.' },
  { title: 'Ручной разбор', text: 'Спорные случаи и подозрения проверяет человек, а не только автоматика.' },
];

const NOT_PROMISED = [
  'Часть квестов проверяется вручную по скриншоту: это менее надёжно, чем API, и мы не называем такие результаты «стопроцентными».',
  'Мы не даём «100% защиты от накруток»: мы показываем, какие проверки применяем и какие цифры получаются на практике.',
  'Внешнего независимого аудита (например, через AppsFlyer) у нас пока нет: доказательство строится на описании механик и реальных цифрах ниже.',
];

function pct(v: number | null, sample: number): React.ReactNode {
  if (v === null) {
    return <span className="proof-sample">мало данных (выборка {sample})</span>;
  }
  return (
    <>
      {v}% <span className="proof-sample">выборка {sample}</span>
    </>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export default function ProofContent() {
  const [stats, setStats] = useState<ProofStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/public/proof')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: ProofStats) => setStats(d))
      .catch(() => setFailed(true));
  }, []);

  return (
    <main className="partners-page">
      <section className="hero">
        <div className="hero-badge">Партнёрам</div>
        <h1>
          Как EGC проверяет <span className="accent">результат</span>
        </h1>
        <p>
          Студия платит за подтверждённое событие в игре, а не за публикацию. Игрок получает награду только после подтверждения.
          Ниже — как оно подтверждается, как мы отсекаем накрутки и какие цифры можем показать.
        </p>
      </section>

      <section id="methods">
        <div className="container">
          <div className="section-tag">Подтверждение</div>
          <h2 className="section-title">Три способа подтвердить результат</h2>
          <div className="collab-grid">
            {METHODS.map(m => (
              <div key={m.title} className="collab-item">
                <div className="collab-icon">{m.icon}</div>
                <div className="collab-body">
                  <div className="collab-title">{m.title}</div>
                  <div className="collab-desc">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="protection">
        <div className="container">
          <div className="section-tag">Защита</div>
          <h2 className="section-title">Как отсекаются накрутки</h2>
          <p className="section-sub">Принципы без технических подробностей: пороги и правила срабатывания мы не публикуем.</p>
          <ul className="proof-list">
            {PROTECTIONS.map(p => (
              <li key={p.title}>
                <strong>{p.title}.</strong> {p.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="numbers">
        <div className="container">
          <div className="section-tag">Цифры</div>
          <h2 className="section-title">За последние {stats?.windowDays ?? 30} дней</h2>
          <p className="section-sub">
            Значения считаются из рабочей базы и обновляются раз в час. Рядом с каждой долей указан размер выборки; если выборка меньше 30,
            долю мы не показываем.
          </p>
          {stats ? (
            <>
              <div className="proof-table-wrap">
                <table className="proof-table">
                  <thead>
                    <tr>
                      <th>Показатель</th>
                      <th>Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Игроков в базе</td>
                      <td>{stats.playersTotal}+</td>
                    </tr>
                    <tr>
                      <td>Активных игроков за неделю</td>
                      <td>{stats.activeWeek}</td>
                    </tr>
                    <tr>
                      <td>Игроков с хотя бы одним подтверждённым квестом</td>
                      <td>{stats.playersApproved}</td>
                    </tr>
                    <tr>
                      <td>Проверено заявок, доля одобренных</td>
                      <td>{stats.decided} · {pct(stats.approvedPercent, stats.decided)}</td>
                    </tr>
                    <tr>
                      <td>Подтверждено автоматически (API, постбэк, проверка подписки)</td>
                      <td>{pct(stats.autoApprovedPercent, stats.approved)}</td>
                    </tr>
                    <tr>
                      <td>Отклонено модератором из проверенных вручную</td>
                      <td>{pct(stats.rejectedManualPercent, stats.manualDecided)}</td>
                    </tr>
                    <tr>
                      <td>Повторные скриншоты среди сданных заявок</td>
                      <td>{pct(stats.duplicatePercent, stats.submitted)}</td>
                    </tr>
                    <tr>
                      <td>Новые игроки, активные через неделю</td>
                      <td>{pct(stats.retention7Percent, stats.retentionCohort7)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="proof-date">Данные на {formatDate(stats.collectedAt)}.</div>
              <p className="proof-note">
                «Активные через неделю» — доля игроков, зарегистрировавшихся 7–14 дней назад и заходивших в последние 7 дней. Это не точный возврат
                ровно на 7-й день.
              </p>
            </>
          ) : (
            <p className="proof-note">{failed ? 'Цифры временно недоступны. Попробуйте обновить страницу позже.' : 'Загружаем цифры…'}</p>
          )}
        </div>
      </section>

      <section id="verify">
        <div className="container">
          <div className="section-tag">Сверка</div>
          <h2 className="section-title">Что студия может проверить сама</h2>
          <ul className="proof-list">
            <li>Выгрузка по вашему квесту без персональных данных: хэш идентификатора игрока, время, статус заявки, способ проверки. Её можно сверить с вашими данными.</li>
            <li>Подключение вашего постбэка или промокодов, чтобы подтверждение шло от вас.</li>
            <li>Пробный квест с отчётом: воронка, структура проверок, что отсеяно, сроки.</li>
          </ul>
        </div>
      </section>

      <section id="payouts">
        <div className="container">
          <div className="section-tag">Выплаты</div>
          <h2 className="section-title">Прозрачность выплат</h2>
          <p className="section-sub">
            Подтверждения реальных выплат игрокам публикуются в канале{' '}
            <a href="https://t.me/egc_payouts" target="_blank" rel="noopener noreferrer">@egc_payouts</a>. Это доказывает, что награды получают живые люди.
          </p>
        </div>
      </section>

      <section id="limits">
        <div className="container">
          <div className="section-tag">Честно</div>
          <h2 className="section-title">Чего мы не обещаем</h2>
          <ul className="proof-list">
            {NOT_PROMISED.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="cta">
        <div className="container">
          <div className="cta-inner">
            <h2>Хотите проверить на пробном квесте?</h2>
            <p>Напишите нам: запустим квест под вашу задачу и пришлём отчёт по нашему шаблону.</p>
            <div className="cta-buttons">
              <a href="https://t.me/GressToEx" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Telegram @GressToEx
              </a>
              <Link href="/partners" className="btn-secondary">
                ← К странице партнёрам
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
