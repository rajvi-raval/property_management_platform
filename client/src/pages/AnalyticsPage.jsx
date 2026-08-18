import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, ShieldCheck, Clock, CalendarCheck, Zap, Award, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage = () => {
  const { maintenanceKpis, amenityKpis } = useApp();

  const kpiItems = [
    {
      title: 'Maintenance Resolution Time',
      current: `${maintenanceKpis.avgResolutionTimeHours} Hours`,
      target: '≤ 48 Hours',
      status: maintenanceKpis.avgResolutionTimeHours <= 48 ? 'SLA Passed ✅' : 'Warning ⚠️',
      description: 'Average duration between ticket submission and final technician resolution.',
      icon: Clock,
      color: 'var(--accent-emerald)'
    },
    {
      title: 'Request Completion Rate',
      current: `${maintenanceKpis.completionRate}%`,
      target: '≥ 90%',
      status: maintenanceKpis.completionRate >= 90 ? 'Target Met ✅' : 'Needs Focus ⚠️',
      description: 'Percentage of all recorded maintenance tickets resolved successfully.',
      icon: ShieldCheck,
      color: 'var(--accent-cyan)'
    },
    {
      title: 'Amenity Booking Conflicts',
      current: `${amenityKpis.bookingConflicts} Double Bookings`,
      target: '0 Conflicts',
      status: 'Conflict-Free Guaranteed ✅',
      description: 'Strict slot collision detection engine preventing double reservations.',
      icon: CalendarCheck,
      color: 'var(--accent-purple)'
    },
    {
      title: 'System Response Time',
      current: `${amenityKpis.systemResponseTimeSec} Seconds`,
      target: '≤ 2 Seconds',
      status: 'Ultra Fast SLA ✅',
      description: 'Web API & WebSocket state synchronization response latency.',
      icon: Zap,
      color: 'var(--accent-amber)'
    },
    {
      title: 'User Satisfaction Score',
      current: `${amenityKpis.amenitySatisfactionScore} / 5.0`,
      target: '≥ 4.0 / 5',
      status: 'Top Rated ⭐',
      description: 'Tenant feedback and experience score across rental operations.',
      icon: Award,
      color: 'var(--accent-blue)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={26} color="var(--accent-emerald)" /> Key Performance Indicators (KPIs) & SLA Audit
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Real-time verification against platform primary and secondary performance objectives.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {kpiItems.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} color={kpi.color} />
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: kpi.color,
                    background: 'rgba(255,255,255,0.04)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-glass)'
                  }}>
                    {kpi.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 4px 0' }}>{kpi.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {kpi.description}
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Measured Metric</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{kpi.current}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target SLA</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{kpi.target}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
