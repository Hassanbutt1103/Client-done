import React from 'react';
import { FaProjectDiagram } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const ProjectManagement = () => {
  return (
    <UpdateSoon 
      title="Project Management"
      description="Engineering project planning and execution platform. Manage project timelines, track deliverables, coordinate teams, and ensure project success."
      icon={FaProjectDiagram}
      expectedDate="Update Soon"
      userType="Engineering"
    />
  );
};

export default ProjectManagement; 