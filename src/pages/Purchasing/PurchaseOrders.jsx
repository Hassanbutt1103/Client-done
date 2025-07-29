import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const PurchaseOrders = () => {
  return (
    <UpdateSoon 
      title="Purchase Orders"
      description="Purchase order management and procurement workflow system. Create orders, track approvals, monitor deliveries, and manage procurement documentation."
      icon={FaFileInvoice}
      expectedDate="Update Soon"
      userType="Purchasing"
    />
  );
};

export default PurchaseOrders; 