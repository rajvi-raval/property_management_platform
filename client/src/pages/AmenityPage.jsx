import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AmenityBookingDrawer } from '../components/AmenityBookingDrawer';
import { CalendarCheck, Clock, Users, ShieldCheck, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export const AmenityPage = () => {
  const { amenities, bookings, refreshData, showToast } = useApp();
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'bookings'

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await api.cancelAmenityBooking(bookingId);
      if (res.success) {
        showToast(`Booking ${res.booking.bookingId} cancelled`, 'success');
        refreshData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'warning');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarCheck size={26} color="var(--accent-purple)" /> Amenity Availability & Booking Hub
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Date & time-based reservation system with check-in, check-out tracking & zero conflict engine.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'catalog' ? 'var(--accent-purple)' : 'transparent',
              color: '#fff'
            }}
          >
            Amenity Catalog ({amenities.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'bookings' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'bookings' ? '#000' : 'var(--text-muted)'
            }}
          >
            Active Bookings ({bookings.filter(b => b.status === 'Confirmed').length})
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        /* Amenity Catalog Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {amenities.map(amenity => (
            <div key={amenity.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ height: '180px', position: 'relative', width: '100%' }}>
                <img 
                  src={amenity.image} 
                  alt={amenity.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(6px)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(6,182,212,0.3)'
                }}>
                  {amenity.category}
                </span>

                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(16,185,129,0.25)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16,185,129,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} color="var(--accent-emerald)" /> Zero Conflict Protection
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0 0 6px 0' }}>{amenity.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {amenity.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: 'var(--text-dim)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--accent-amber)" />
                      <span>{amenity.openingTime} - {amenity.closingTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} color="var(--accent-cyan)" />
                      <span>Max {amenity.maxCapacity}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAmenity(amenity)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={16} /> Reserve Time Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Bookings History & Schedule Table */
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '16px' }}>Current Amenity Reservations</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Booking ID</th>
                  <th style={{ padding: '12px' }}>Amenity</th>
                  <th style={{ padding: '12px' }}>Tenant Name</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Check-In & Check-Out</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{b.bookingId}</td>
                    <td style={{ padding: '14px 12px', color: '#fff', fontWeight: 600 }}>{b.amenityName}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-main)' }}>{b.userName} ({b.unitNumber})</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{b.bookingDate}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                      {b.checkInTime} - {b.checkOutTime}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${b.status === 'Confirmed' ? 'badge-completed' : 'badge-high'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          style={{
                            background: 'rgba(244, 63, 94, 0.15)',
                            color: 'var(--accent-rose)',
                            border: '1px solid rgba(244,63,94,0.3)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem'
                          }}
                        >
                          Cancel Slot
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Drawer Modal */}
      {selectedAmenity && (
        <AmenityBookingDrawer
          amenity={selectedAmenity}
          onClose={() => setSelectedAmenity(null)}
        />
      )}

    </div>
  );
};
