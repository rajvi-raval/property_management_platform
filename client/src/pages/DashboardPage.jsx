import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { Wrench, CalendarCheck, Clock, ShieldCheck, Plus, Building, ChevronRight, Activity } from 'lucide-react';

export const DashboardPage = ({ setActiveTab }) => {
  const { user, maintenanceRequests, amenities, bookings, maintenanceKpis, amenityKpis } = useApp();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const pendingCount = maintenanceRequests.filter(r => r.status === 'Pending').length;
  const inProgressCount = maintenanceRequests.filter(r => r.status === 'In Progress').length;
  const completedCount = maintenanceRequests.filter(r => r.status === 'Completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(139,92,246,0.12))',
        border: '1px solid rgba(6,182,212,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {user.role === 'tenant' ? 'Tenant Portal' : 'Property Manager Command Center'}
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '4px 0 6px 0' }}>
            Welcome back, {user.name} 👋
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            Real-time status monitoring for Grand Vista Heights & Sunset Park.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={18} /> New Maintenance Ticket
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className="btn-secondary"
          >
            <CalendarCheck size={18} color="var(--accent-purple)" /> Reserve Amenity
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        <StatCard
          title="Avg Resolution Time"
          value={`${maintenanceKpis.avgResolutionTimeHours} hrs`}
          target="≤ 48 hours"
          status={maintenanceKpis.avgResolutionTimeHours <= 48 ? 'SLA Passed' : 'Overdue'}
          icon={Clock}
          color="var(--accent-emerald)"
        />

        <StatCard
          title="Completion Rate"
          value={`${maintenanceKpis.completionRate}%`}
          target="≥ 90%"
          status={maintenanceKpis.completionRate >= 90 ? 'Optimal' : 'Needs Focus'}
          icon={ShieldCheck}
          color="var(--accent-cyan)"
        />

        <StatCard
          title="Booking Conflicts"
          value={`${amenityKpis.bookingConflicts}`}
          target="0 Conflicts"
          status="Engine Active"
          icon={CalendarCheck}
          color="var(--accent-purple)"
        />

        <StatCard
          title="System Response"
          value={`${amenityKpis.systemResponseTimeSec} s`}
          target="≤ 2.0 seconds"
          status="Fast SLA"
          icon={Activity}
          color="var(--accent-amber)"
        />
      </div>

      {/* 2-Column Split: Active Maintenance & Amenity Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        {/* Maintenance Overview Box */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wrench size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>Recent Maintenance Requests</h3>
            </div>
            <button
              onClick={() => setActiveTab('maintenance')}
              style={{ background: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick status counter bars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>Pending</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{pendingCount}</div>
            </div>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>In Progress</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{inProgressCount}</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Completed</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{completedCount}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {maintenanceRequests.slice(0, 4).map(req => (
              <div key={req.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{req.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {req.propertyName} • {req.unitNumber} • Priority: <span style={{ color: 'var(--accent-rose)' }}>{req.priority}</span>
                  </div>
                </div>
                <span className={`badge badge-${req.status === 'Pending' ? 'pending' : req.status === 'In Progress' ? 'progress' : 'completed'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Amenity Usage & Live Availability */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarCheck size={20} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>Shared Amenities Overview</h3>
            </div>
            <button
              onClick={() => setActiveTab('amenities')}
              style={{ background: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Book Slot <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {amenities.slice(0, 4).map(amenity => (
              <div key={amenity.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={amenity.image} 
                    alt={amenity.name} 
                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{amenity.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Hours: {amenity.openingTime} - {amenity.closingTime} • Max {amenity.maxCapacity} Guests
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--accent-emerald)',
                  background: 'rgba(16,185,129,0.15)',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal for adding maintenance ticket */}
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </div>
  );
};
