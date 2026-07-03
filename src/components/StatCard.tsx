export default function StatCard({ label, value, icon, accent }: {
  label: string;
  value: string;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.15))',
          border: '1px solid rgba(168,85,247,0.2)',
        }}
      >
        {icon}
      </div>
      <div
        className="text-xl font-black"
        style={accent ? { color: accent } : {
          background: 'linear-gradient(135deg, #fff 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </div>
      <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}
