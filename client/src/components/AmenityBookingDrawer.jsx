import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, CalendarCheck, Clock, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AmenityBookingDrawer = ({ amenity, onClose }) => {
  const { user, refreshData, showToast } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(todayStr);
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('16:00');
  const [guestsCount, setGuestsCount] = useState(2);

  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-verify slot availability whenever date or times change
  useEffect(() => {
    if (!amenity) return;

    const verifySlot = async () => {
      try {
        setIsChecking(true);
        const res = await api.checkAmenityAvailability({
          amenityId: amenity.id,
          bookingDate,
          checkInTime,
          checkOutTime
        });
        setAvailabilityStatus(res);
      } catch (err) {
        console.error('Check failed:', err);
      } finally {
        setIsChecking(false);
      }
    };

    verifySlot();
  }, [amenity, bookingDate, checkInTime, checkOutTime]);

  if (!amenity) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    if (availabilityStatus && !availabilityStatus.isAvailable) {
      showToast(availabilityStatus.reason || 'Selected slot is unavailable!', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.bookAmenity({
        amenityId: amenity.id,
        userId: user.id,
        bookingDate,
        checkInTime,
        checkOutTime,
        guestsCount
      });

      if (res.success) {
        showToast(`🎉 Reservation confirmed! Booking ID: ${res.booking.bookingId}`, 'success');
        refreshData();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Booking conflict or error occurred', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        background: 'var(--bg-card)',
        padding: '28px',
        borderRadius: '0',
        borderLeft: '1px solid var(--border-glass)',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Amenity Cover Image */}
        <div style={{
          width: '100%',
          height: '180px',
          borderRadius: '14px',
          overflow: 'hidden',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <img 
            src={amenity.image} 
            alt={amenity.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            color: 'var(--accent-cyan)',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(6,182,212,0.3)'
          }}>
            {amenity.category}
          </span>
        </div>

        <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>{amenity.name}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {amenity.description}
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--accent-amber)" />
            <span>Operating Hours: <strong style={{ color: '#fff' }}>{amenity.openingTime} - {amenity.closingTime}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--accent-cyan)" />
            <span>Max Capacity: <strong style={{ color: '#fff' }}>{amenity.maxCapacity} Guests</strong></span>
          </div>
        </div>

        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Select Reservation Date
            </label>
            <input
              type="date"
              value={bookingDate}
              min={todayStr}
              onChange={(e) => setBookingDate(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Check-in Time
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Check-out Time
              </label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Number of Guests
            </label>
            <input
              type="number"
              min={1}
              max={amenity.maxCapacity}
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              style={{ width: '100%' }}
              required
            />
          </div>

          {/* Real-time Conflict Engine Result Badge */}
          <div style={{
            background: availabilityStatus?.isAvailable ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            border: `1px solid ${availabilityStatus?.isAvailable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            {availabilityStatus?.isAvailable ? (
              <ShieldCheck size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={20} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <h4 style={{
                fontSize: '0.85rem',
                margin: 0,
                color: availabilityStatus?.isAvailable ? 'var(--accent-emerald)' : 'var(--accent-rose)'
              }}>
                {isChecking ? 'Verifying schedule...' : availabilityStatus?.isAvailable ? 'Slot Available! (0 Conflicts)' : 'Schedule Conflict Detected'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                {availabilityStatus?.reason}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <button
              type="submit"
              disabled={isSubmitting || (availabilityStatus && !availabilityStatus.isAvailable)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                opacity: (availabilityStatus && !availabilityStatus.isAvailable) ? 0.5 : 1
              }}
            >
              {isSubmitting ? 'Confirming Reservation...' : 'Confirm Amenity Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
