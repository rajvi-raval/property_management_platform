const store = require('../dbStore');

exports.getProperties = (req, res) => {
  const propertiesWithDetails = store.properties.map(prop => {
    const amenities = store.amenities.filter(a => a.propertyId === prop.id);
    const activeRequests = store.maintenanceRequests.filter(
      r => r.propertyId === prop.id && r.status !== 'Completed'
    );
    return {
      ...prop,
      amenitiesCount: amenities.length,
      activeMaintenanceCount: activeRequests.length
    };
  });

  res.json({
    success: true,
    properties: propertiesWithDetails
  });
};

exports.getPropertyById = (req, res) => {
  const { id } = req.params;
  const property = store.properties.find(p => p.id === id);

  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const propertyAmenities = store.amenities.filter(a => a.propertyId === id);
  const propertyRequests = store.maintenanceRequests.filter(r => r.propertyId === id);

  res.json({
    success: true,
    property: {
      ...property,
      amenities: propertyAmenities,
      maintenanceRequests: propertyRequests
    }
  });
};
