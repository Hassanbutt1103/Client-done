import React from 'react';
import { FaCog } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const SystemSettings = () => {
  return (
    <UpdateSoon 
      title="System Settings"
      description="Configure system-wide settings and preferences. Manage application behavior, security settings, integrations, and customize the platform to meet your organization's needs."
      icon={FaCog}
      expectedDate="Update Soon"
      userType="Admin"
    />
  );
};

export default SystemSettings; 