import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { Wrench, Plus, Filter, Clock, UserCheck, CheckCircle2, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';

export const MaintenancePage = () => {
  const { user, maintenanceRequests, refreshData, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTicket, setActiveTicket] = useState(null); // for status update / details view

  // Filter requests
  const filteredRequests = maintenanceRequests.filter(req => {
    if (selectedStatus !== 'All' && req.status !== selectedStatus) return false;
    if (selectedCategory !== 'All' && req.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && req.priority !== selectedPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.requestId.toLowerCase().includes(q) ||
        req.tenantName.toLowerCase().includes(q) ||
        req.unitNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = async (ticketId, newStatus, staffName) => {
    try {
      const res = await api.updateMaintenanceStatus(ticketId, {
        status: newStatus,
        assignedStaff: staffName || 'David Chen (Facilities Staff)',
        note: `Status set to ${newStatus} by ${user.name}`
      });

      if (res.success) {
        showToast(`Ticket ${res.request.requestId} updated to ${newStatus}`, 'success');
        refreshData();
        setActiveTicket(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'warning');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wrench size={26} color="var(--accent-cyan)" /> Real-Time Maintenance Tracker
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Track maintenance issues, assign facilities staff, and monitor resolution SLAs live.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={refreshData} className="btn-secondary">
            <RefreshCw size={16} /> Sync Live Data
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={18} /> Submit Maintenance Request
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Filter size={18} color="var(--accent-cyan)" />
          <span>Filters:</span>
        </div>

        <input
          type="text"
          placeholder="Search by ID, tenant, title, or unit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: '170px' }}
        >
          <option value="All">All Categories</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="HVAC / Climate">HVAC / Climate</option>
          <option value="Appliance Repair">Appliance Repair</option>
          <option value="Carpentry & Doors">Carpentry & Doors</option>
          <option value="General Maintenance">General Maintenance</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      {/* Kanban Board View (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Pending Column */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Pending Dispatch
            </h3>
            <span style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--accent-amber)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
              {filteredRequests.filter(r => r.status === 'Pending').length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRequests.filter(r => r.status === 'Pending').map(req => (
              <TicketCard key={req.id} req={req} onOpenDetails={setActiveTicket} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} /> In Progress
            </h3>
            <span style={{ background: 'rgba(6,182,212,0.2)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
              {filteredRequests.filter(r => r.status === 'In Progress').length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRequests.filter(r => r.status === 'In Progress').map(req => (
              <TicketCard key={req.id} req={req} onOpenDetails={setActiveTicket} />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Completed & Resolved
            </h3>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
              {filteredRequests.filter(r => r.status === 'Completed').length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRequests.filter(r => r.status === 'Completed').map(req => (
              <TicketCard key={req.id} req={req} onOpenDetails={setActiveTicket} />
            ))}
          </div>
        </div>

      </div>

      {/* Ticket Details & Real-Time Status Manager Modal */}
      {activeTicket && (
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
            maxWidth: '600px',
            background: 'var(--bg-card)',
            padding: '28px',
            borderRadius: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{activeTicket.requestId}</span>
                <h2 style={{ fontSize: '1.3rem', color: '#fff', margin: '2px 0' }}>{activeTicket.title}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Property: {activeTicket.propertyName} • {activeTicket.unitNumber} ({activeTicket.tenantName})
                </p>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="btn-secondary"
                style={{ padding: '6px 12px' }}
              >
                Close
              </button>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              marginBottom: '20px',
              fontSize: '0.88rem',
              color: 'var(--text-main)'
            }}>
              {activeTicket.issueDescription}
            </div>

            {/* Quick Transition Buttons */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Update Ticket Lifecycle Status (Live Broadcast):
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleUpdateStatus(activeTicket.id, 'Pending')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    borderColor: activeTicket.status === 'Pending' ? 'var(--accent-amber)' : 'var(--border-glass)'
                  }}
                >
                  Set Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeTicket.id, 'In Progress')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    borderColor: activeTicket.status === 'In Progress' ? 'var(--accent-cyan)' : 'var(--border-glass)'
                  }}
                >
                  Dispatch Staff
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeTicket.id, 'Completed')}
                  className="btn-success"
                  style={{ flex: 1 }}
                >
                  Mark Completed
                </button>
              </div>
            </div>

            {/* Status Log Timeline */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '10px' }}>Activity & Audit Trail</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {activeTicket.statusLogs?.map((log, index) => (
                  <div key={index} style={{
                    fontSize: '0.78rem',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    borderLeft: '3px solid var(--accent-cyan)'
                  }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{log.status}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{log.note}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Creation Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};

// Sub-component for individual Kanban ticket card
const TicketCard = ({ req, onOpenDetails }) => {
  return (
    <div
      onClick={() => onOpenDetails(req)}
      className="glass-card"
      style={{
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{req.requestId}</span>
        <span className={`badge badge-${req.priority === 'High' || req.priority === 'Emergency' ? 'high' : req.priority === 'Medium' ? 'medium' : 'low'}`}>
          {req.priority}
        </span>
      </div>

      <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: 0, fontWeight: 600 }}>{req.title}</h4>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {req.issueDescription}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '8px',
        marginTop: '4px'
      }}>
        <span>{req.unitNumber} ({req.tenantName})</span>
        <span>{new Date(req.createdDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
