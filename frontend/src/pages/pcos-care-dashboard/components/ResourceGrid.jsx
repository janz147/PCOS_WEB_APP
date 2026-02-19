import React from 'react';
import DashboardCard from '../../../components/ui/DashboardCard';

const ResourceGrid = ({ resources }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {resources?.map((resource) => (
        <DashboardCard
          key={resource?.id}
          icon={resource?.icon}
          title={resource?.title}
          description={resource?.description}
          buttonText={resource?.buttonText}
          route={resource?.route}
          isHighlighted={resource?.isHighlighted}
          onClick={resource?.onClick || (() => {})}
        />
      ))}
    </div>
  );
};

export default ResourceGrid;