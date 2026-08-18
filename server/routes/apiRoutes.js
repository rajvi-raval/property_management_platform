const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const propertyController = require('../controllers/propertyController');
const maintenanceController = require('../controllers/maintenanceController');
const amenityController = require('../controllers/amenityController');

// Auth & Users
router.post('/auth/login', authController.login);
router.post('/auth/switch-role', authController.switchRole);
router.get('/auth/users', authController.getUsers);

// Properties
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyById);

// Maintenance Requests
router.get('/maintenance', maintenanceController.getAllRequests);
router.post('/maintenance', maintenanceController.createRequest);
router.patch('/maintenance/:id/status', maintenanceController.updateStatus);
router.get('/maintenance/kpis', maintenanceController.getKpiMetrics);

// Amenities & Bookings
router.get('/amenities', amenityController.getAmenities);
router.get('/amenities/check-availability', amenityController.checkAvailability);
router.post('/amenities/book', amenityController.createBooking);
router.patch('/amenities/bookings/:id/cancel', amenityController.cancelBooking);
router.get('/amenities/bookings', amenityController.getBookings);
router.get('/amenities/kpis', amenityController.getAmenityKpis);

module.exports = router;
