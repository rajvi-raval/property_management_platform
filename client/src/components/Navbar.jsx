import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, User, Bell, Radio, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const Navbar = () => {
  const { user, switchRole, activityLogs, notification } = useApp();
  const [showLogs, setShowLogs] = useState(false);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px'
    }}>
      {/* Brand & Property Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
        }}>
          <Building2 size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            PropSync <span style={{ fontSize: '0.7rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.3)' }}>REAL-TIME MERN</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Grand Vista Heights & Sunset Park</p>
        </div>
      </div>

      {/* Center Toast Notification banner if active */}
      {notification && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.2)',
          border: `1px solid ${notification.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}`,
          padding: '6px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          {notification.message}
        </div>
      )}

      {/* Right Controls: Real-time Socket Indicator, Role Switcher, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Live WS Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          color: 'var(--accent-emerald)',
          fontWeight: 600
        }}>
          <span className="pulse-dot"></span>
          SOCKET.IO LIVE
        </div>

        {/* Live Activity Stream Button */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Bell size={18} color="var(--accent-cyan)" />
            <span>Activity</span>
            {activityLogs.length > 0 && (
              <span style={{
                background: 'var(--accent-cyan)',
                color: '#000',
                fontWeight: 700,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }}>
                {activityLogs.length}
              </span>
            )}
          </button>

          {/* Activity Dropdown */}
          {showLogs && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '340px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              padding: '16px',
              zIndex: 200
            }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={16} color="var(--accent-cyan)" /> Live Activity Stream
              </h4>
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activityLogs.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent real-time activity yet.</p>
                ) : (
                  activityLogs.map((log, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      borderLeft: `3px solid ${log.type === 'maintenance' ? 'var(--accent-amber)' : 'var(--accent-purple)'}`
                    }}>
                      <div style={{ color: '#fff', fontWeight: 500 }}>{log.message}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '2px' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            onClick={() => switchRole('tenant')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: user.role === 'tenant' ? 'var(--accent-cyan)' : 'transparent',
              color: user.role === 'tenant' ? '#000' : 'var(--text-muted)'
            }}
          >
            Tenant
          </button>
          <button
            onClick={() => switchRole('manager')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: user.role === 'manager' ? 'var(--accent-purple)' : 'transparent',
              color: user.role === 'manager' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Manager
          </button>
        </div>

        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
              {user.role.toUpperCase()} • {user.unitNumber}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
