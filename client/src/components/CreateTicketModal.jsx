import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, Wrench, AlertCircle } from 'lucide-react';

export const CreateTicketModal = ({ isOpen, onClose }) => {
  const { user, properties, refreshData, showToast } = useApp();
  const [formData, setFormData] = useState({
    propertyId: user.propertyId || 'p-101',
    title: '',
    issueDescription: '',
    category: 'Plumbing',
    priority: 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issueDescription) {
      showToast('Please provide issue title and details.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createMaintenanceRequest({
        ...formData,
        tenantId: user.id
      });

      if (res.success) {
        showToast('Maintenance request submitted successfully!', 'success');
        refreshData();
        onClose();
        setFormData({
          propertyId: user.propertyId || 'p-101',
          title: '',
          issueDescription: '',
          category: 'Plumbing',
          priority: 'Medium'
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit request', 'warning');
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        background: 'var(--bg-card)',
        padding: '28px',
        borderRadius: '20px',
        border: '1px solid var(--border-glass)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(6,182,212,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wrench size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Create Maintenance Request</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Tenant: {user.name} ({user.unitNumber})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Property Building
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              style={{ width: '100%' }}
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.address}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Issue Summary / Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Kitchen Sink Leaking, Heating Failure"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC / Climate">HVAC / Climate</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Carpentry & Doors">Carpentry & Doors</option>
                <option value="General Maintenance">General Maintenance</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Low">Low (Routine)</option>
                <option value="Medium">Medium (Normal)</option>
                <option value="High">High (Urgent)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Detailed Description *
            </label>
            <textarea
              rows={4}
              placeholder="Provide exact details of the issue to assist facility engineers..."
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              style={{ width: '100%', resize: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
