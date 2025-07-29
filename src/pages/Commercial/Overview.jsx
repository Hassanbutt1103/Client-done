import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Overview = () => {
  return (
    <UpdateSoon 
      title="Commercial Overview"
      description="Commercial operations dashboard with sales metrics, client insights, and business development analytics. Track revenue, manage accounts, and drive commercial growth."
      icon={FaBuilding}
      expectedDate="Update Soon"
      userType="Commercial"
    />
  );
};

export default Overview; 