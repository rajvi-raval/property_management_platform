import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, socket } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'u-101',
    name: 'Sarah Jenkins',
    email: 'sarah.tenant@rentals.com',
    role: 'tenant',
    unitNumber: 'Apt 4B',
    propertyId: 'p-101',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  });

  const [properties, setProperties] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [maintenanceKpis, setMaintenanceKpis] = useState({
    avgResolutionTimeHours: 18.5,
    completionRate: 92,
    totalRequests: 3,
    pendingCount: 1,
    inProgressCount: 1,
    completedCount: 1
  });
  const [amenityKpis, setAmenityKpis] = useState({
    totalBookings: 2,
    activeConfirmedBookings: 2,
    bookingConflicts: 0,
    systemResponseTimeSec: 0.12,
    amenitySatisfactionScore: 4.9
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [propsRes, mainRes, amenRes, bookRes, mKpiRes, aKpiRes] = await Promise.all([
        api.getProperties(),
        api.getMaintenanceRequests(),
        api.getAmenities(),
        api.getAmenityBookings(),
        api.getMaintenanceKpis(),
        api.getAmenityKpis()
      ]);

      if (propsRes.success) setProperties(propsRes.properties);
      if (mainRes.success) setMaintenanceRequests(mainRes.requests);
      if (amenRes.success) setAmenities(amenRes.amenities);
      if (bookRes.success) setBookings(bookRes.bookings);
      if (mKpiRes.success) setMaintenanceKpis(mKpiRes.kpis);
      if (aKpiRes.success) setAmenityKpis(aKpiRes.kpis);

    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Socket.io Real-Time Event Subscriptions
    socket.on('connect', () => {
      console.log('⚡ Socket connected to server');
    });

    socket.on('maintenance:created', (newReq) => {
      setMaintenanceRequests(prev => [newReq, ...prev.filter(r => r.id !== newReq.id)]);
      showToast(`⚡ Real-Time Update: New ticket "${newReq.title}" submitted`, 'info');
      api.getMaintenanceKpis().then(res => res.success && setMaintenanceKpis(res.kpis));
    });

    socket.on('maintenance:updated', (updatedReq) => {
      setMaintenanceRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
      showToast(`⚡ Ticket ${updatedReq.requestId} status changed to ${updatedReq.status}`, 'success');
      api.getMaintenanceKpis().then(res => res.success && setMaintenanceKpis(res.kpis));
    });

    socket.on('amenity:booked', (newBooking) => {
      setBookings(prev => [newBooking, ...prev]);
      showToast(`⚡ Real-Time Booking: ${newBooking.amenityName} reserved by ${newBooking.userName}`, 'success');
      api.getAmenityKpis().then(res => res.success && setAmenityKpis(res.kpis));
    });

    socket.on('amenity:cancelled', (cancelledBooking) => {
      setBookings(prev => prev.map(b => b.id === cancelledBooking.id ? cancelledBooking : b));
      showToast(`⚡ Booking ${cancelledBooking.bookingId} was cancelled`, 'warning');
    });

    socket.on('activity:logged', (log) => {
      setActivityLogs(prev => [log, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.off('maintenance:created');
      socket.off('maintenance:updated');
      socket.off('amenity:booked');
      socket.off('amenity:cancelled');
      socket.off('activity:logged');
    };
  }, []);

  const switchRole = async (newRole) => {
    try {
      const res = await api.switchRole(newRole);
      if (res.success) {
        setUser(res.user);
        showToast(`Switched view mode to: ${newRole.toUpperCase()}`, 'success');
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      properties,
      maintenanceRequests,
      amenities,
      bookings,
      activityLogs,
      maintenanceKpis,
      amenityKpis,
      isLoading,
      notification,
      showToast,
      switchRole,
      refreshData: loadData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
