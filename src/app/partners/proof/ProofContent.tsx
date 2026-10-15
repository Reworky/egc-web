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
  approved: number;
  autoApprovedPercent: number | null;
  manualDecided: number;
  rejectedManualPercent: number | null;
  duplicates: number;
  duplicatePercent: number | null;
  retention7Percent: number | null;
  retentionCohort7: number;
}

type Lang = 'ru' | 'en';

interface Copy {
  badge: string;
  titleA: string;
  titleB: string;
  lead: string;
  methodsTag: string;
  methodsTitle: string;
  methods: { icon: string; title: string; desc: string }[];
  protectionTag: string;
  protectionTitle: string;
  protectionSub: string;
  protections: { title: string; text: string }[];
  numbersTag: string;
  numbersTitle: (days: number) => string;
  numbersSub: string;
  rows: {
    players: string;
    activeWeek: string;
    playersApproved: string;
    decided: string;
    approvedLabel: string;
    auto: string;
    rejectedManual: string;
    duplicates: string;
    retention7: string;
  };
  sample: string;
  notEnough: (n: number) => string;
  playersSuffix: string;
  dataOn: string;
  retentionNote: string;
  autoNote: string;
  loading: string;
  failed: string;
  verifyTag: string;
  verifyTitle: string;
  verify: string[];
  payoutsTag: string;
  payoutsTitle: string;
  payoutsPre: string;
  payoutsPost: string;
  limitsTag: string;
  limitsTitle: string;
  limits: string[];
  ctaTitle: string;
  ctaText: string;
  ctaTelegram: string;
  back: string;
  otherLangLabel: string;
  otherLangHref: string;
  partnersHref: string;
}

