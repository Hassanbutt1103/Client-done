import React from 'react';
import { FaTools } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const EquipmentStatus = () => {
  return (
    <UpdateSoon 
      title="Equipment Status"
      description="Engineering equipment monitoring and maintenance system. Track equipment health, schedule maintenance, and optimize equipment utilization."
      icon={FaTools}
      expectedDate="Update Soon"
      userType="Engineering"
    />
  );
};

export default EquipmentStatus; 