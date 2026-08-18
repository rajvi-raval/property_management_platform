import React from 'react';
import { useApp } from '../context/AppContext';
import { Building, MapPin, Users, Wrench, Shield, CheckCircle } from 'lucide-react';

export const PropertyPage = () => {
  const { properties } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building size={26} color="var(--accent-cyan)" /> Property & Unit Portfolio Showcase
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Manage managed real estate complexes, total units, occupancy rates, and facility assignments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {properties.map(property => (
          <div key={property.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
              <img 
                src={property.image} 
                alt={property.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                Managed Complex ID: {property.id}
              </span>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '2px 0 4px 0' }}>{property.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-rose)" /> {property.address}
              </p>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
              {property.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              background: 'rgba(255,255,255,0.03)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Units</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{property.totalUnits} Units</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Occupancy</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {Math.round((property.occupiedUnits / property.totalUnits) * 100)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Tickets</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {property.activeMaintenanceCount} Tickets
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span>Property Manager: <strong style={{ color: '#fff' }}>{property.managerName}</strong></span>
              <span className="badge badge-completed">24/7 Monitored</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
