const store = require('../dbStore');

// Helper to calculate resolution time in hours
const calculateResolutionTime = (createdStr, resolvedStr) => {
  if (!createdStr || !resolvedStr) return null;
  const start = new Date(createdStr).getTime();
  const end = new Date(resolvedStr).getTime();
  const diffHours = (end - start) / (1000 * 3600);
  return Math.max(0.5, Math.round(diffHours * 10) / 10);
};

exports.getAllRequests = (req, res) => {
  const { propertyId, status, tenantId, priority } = req.query;
  
  let list = [...store.maintenanceRequests];

  if (propertyId) list = list.filter(r => r.propertyId === propertyId);
  if (status && status !== 'All') list = list.filter(r => r.status === status);
  if (tenantId) list = list.filter(r => r.tenantId === tenantId);
  if (priority && priority !== 'All') list = list.filter(r => r.priority === priority);

  // Sort newest first
  list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  res.json({
    success: true,
    requests: list,
    total: list.length
  });
};

exports.createRequest = (req, res) => {
  const { propertyId, tenantId, title, issueDescription, category, priority } = req.body;

  if (!title || !issueDescription) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const property = store.properties.find(p => p.id === propertyId) || store.properties[0];
  const tenant = store.users.find(u => u.id === tenantId) || store.users[0];

  const requestNum = store.maintenanceRequests.length + 1;
  const newReq = {
    id: `req-${Date.now()}`,
    requestId: `MR-2026-${String(requestNum).padStart(3, '0')}`,
    propertyId: property.id,
    propertyName: property.name,
    unitNumber: tenant.unitNumber || 'Apt 1A',
    tenantId: tenant.id,
    tenantName: tenant.name,
    title,
    issueDescription,
    category: category || 'General Maintenance',
    priority: priority || 'Medium',
    status: 'Pending',
    assignedStaff: 'Unassigned',
    createdDate: new Date().toISOString(),
    resolutionDate: null,
    statusLogs: [
      {
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: `Maintenance request created by ${tenant.name}`
      }
    ]
  };

  store.maintenanceRequests.unshift(newReq);

  // Emit Socket Event for Real-Time dashboard update
  const io = req.app.get('io');
  if (io) {
    io.emit('maintenance:created', newReq);
    io.emit('activity:logged', {
      type: 'maintenance',
      message: `New Ticket: ${newReq.title} (${newReq.priority} Priority) - ${newReq.unitNumber}`,
      timestamp: new Date().toISOString()
    });
  }

  res.status(201).json({
    success: true,
    request: newReq,
    message: 'Maintenance request created successfully!'
  });
};

exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status, assignedStaff, note } = req.body;

  const reqIndex = store.maintenanceRequests.findIndex(r => r.id === id);
  if (reqIndex === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const currentReq = store.maintenanceRequests[reqIndex];
  const previousStatus = currentReq.status;
  
  currentReq.status = status || currentReq.status;
  if (assignedStaff) {
    currentReq.assignedStaff = assignedStaff;
  }

  const now = new Date().toISOString();
  if (status === 'Completed' && !currentReq.resolutionDate) {
    currentReq.resolutionDate = now;
  }

  currentReq.statusLogs.push({
    status: currentReq.status,
    timestamp: now,
    note: note || `Status updated from ${previousStatus} to ${currentReq.status}`
  });

  store.maintenanceRequests[reqIndex] = currentReq;

  // Emit real-time notification
  const io = req.app.get('io');
  if (io) {
    io.emit('maintenance:updated', currentReq);
    io.emit('activity:logged', {
      type: 'maintenance',
      message: `Ticket ${currentReq.requestId} status updated to [${currentReq.status}]`,
      timestamp: now
    });
  }

  res.json({
    success: true,
    request: currentReq,
    message: `Status updated to ${currentReq.status}`
  });
};

exports.getKpiMetrics = (req, res) => {
  const allRequests = store.maintenanceRequests;
  const completed = allRequests.filter(r => r.status === 'Completed');
  const pending = allRequests.filter(r => r.status === 'Pending');
  const inProgress = allRequests.filter(r => r.status === 'In Progress');

  // Calculate resolution times for completed tickets
  let totalResolutionHours = 0;
  let validCompletedCount = 0;

  completed.forEach(r => {
    const hours = calculateResolutionTime(r.createdDate, r.resolutionDate);
    if (hours !== null) {
      totalResolutionHours += hours;
      validCompletedCount++;
    }
  });

  const avgResolutionTimeHours = validCompletedCount > 0 
    ? Math.round((totalResolutionHours / validCompletedCount) * 10) / 10 
    : 18.5; // default realistic benchmark

  const totalCount = allRequests.length;
  const completionRate = totalCount > 0 
    ? Math.round((completed.length / totalCount) * 100) 
    : 100;

  res.json({
    success: true,
    kpis: {
      avgResolutionTimeHours,
      targetResolutionTimeHours: 48,
      resolutionTimeStatus: avgResolutionTimeHours <= 48 ? 'Optimal (<= 48h)' : 'Exceeded',
      completionRate,
      targetCompletionRate: 90,
      completionRateStatus: completionRate >= 90 ? 'Target Met (>= 90%)' : 'Needs Attention',
      totalRequests: totalCount,
      pendingCount: pending.length,
      inProgressCount: inProgress.length,
      completedCount: completed.length
    }
  });
};
