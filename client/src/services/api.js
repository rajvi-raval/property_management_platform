import { io } from 'socket.io-client';

const API_BASE = '/api';

// Initialize Socket.io client
export const socket = io(window.location.origin, {
  autoConnect: true,
  reconnectionAttempts: 5,
  timeout: 10000
});

// Helper for HTTP fetch requests
async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Request failed');
  }
  return data;
}

export const api = {
  // Auth
  login: (email, role) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, role }) }),
  switchRole: (role) => request('/auth/switch-role', { method: 'POST', body: JSON.stringify({ role }) }),
  getUsers: () => request('/auth/users'),

  // Properties
  getProperties: () => request('/properties'),
  getPropertyById: (id) => request(`/properties/${id}`),

  // Maintenance
  getMaintenanceRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/maintenance?${query}`);
  },
  createMaintenanceRequest: (data) => request('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateMaintenanceStatus: (id, data) => request(`/maintenance/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  getMaintenanceKpis: () => request('/maintenance/kpis'),

  // Amenities
  getAmenities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/amenities?${query}`);
  },
  checkAmenityAvailability: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/amenities/check-availability?${query}`);
  },
  bookAmenity: (data) => request('/amenities/book', { method: 'POST', body: JSON.stringify(data) }),
  cancelAmenityBooking: (id) => request(`/amenities/bookings/${id}/cancel`, { method: 'PATCH' }),
  getAmenityBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/amenities/bookings?${query}`);
  },
  getAmenityKpis: () => request('/amenities/kpis')
};