const COPY: Record<Lang, Copy> = {
  ru: {
    badge: 'Партнёрам',
    titleA: 'Как EGC проверяет',
    titleB: 'результат',
    lead: 'Студия платит за подтверждённое событие в игре, а не за публикацию. Игрок получает награду только после подтверждения. Ниже — как оно подтверждается, как мы отсекаем накрутки и какие цифры можем показать.',
    methodsTag: 'Подтверждение',
    methodsTitle: 'Три способа подтвердить результат',
    methods: [
      {
        icon: '🎮',
        title: 'Данные игры по API',
        desc: 'Игрок привязывает свой игровой тег, а мы сверяем прогресс с официальным API игры: победы, трофеи, ачивки и т. п. Считается прирост с момента, когда игрок взял квест. Ответ приходит автоматически, награда выдаётся после выполнения условия. Сейчас так работают квесты по Brawl Stars, Clash Royale и Clash of Clans.',
      },
      {
        icon: '🤝',
        title: 'Подтверждение от студии',
        desc: 'Если у игры нет открытого API, подтверждение даёт студия: файл подтверждённых игроков, уникальные промокоды или ваш постбэк. Для пробного квеста достаточно файла. Универсальной интеграции пока нет: каждую связку мы настраиваем под студию по договорённости. Игрок получает награду только после подтверждения.',
      },
      {
        icon: '📸',
        title: 'Скриншот и модерация',
        desc: 'Игрок присылает скриншот, модератор одобряет, отклоняет с причиной или запрашивает уточнение. Это самый слабый способ, поэтому для результатов, за которые платит студия, мы предлагаем первые два.',
      },
    ],
    protectionTag: 'Защита',
    protectionTitle: 'Как отсекаются накрутки',
    protectionSub: 'Принципы без технических подробностей: пороги и правила срабатывания мы не публикуем.',
    protections: [
      { title: 'Прирост от базовой линии', text: 'По API засчитывается только то, что произошло после взятия квеста, старые достижения не считаются.' },
      { title: 'Проверка повторных скриншотов', text: 'Скриншот сверяется с прошлыми заявками того же игрока и с чужими заявками; модератор видит предупреждение.' },
      { title: 'Мультиаккаунты', text: 'Подозрительные аккаунты отмечаются и разбираются вручную, нарушители блокируются.' },
      { title: 'Кулдауны и лимиты', text: 'Повторная сдача одного квеста ограничена периодом, на награды действуют лимиты.' },
      { title: 'Удержание выплат', text: 'В турнирах приз удерживается до решения модератора, если по результату есть вопросы.' },
      { title: 'Ручной разбор', text: 'Спорные случаи и подозрения проверяет человек, а не только автоматика.' },
    ],
    numbersTag: 'Цифры',
    numbersTitle: d => `За последние ${d} дней`,
    numbersSub:
      'Значения считаются из рабочей базы и обновляются раз в час. Рядом с каждой долей указан размер выборки; если выборка меньше 30, долю мы не показываем.',
    rows: {
      players: 'Игроков в базе',
      activeWeek: 'Активных игроков за неделю',
      playersApproved: 'Игроков с хотя бы одним подтверждённым квестом',
      decided: 'Проверено заявок за период',
      approvedLabel: 'одобрено',
      auto: 'Подтверждено без модератора (автопроверка: API, постбэк, проверка подписки)',
      rejectedManual: 'Отклонено модератором из проверенных вручную',
      duplicates: 'Повторные скриншоты среди проверенных вручную',
      retention7: 'Новые игроки, активные через неделю',
    },
    sample: 'выборка',
    notEnough: n => `мало данных (выборка ${n})`,
    playersSuffix: '+',
    dataOn: 'Данные на',
    retentionNote:
      '«Активные через неделю» — доля игроков, зарегистрировавшихся 7–14 дней назад и заходивших в последние 7 дней. Это не точный возврат ровно на 7-й день.',
    autoNote:
      '«Подтверждено без модератора» считается по типу квеста: у таких квестов результат проверяет автоматика, и заявка не попадает в очередь модерации.',
    loading: 'Загружаем цифры…',
    failed: 'Цифры временно недоступны. Попробуйте обновить страницу позже.',
    verifyTag: 'Сверка',
    verifyTitle: 'Что студия может проверить сама',
    verify: [
      'Выгрузка без персональных данных: хэш идентификатора игрока, время, статус заявки, квест и способ проверки. Сейчас формируем её по запросу за нужный период; по колонке квеста выбираются строки вашего квеста, и их можно сверить с вашими данными. Выгрузки передаются на условиях NDA, хранятся 90 дней и удаляются по запросу студии.',
      'По договорённости: подтверждение от вас в удобной форме. Самый простой вариант: вы присылаете файл с подтверждёнными игроками (ник или ID и дата события), мы сверяем и начисляем награду. Дальше можно подключить уникальные промокоды или ваш постбэк. Это индивидуальная настройка, а не готовая функция.',
      'Пробный квест с отчётом: воронка, структура проверок, что отсеяно, сроки. Отчёт мы готовим вручную по этой структуре.',
    ],
    payoutsTag: 'Выплаты',
    payoutsTitle: 'Прозрачность выплат',
    payoutsPre: 'Подтверждения реальных выплат игрокам публикуются в канале',
    payoutsPost: '. Это доказывает, что награды получают живые люди.',
    limitsTag: 'Честно',
    limitsTitle: 'Чего мы не обещаем',
    limits: [
      'Часть квестов проверяется вручную по скриншоту: это менее надёжно, чем API, и мы не называем такие результаты «стопроцентными».',
      'Мы не даём «100% защиты от накруток»: мы показываем, какие проверки применяем и какие цифры получаются на практике.',
      'Внешнего независимого аудита (например, через AppsFlyer) у нас пока нет: доказательство строится на описании механик и реальных цифрах ниже.',
    ],
    ctaTitle: 'Хотите проверить на пробном квесте?',
    ctaText: 'Напишите нам: запустим квест под вашу задачу и пришлём отчёт о результатах.',
    ctaTelegram: 'Telegram @GressToEx',
    back: '← К странице партнёрам',
    otherLangLabel: 'English version →',
    otherLangHref: '/en/partners/proof',
    partnersHref: '/partners',
  },
  en: {
    badge: 'For partners',
    titleA: 'How EGC verifies',
    titleB: 'results',
    lead: 'A studio pays for a confirmed in-game event, not for a post. A player is rewarded only after the event is confirmed. Below: how we confirm results, how we filter out fake activity, and the numbers we can show.',
    methodsTag: 'Verification',
    methodsTitle: 'Three ways to confirm a result',
    methods: [
      {
        icon: '🎮',
        title: 'Game data via official API',
        desc: "The player links their in-game tag and we compare progress with the game's official API: wins, trophies, achievements and so on. Only progress made after the player took the quest counts. The answer comes automatically and the reward is paid once the condition is met. Today this covers Brawl Stars, Clash Royale and Clash of Clans quests.",
      },
      {
        icon: '🤝',
        title: 'Confirmation from the studio',
        desc: 'If a game has no open API, confirmation comes from the studio: a file of confirmed players, unique promo codes, or your postback. For a trial quest a file is enough. There is no universal integration yet: each setup is configured for the studio by agreement. The player is rewarded only after confirmation.',
      },
      {
        icon: '📸',
        title: 'Screenshot and moderation',
        desc: 'The player sends a screenshot and a moderator approves it, rejects it with a reason, or asks for more details. This is the weakest method, so for results a studio pays for we recommend the first two.',
      },
    ],
    protectionTag: 'Protection',
    protectionTitle: 'How fake activity is filtered out',
    protectionSub: 'Principles only, without technical details: we do not publish thresholds or trigger rules.',
    protections: [
      { title: 'Progress from a baseline', text: 'By API, only what happened after the quest was taken counts; earlier achievements are ignored.' },
      { title: 'Repeated screenshot check', text: "A screenshot is compared with the same player's past submissions and with other players' submissions; the moderator sees a warning." },
      { title: 'Multi-accounts', text: 'Suspicious accounts are flagged and reviewed manually, and violators are banned.' },
      { title: 'Cooldowns and limits', text: 'Re-submitting the same quest is limited by a time window, and rewards are capped by limits.' },
      { title: 'Payout holds', text: 'In tournaments a prize is held until a moderator decides if there are questions about the result.' },
      { title: 'Manual review', text: 'Disputed cases and suspicions are checked by a person, not only by automation.' },
    ],
    numbersTag: 'Numbers',
    numbersTitle: d => `Last ${d} days`,
    numbersSub:
      'Values are calculated from the live database and refreshed hourly. Each share shows its sample size; if the sample is smaller than 30, we do not show the share.',
    rows: {
      players: 'Players in the club',
      activeWeek: 'Active players this week',
      playersApproved: 'Players with at least one confirmed quest',
      decided: 'Submissions reviewed in the period',
      approvedLabel: 'approved',
      auto: 'Confirmed without a moderator (auto-verified: game API, postback, subscription check)',
      rejectedManual: 'Rejected by a moderator among manually reviewed',
      duplicates: 'Repeated screenshots among manually reviewed',
      retention7: 'New players still active after a week',
    },
    sample: 'sample',
    notEnough: n => `not enough data (sample ${n})`,
    playersSuffix: '+',
    dataOn: 'Data as of',
    retentionNote:
      '"Still active after a week" is the share of players who registered 7–14 days ago and were active during the last 7 days. It is not an exact day-7 return.',
    autoNote:
      '"Confirmed without a moderator" is calculated by quest type: for these quests automation checks the result and the submission does not enter the moderation queue.',
    loading: 'Loading numbers…',
    failed: 'Numbers are temporarily unavailable. Please try again later.',
    verifyTag: 'Cross-check',
    verifyTitle: 'What a studio can verify itself',
    verify: [
      'An export without personal data: a hashed player ID, time, submission status, quest and verification method. We currently generate it on request for the period you need; filter it by the quest column to get the rows for your quest and reconcile them with your data. Exports are shared under an NDA, kept for 90 days and deleted on the studio\'s request.',
      'By agreement: confirmation from your side in a form that suits you. The simplest option: you send a file of confirmed players (nickname or ID and event date), and we reconcile it and pay the reward. Later we can connect unique promo codes or your postback. This is a custom setup, not a ready-made feature.',
      'A trial quest with a report: funnel, verification structure, what was filtered out, timelines. We prepare the report manually in this structure.',
    ],
    payoutsTag: 'Payouts',
    payoutsTitle: 'Payout transparency',
    payoutsPre: 'Proofs of real payouts to players are published in the channel',
    payoutsPost: '. They show that rewards are received by real people.',
    limitsTag: 'Honestly',
    limitsTitle: 'What we do not promise',
    limits: [
      'Part of the quests is checked manually by screenshot: this is less reliable than an API, and we do not call such results "100% verified".',
      'We do not offer "100% protection from fake activity": we show which checks we apply and what the numbers look like in practice.',
      'We do not have an independent external audit yet (for example via AppsFlyer): the proof rests on the description of our mechanics and the real numbers above.',
    ],
    ctaTitle: 'Want to test it on a trial quest?',
    ctaText: 'Write to us: we will launch a quest for your task and send a report on the results.',
    ctaTelegram: 'Telegram @GressToEx',
    back: '← Partners page',
    otherLangLabel: 'Русская версия →',
    otherLangHref: '/partners/proof',
    partnersHref: '/partners',
  },
};

