import React from 'react';
import { FaTruck } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const SupplierRelations = () => {
  return (
    <UpdateSoon 
      title="Supplier Relations"
      description="Supplier relationship management and vendor coordination platform. Manage supplier database, track performance, and optimize procurement partnerships."
      icon={FaTruck}
      expectedDate="Update Soon"
      userType="Purchasing"
    />
  );
};

export default SupplierRelations; 