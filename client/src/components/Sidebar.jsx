import React from 'react';
import { LayoutDashboard, Wrench, CalendarCheck, Building, BarChart3, Clock, CheckCircle } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Operations Overview', icon: LayoutDashboard },
    { id: 'maintenance', label: 'Maintenance Requests', icon: Wrench, badge: 'Live' },
    { id: 'amenities', label: 'Amenity Booking', icon: CalendarCheck },
    { id: 'properties', label: 'Property Catalog', icon: Building },
    { id: 'analytics', label: 'KPI Analytics & Compliance', icon: BarChart3 }
  ];

  return (
    <aside style={{
      position: 'fixed',
      top: '70px',
      left: 0,
      bottom: 0,
      width: '260px',
      background: 'rgba(11, 15, 25, 0.95)',
      borderRight: '1px solid var(--border-glass)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 90
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-dim)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          paddingLeft: '12px',
          marginBottom: '8px'
        }}>
          Main Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                background: isActive ? 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))' : 'transparent',
                border: isActive ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={20} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'rgba(16,185,129,0.2)',
                  color: 'var(--accent-emerald)',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* KPI Target Summary Box in Sidebar bottom */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-glass)',
        borderRadius: '14px',
        padding: '16px'
      }}>
        <h4 style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="var(--accent-amber)" /> SLA Targets
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Max Resolution:</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>&le; 48h</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Target Completion:</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>&ge; 90%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Booking Conflicts:</span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>0 (Zero)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
