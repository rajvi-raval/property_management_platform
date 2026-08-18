const fs = require('fs');
const path = require('path');

// In-Memory Database Store with initial seed dataset
class DBStore {
  constructor() {
    this.users = [];
    this.properties = [];
    this.maintenanceRequests = [];
    this.amenities = [];
    this.amenityBookings = [];
    this.logs = [];

    this.initSeedData();
  }

  initSeedData() {
    const now = new Date();
    
    // Seed Users
    this.users = [
      {
        id: 'u-101',
        name: 'Sarah Jenkins',
        email: 'sarah.tenant@rentals.com',
        role: 'tenant',
        propertyId: 'p-101',
        unitNumber: 'Apt 4B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        phone: '+1 (555) 234-5678'
      },
      {
        id: 'u-102',
        name: 'Marcus Vance',
        email: 'marcus.owner@rentals.com',
        role: 'manager',
        propertyId: 'p-101',
        unitNumber: 'Manager Suite',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+1 (555) 876-5432'
      },
      {
        id: 'u-103',
        name: 'David Chen (Facilities Staff)',
        email: 'david.tech@rentals.com',
        role: 'staff',
        propertyId: 'p-101',
        unitNumber: 'Maintenance Bay',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '+1 (555) 345-6789'
      },
      {
        id: 'u-104',
        name: 'Elena Rostova',
        email: 'elena.tenant@rentals.com',
        role: 'tenant',
        propertyId: 'p-102',
        unitNumber: 'Penthouse 12',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+1 (555) 901-2345'
      }
    ];

    // Seed Properties
    this.properties = [
      {
        id: 'p-101',
        name: 'Grand Vista Heights',
        address: '742 Evergreen Terrace, North Heights',
        totalUnits: 48,
        occupiedUnits: 44,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        description: 'Modern luxury residential complex with rooftop gardens, smart facilities, and 24/7 security.',
        managerName: 'Marcus Vance',
        amenityIds: ['a-1', 'a-2', 'a-3', 'a-4']
      },
      {
        id: 'p-102',
        name: 'Sunset Park Residences',
        address: '128 Ocean Avenue, Westside',
        totalUnits: 32,
        occupiedUnits: 30,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
        description: 'Boutique waterfront property featuring private clubhouse, infinity pool, and concierge service.',
        managerName: 'Marcus Vance',
        amenityIds: ['a-5', 'a-6']
      }
    ];

    // Seed Amenities
    this.amenities = [
      {
        id: 'a-1',
        propertyId: 'p-101',
        name: 'Rooftop Heated Pool',
        category: 'Recreation',
        description: 'Panoramic skyline view heated swimming pool with lounge chairs and towel service.',
        openingTime: '06:00',
        closingTime: '22:00',
        maxCapacity: 25,
        availabilityStatus: 'Available',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
        rules: 'Max 2 hours per booking slot. Children under 12 require adult supervision.'
      },
      {
        id: 'a-2',
        propertyId: 'p-101',
        name: 'Sky Lounge & Grill Zone',
        category: 'Social',
        description: 'Outdoor BBQ grill stations, lounge seating, and private party pavilion.',
        openingTime: '10:00',
        closingTime: '23:00',
        maxCapacity: 15,
        availabilityStatus: 'Available',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
        rules: 'Clean grill after use. Music must end by 22:00.'
      },
      {
        id: 'a-3',
        propertyId: 'p-101',
        name: 'Co-Working & Executive Hub',
        category: 'Business',
        description: 'High-speed fiber internet, soundproof phone booths, and private conference room.',
        openingTime: '07:00',
        closingTime: '22:00',
        maxCapacity: 12,
        availabilityStatus: 'Available',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
        rules: 'Keep noise levels low in common desk areas. Conference room requires booking.'
      },
      {
        id: 'a-4',
        propertyId: 'p-101',
        name: 'High-Performance Gym & Sauna',
        category: 'Fitness',
        description: 'Fully equipped fitness center with free weights, cardio equipment, and dry sauna.',
        openingTime: '05:00',
        closingTime: '23:00',
        maxCapacity: 20,
        availabilityStatus: 'Available',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
        rules: 'Wipe down equipment after use. Proper athletic attire required.'
      },
      {
        id: 'a-5',
        propertyId: 'p-102',
        name: 'Private Screening Cinema Room',
        category: 'Entertainment',
        description: '12-seat luxury cinema room with 4K projector and surround sound.',
        openingTime: '12:00',
        closingTime: '24:00',
        maxCapacity: 12,
        availabilityStatus: 'Available',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
        rules: 'No outside food or drinks. Clean seating area before check-out.'
      },
      {
        id: 'a-6',
        propertyId: 'p-102',
        name: 'Tennis & Pickleball Court',
        category: 'Sports',
        description: 'Outdoor lighted tennis court suitable for tennis and pickleball matches.',
        openingTime: '07:00',
        closingTime: '21:00',
        maxCapacity: 4,
        availabilityStatus: 'Available',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop&q=80',
        rules: 'Non-marking court shoes mandatory. Max 90 minutes per session.'
      }
    ];

    // Seed Maintenance Requests
    const date1 = new Date(Date.now() - 36 * 3600 * 1000).toISOString();
    const date2 = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
    const date3 = new Date(Date.now() - 2 * 3600 * 1000).toISOString();

    this.maintenanceRequests = [
      {
        id: 'req-101',
        requestId: 'MR-2026-001',
        propertyId: 'p-101',
        propertyName: 'Grand Vista Heights',
        unitNumber: 'Apt 4B',
        tenantId: 'u-101',
        tenantName: 'Sarah Jenkins',
        title: 'Master Bathroom Sink Leak',
        issueDescription: 'Water leaking steadily from under sink pipe connection into cabinet base.',
        category: 'Plumbing',
        priority: 'High',
        status: 'In Progress',
        assignedStaff: 'David Chen (Facilities Staff)',
        createdDate: date1,
        resolutionDate: null,
        statusLogs: [
          { status: 'Pending', timestamp: date1, note: 'Request submitted by tenant' },
          { status: 'In Progress', timestamp: date2, note: 'Assigned to David Chen. Replacement pipe ordered.' }
        ]
      },
      {
        id: 'req-102',
        requestId: 'MR-2026-002',
        propertyId: 'p-101',
        propertyName: 'Grand Vista Heights',
        unitNumber: 'Apt 2A',
        tenantId: 'u-104',
        tenantName: 'Elena Rostova',
        title: 'HVAC Air Conditioner Fan Noise',
        issueDescription: 'Living room AC unit emitting high-pitched buzzing sound when running on cooling mode.',
        category: 'HVAC / Climate',
        priority: 'Medium',
        status: 'Pending',
        assignedStaff: 'Unassigned',
        createdDate: date2,
        resolutionDate: null,
        statusLogs: [
          { status: 'Pending', timestamp: date2, note: 'Request created. Awaiting dispatch.' }
        ]
      },
      {
        id: 'req-103',
        requestId: 'MR-2026-003',
        propertyId: 'p-101',
        propertyName: 'Grand Vista Heights',
        unitNumber: 'Apt 4B',
        tenantId: 'u-101',
        tenantName: 'Sarah Jenkins',
        title: 'Balcony Door Latch Stuck',
        issueDescription: 'Sliding balcony glass door lock latch won\'t align properly with strike plate.',
        category: 'Carpentry & Doors',
        priority: 'Low',
        status: 'Completed',
        assignedStaff: 'David Chen (Facilities Staff)',
        createdDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        resolutionDate: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
        statusLogs: [
          { status: 'Pending', timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), note: 'Submitted' },
          { status: 'In Progress', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), note: 'Technician inspecting door frame' },
          { status: 'Completed', timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(), note: 'Adjusted hinges and lubricated lock mechanism' }
        ]
      }
    ];

    // Seed Amenity Bookings
    const todayStr = new Date().toISOString().split('T')[0];
    this.amenityBookings = [
      {
        id: 'b-101',
        bookingId: 'BK-8801',
        amenityId: 'a-1',
        amenityName: 'Rooftop Heated Pool',
        propertyId: 'p-101',
        userId: 'u-101',
        userName: 'Sarah Jenkins',
        unitNumber: 'Apt 4B',
        bookingDate: todayStr,
        checkInTime: '16:00',
        checkOutTime: '18:00',
        guestsCount: 2,
        status: 'Confirmed',
        createdDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      },
      {
        id: 'b-102',
        bookingId: 'BK-8802',
        amenityId: 'a-3',
        amenityName: 'Co-Working & Executive Hub',
        propertyId: 'p-101',
        userId: 'u-104',
        userName: 'Elena Rostova',
        unitNumber: 'Penthouse 12',
        bookingDate: todayStr,
        checkInTime: '09:00',
        checkOutTime: '12:00',
        guestsCount: 1,
        status: 'Confirmed',
        createdDate: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      }
    ];
  }
}

const store = new DBStore();
module.exports = store;
