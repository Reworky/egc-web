'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import { api, SpinResponse } from '@/lib/api';

const SECTORS = [
  { label: '50 EXC',       color: '#6d28d9', textColor: '#e9d5ff' },
  { label: '100 EXC',      color: '#7c3aed', textColor: '#ede9fe' },
  { label: '300 EXC',      color: '#a855f7', textColor: '#faf5ff' },
  { label: '500 EXC',      color: '#c026d3', textColor: '#fdf4ff' },
  { label: '1 000 EXC',    color: '#db2777', textColor: '#fce7f3' },
  { label: '2 000 EXC',    color: '#e11d48', textColor: '#ffe4e6' },
  { label: 'XP-буст 24ч', color: '#0891b2', textColor: '#e0f2fe' },
  { label: 'Рамка 👑',     color: '#b45309', textColor: '#fef3c7' },
];

const N = SECTORS.length;
const SLICE = (2 * Math.PI) / N;

function drawWheel(canvas: HTMLCanvasElement, rotation: number) {
  const ctx = canvas.getContext('2d')!;
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  ctx.clearRect(0, 0, size, size);

  // Glow ring
  const glow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r + 4);
  glow.addColorStop(0, 'transparent');
  glow.addColorStop(1, 'rgba(168,85,247,0.4)');
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI);
  ctx.fillStyle = glow;
  ctx.fill();

  // Sectors
  SECTORS.forEach((sec, i) => {
    const start = rotation + i * SLICE;
    const end = start + SLICE;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = sec.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + SLICE / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = sec.textColor;
    ctx.font = `bold ${size < 320 ? 10 : 12}px 'Rajdhani', sans-serif`;
    ctx.fillText(sec.label, r - 10, 4);
    ctx.restore();
  });

  // Center cap
  const cap = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
  cap.addColorStop(0, '#1e1030');
  cap.addColorStop(1, '#0d0617');
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
  ctx.fillStyle = cap;
  ctx.fill();
  ctx.strokeStyle = 'rgba(168,85,247,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center icon
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎰', cx, cy);
}

function drawArrow(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const size = canvas.width;
  const cx = size / 2;

  ctx.clearRect(0, 0, size, 40);
  ctx.beginPath();
  ctx.moveTo(cx - 12, 4);
  ctx.lineTo(cx + 12, 4);
  ctx.lineTo(cx, 36);
  ctx.closePath();
  ctx.fillStyle = '#f472b6';
  ctx.fill();
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
}

