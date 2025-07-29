import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Commercial = () => {
  return (
    <UpdateSoon 
      title="Commercial Dashboard"
      description="Commercial operations management and sales oversight. Monitor sales performance, track client relationships, and manage commercial strategies across your organization."
      icon={FaBuilding}
      expectedDate="Update Soon"
      userType="Manager"
    />
  );
};

export default Commercial; 