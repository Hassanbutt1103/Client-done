import React from 'react';
import { FaCalculator } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const BudgetPlanning = () => {
  return (
    <UpdateSoon 
      title="Budget Planning"
      description="Strategic budget planning and financial forecasting tools. Create budgets, track spending, analyze variances, and optimize financial resource allocation."
      icon={FaCalculator}
      expectedDate="Update Soon"
      userType="Financial"
    />
  );
};

export default BudgetPlanning; 