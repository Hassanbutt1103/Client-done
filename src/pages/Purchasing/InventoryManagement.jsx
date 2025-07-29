import React from 'react';
import { FaBoxes } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const InventoryManagement = () => {
  return (
    <UpdateSoon 
      title="Inventory Management"
      description="Comprehensive inventory tracking and management system. Monitor stock levels, track movements, manage warehouses, and optimize inventory turnover."
      icon={FaBoxes}
      expectedDate="Update Soon"
      userType="Purchasing"
    />
  );
};

export default InventoryManagement; 