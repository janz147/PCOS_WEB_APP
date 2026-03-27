import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../../components/ui/DashboardCard';

const ResourceGrid = ({ resources }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {resources?.map((resource) => {
        const card = (
          <DashboardCard
            icon={resource?.icon}
            title={resource?.title}
            description={resource?.description}
            buttonText={resource?.buttonText}
            route={resource?.route}
            isHighlighted={resource?.isHighlighted}
            onClick={resource?.onClick || (() => {})}
          />
        );

        if (resource?.external) {
          return (
            <a
              key={resource?.id}
              href={resource?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {card}
            </a>
          );
        }

        return (
          <Link key={resource?.id} to={resource?.route || '/' } className="block">
            {card}
          </Link>
        );
      })}
    </div>
  );
};

export default ResourceGrid;