import React from 'react';
import { FaMoneyBill } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Financial = () => {
  return (
    <UpdateSoon 
      title="Financial Dashboard"
      description="Manager-level financial oversight and reporting. Monitor budgets, track expenses, analyze revenue trends, and make informed financial decisions for your departments."
      icon={FaMoneyBill}
      expectedDate="Update Soon"
      userType="Manager"
    />
  );
};

export default Financial; 