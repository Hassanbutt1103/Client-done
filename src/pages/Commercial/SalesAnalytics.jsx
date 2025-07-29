import React from 'react';
import { FaChartBar } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const SalesAnalytics = () => {
  return (
    <UpdateSoon 
      title="Sales Analytics"
      description="Advanced sales analytics and performance tracking. Analyze sales trends, monitor targets, track conversion rates, and optimize sales strategies."
      icon={FaChartBar}
      expectedDate="Update Soon"
      userType="Commercial"
    />
  );
};

export default SalesAnalytics; 