export default function WheelPage() {
  const { user } = useAuth();
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const arrowRef = useRef<HTMLCanvasElement>(null);

  const [tickets, setTickets] = useState<number | null>(null);
  const [spinsToday, setSpinsToday] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResponse | null>(null);
  const [error, setError] = useState('');
  const rotRef = useRef(0);
  const rafRef = useRef<number>(0);

  const redraw = useCallback(() => {
    if (wheelRef.current) drawWheel(wheelRef.current, rotRef.current);
  }, []);

  // Load status
  useEffect(() => {
    if (!user) return;
    api.wheelStatus().then(s => {
      setTickets(s.tickets);
      setSpinsToday(s.spinsToday);
    }).catch(() => {});
  }, [user]);

  // Init canvas
  useEffect(() => {
    redraw();
    if (arrowRef.current) drawArrow(arrowRef.current);
  }, [redraw]);

  const spin = useCallback(async () => {
    if (spinning || !user) return;
    setResult(null);
    setError('');
    setSpinning(true);

    // Pick random target sector index (will be resolved from API result later)
    const spinRevs = 5 + Math.random() * 3; // 5–8 full rotations
    const targetRot = rotRef.current + spinRevs * 2 * Math.PI;
    const duration = 4000;
    const start = performance.now();
    const startRot = rotRef.current;

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 4);
    }

    // Animate first
    function frame(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      rotRef.current = startRot + (targetRot - startRot) * easeOut(t);
      redraw();
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rotRef.current = targetRot % (2 * Math.PI);
        redraw();
        setSpinning(false);
        // Result already fetched in parallel
      }
    }

    // Fire API call in parallel with animation
    const [, response] = await Promise.all([
      new Promise<void>(resolve => {
        rafRef.current = requestAnimationFrame(function go(now) {
          const elapsed = now - start;
          const t = Math.min(elapsed / duration, 1);
          rotRef.current = startRot + (targetRot - startRot) * easeOut(t);
          redraw();
          if (t < 1) rafRef.current = requestAnimationFrame(go);
          else { rotRef.current = targetRot % (2 * Math.PI); redraw(); resolve(); }
        });
      }),
      api.wheelSpin().catch(e => ({ success: false, message: String(e), type: null, excAmount: 0, label: null, newTickets: tickets ?? 0, spinsToday: spinsToday + 1 }) as SpinResponse),
    ]);

    cancelAnimationFrame(rafRef.current);
    rotRef.current = targetRot % (2 * Math.PI);
    redraw();
    setSpinning(false);

    if (response.success) {
      setResult(response);
      setTickets(response.newTickets);
      setSpinsToday(response.spinsToday);
    } else {
      setError(response.message);
      // Refresh actual state
      api.wheelStatus().then(s => { setTickets(s.tickets); setSpinsToday(s.spinsToday); }).catch(() => {});
    }
  }, [spinning, user, tickets, spinsToday, redraw]);

  const canSpin = user && !spinning && (tickets ?? 0) > 0 && spinsToday < 10;

  const prizes = [
    { label: '🥉 50 EXC',      prob: '30%' },
    { label: '🥉 100 EXC',     prob: '25%' },
    { label: '🥈 300 EXC',     prob: '20%' },
    { label: '🥈 500 EXC',     prob: '12%' },
    { label: '🥇 1 000 EXC',   prob: '8%'  },
    { label: '🥇 2 000 EXC',   prob: '3%'  },
    { label: '💎 XP-буст 24ч', prob: '1.5%' },
    { label: '👑 Рамка аватара', prob: '0.5%' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">🎰 Колесо фортуны</h1>
        <p style={{ color: 'var(--muted)' }}>
          Крути колесо и выигрывай EXC, XP-буст или рамку аватара.
        </p>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.6), transparent)' }} />
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
          <span>🎟</span>
          <span style={{ color: 'var(--muted)' }}>Билетов:</span>
          <strong className="text-white">{user ? (tickets ?? '…') : '—'}</strong>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
          <span>🔄</span>
          <span style={{ color: 'var(--muted)' }}>Сегодня:</span>
          <strong className="text-white">{user ? `${spinsToday} / 10` : '—'}</strong>
        </div>
      </div>

      {/* Wheel */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: 320, maxWidth: '100%' }}>
          {/* Arrow */}
          <canvas
            ref={arrowRef}
            width={320}
            height={40}
            style={{ display: 'block', width: '100%', position: 'absolute', top: -12, left: 0, zIndex: 10, pointerEvents: 'none' }}
          />
          {/* Wheel canvas */}
          <canvas
            ref={wheelRef}
            width={320}
            height={320}
            style={{ display: 'block', width: '100%', borderRadius: '50%', marginTop: 28 }}
          />
        </div>

        {/* Spin button */}
        {!user ? (
          <p style={{ color: 'var(--muted)' }}>Войдите через Telegram, чтобы крутить колесо.</p>
        ) : (
          <button
            onClick={spin}
            disabled={!canSpin}
            className="px-10 py-4 rounded-2xl text-lg font-black text-white transition-all"
            style={canSpin ? {
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
              boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 4px 20px rgba(0,0,0,0.4)',
              cursor: 'pointer',
            } : {
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--muted)',
              cursor: 'not-allowed',
            }}
          >
            {spinning ? '⏳ Крутится...' : canSpin ? '🎰 Крутить (−1 🎟)' : tickets === 0 ? '🎟 Нет билетов' : '🚫 Лимит исчерпан'}
          </button>
        )}

        {/* Result */}
        {result && (
          <div
            className="w-full rounded-2xl p-5 text-center space-y-2"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1))', border: '1px solid rgba(168,85,247,0.4)' }}
          >
            <div className="text-2xl font-black text-white">🎊 {result.label}</div>
            {result.type === 'EXC' && (
              <div style={{ color: '#fbbf24' }}>+{result.excAmount.toLocaleString('ru')} EXC зачислено</div>
            )}
            {result.type === 'BOOST_24H' && (
              <div style={{ color: '#38bdf8' }}>⚡ XP-буст активирован на 24 часа</div>
            )}
            {result.type === 'AVATAR_FRAME' && (
              <div style={{ color: '#fbbf24' }}>✨ Рамка применена к профилю</div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full rounded-2xl p-4 text-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* How to get tickets */}
      <section className="space-y-4">
        <h2 className="section-title">Как получить билеты 🎟</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: '🗺️', title: 'Лёгкий квест', desc: '+1 билет' },
            { icon: '⚔️', title: 'Средний квест', desc: '+2 билета' },
            { icon: '🏆', title: 'Сложный квест', desc: '+3 билета' },
            { icon: '🔥', title: '3 дня подряд', desc: '+1 билет' },
            { icon: '💥', title: '7 дней подряд', desc: '+2 билета' },
            { icon: '⭐', title: '14 дней подряд', desc: '+3 билета' },
          ].map((item, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="font-bold text-white text-sm">{item.title}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize table */}
      <section className="space-y-4">
        <h2 className="section-title">Таблица призов</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(168,85,247,0.2)' }}>
                <th className="px-4 py-3 text-left font-bold" style={{ color: 'var(--muted)' }}>Приз</th>
                <th className="px-4 py-3 text-right font-bold" style={{ color: 'var(--muted)' }}>Шанс</th>
              </tr>
            </thead>
            <tbody>
              {prizes.map((p, i) => (
                <tr key={i} style={{ borderBottom: i < prizes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td className="px-4 py-3 text-white">{p.label}</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: 'var(--muted)' }}>{p.prob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          Лимит: 10 кручений в сутки · 1 билет = 1 кручение
        </p>
      </section>

    </div>
  );
}
