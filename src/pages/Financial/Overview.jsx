import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Overview = () => {
  return (
    <UpdateSoon 
      title="Financial Overview"
      description="Comprehensive financial dashboard with key metrics, revenue analytics, and financial health indicators. Monitor cash flow, profitability, and financial performance."
      icon={FaMoneyBillWave}
      expectedDate="Update Soon"
      userType="Financial"
    />
  );
};

export default Overview; 