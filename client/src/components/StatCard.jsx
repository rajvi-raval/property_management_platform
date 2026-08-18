import React from 'react';

export const StatCard = ({ title, value, target, status, icon: Icon, color = 'var(--accent-cyan)' }) => {
  return (
    <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        width: '70px',
        height: '70px',
        background: color,
        opacity: 0.1,
        borderRadius: '50%',
        filter: 'blur(15px)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: `rgba(255,255,255,0.05)`,
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>

      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
        {value}
      </div>

      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        {target && <span style={{ color: 'var(--text-dim)' }}>Target: {target}</span>}
        {status && (
          <span style={{
            color,
            fontWeight: 600,
            background: 'rgba(255,255,255,0.04)',
            padding: '2px 8px',
            borderRadius: '6px',
            border: '1px solid var(--border-glass)'
          }}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};
