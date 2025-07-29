import React from 'react';
import { FaCogs } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Engineering = () => {
  return (
    <UpdateSoon 
      title="Engineering Dashboard"
      description="Engineering project oversight and technical management. Track project progress, monitor team performance, and coordinate engineering activities across departments."
      icon={FaCogs}
      expectedDate="Update Soon"
      userType="Manager"
    />
  );
};

export default Engineering; 