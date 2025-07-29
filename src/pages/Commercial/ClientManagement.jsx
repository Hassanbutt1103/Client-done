import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const ClientManagement = () => {
  return (
    <UpdateSoon 
      title="Client Management"
      description="Comprehensive client relationship management system. Manage client accounts, track interactions, monitor satisfaction, and foster long-term relationships."
      icon={FaUserTie}
      expectedDate="Update Soon"
      userType="Commercial"
    />
  );
};

export default ClientManagement; 