function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-');
  if (lang === 'ru') return `${d}.${m}.${y}`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

export default function ProofContent({ lang = 'ru' }: { lang?: Lang }) {
  const t = COPY[lang];
  const [stats, setStats] = useState<ProofStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/public/proof')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: ProofStats) => setStats(d))
      .catch(() => setFailed(true));
  }, []);

  function pct(v: number | null, sample: number): React.ReactNode {
    if (v === null) return <span className="proof-sample">{t.notEnough(sample)}</span>;
    return (
      <>
        {v}% <span className="proof-sample">{t.sample} {sample}</span>
      </>
    );
  }

  return (
    <main className="partners-page" lang={lang}>
      <section className="hero">
        <div className="hero-badge">{t.badge}</div>
        <h1>
          {t.titleA} <span className="accent">{t.titleB}</span>
        </h1>
        <p>{t.lead}</p>
        <p style={{ marginTop: 20 }}>
          <Link href={t.otherLangHref} className="btn-secondary">{t.otherLangLabel}</Link>
        </p>
      </section>

      <section id="methods">
        <div className="container">
          <div className="section-tag">{t.methodsTag}</div>
          <h2 className="section-title">{t.methodsTitle}</h2>
          <div className="collab-grid">
            {t.methods.map(m => (
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
          <div className="section-tag">{t.protectionTag}</div>
          <h2 className="section-title">{t.protectionTitle}</h2>
          <p className="section-sub">{t.protectionSub}</p>
          <ul className="proof-list">
            {t.protections.map(p => (
              <li key={p.title}>
                <strong>{p.title}.</strong> {p.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="numbers">
        <div className="container">
          <div className="section-tag">{t.numbersTag}</div>
          <h2 className="section-title">{t.numbersTitle(stats?.windowDays ?? 30)}</h2>
          <p className="section-sub">{t.numbersSub}</p>
          {stats ? (
            <>
              <div className="proof-table-wrap">
                <table className="proof-table">
                  <tbody>
                    <tr>
                      <td>{t.rows.players}</td>
                      <td>{stats.playersTotal}{t.playersSuffix}</td>
                    </tr>
                    <tr>
                      <td>{t.rows.activeWeek}</td>
                      <td>{stats.activeWeek}</td>
                    </tr>
                    <tr>
                      <td>{t.rows.playersApproved}</td>
                      <td>{stats.playersApproved}</td>
                    </tr>
                    <tr>
                      <td>{t.rows.decided}</td>
                      <td>{stats.decided} <span className="proof-sample">{t.rows.approvedLabel} {stats.approved}</span></td>
                    </tr>
                    <tr>
                      <td>{t.rows.auto}</td>
                      <td>{pct(stats.autoApprovedPercent, stats.approved)}</td>
                    </tr>
                    <tr>
                      <td>{t.rows.rejectedManual}</td>
                      <td>{pct(stats.rejectedManualPercent, stats.manualDecided)}</td>
                    </tr>
                    <tr>
                      <td>{t.rows.duplicates}</td>
                      <td>{pct(stats.duplicatePercent, stats.manualDecided)}</td>
                    </tr>
                    <tr>
                      <td>{t.rows.retention7}</td>
                      <td>{pct(stats.retention7Percent, stats.retentionCohort7)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="proof-date">{t.dataOn} {formatDate(stats.collectedAt, lang)}.</div>
              <p className="proof-note">{t.autoNote}</p>
              <p className="proof-note">{t.retentionNote}</p>
            </>
          ) : (
            <p className="proof-note">{failed ? t.failed : t.loading}</p>
          )}
        </div>
      </section>

      <section id="verify">
        <div className="container">
          <div className="section-tag">{t.verifyTag}</div>
          <h2 className="section-title">{t.verifyTitle}</h2>
          <ul className="proof-list">
            {t.verify.map(v => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="payouts">
        <div className="container">
          <div className="section-tag">{t.payoutsTag}</div>
          <h2 className="section-title">{t.payoutsTitle}</h2>
          <p className="section-sub">
            {t.payoutsPre}{' '}
            <a href="https://t.me/egc_payouts" target="_blank" rel="noopener noreferrer">@egc_payouts</a>
            {t.payoutsPost}
          </p>
        </div>
      </section>

      <section id="limits">
        <div className="container">
          <div className="section-tag">{t.limitsTag}</div>
          <h2 className="section-title">{t.limitsTitle}</h2>
          <ul className="proof-list">
            {t.limits.map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="cta">
        <div className="container">
          <div className="cta-inner">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
            <div className="cta-buttons">
              <a href="https://t.me/GressToEx" target="_blank" rel="noopener noreferrer" className="btn-primary">
                {t.ctaTelegram}
              </a>
              <Link href={t.partnersHref} className="btn-secondary">
                {t.back}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
