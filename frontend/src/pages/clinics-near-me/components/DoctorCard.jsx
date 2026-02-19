import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DoctorCard = ({ doctor, className = '' }) => {
  const handleViewProfile = () => {
    console.log('Viewing profile for:', doctor?.name);
  };

  return (
    <div className={cn(
      'card-base hover:shadow-coral-lg transition-default',
      className
    )}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Doctor Photo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-muted">
            <img
              src={doctor?.photo}
              alt={`${doctor?.name} - ${doctor?.specialization}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop';
              }}
            />
          </div>
        </div>

        {/* Doctor Information */}
        <div className="flex-1 space-y-4">
          {/* Name and Experience */}
          <div>
            <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-1">
              {doctor?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {doctor?.experience}
            </p>
          </div>

          {/* Specialization */}
          <div>
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              {doctor?.specialization}
            </p>
          </div>

          {/* Consultation Types */}
          <div className="flex flex-wrap gap-2">
            {doctor?.consultationTypes?.map((type, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs md:text-sm font-medium"
              >
                <Icon
                  name={type === 'Online Consultation' ? 'Video' : 'MapPin'}
                  size={14}
                />
                {type}
              </span>
            ))}
          </div>

          {/* Clinic Location */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Building2" size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {doctor?.clinicName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {doctor?.clinicAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule and Action Section */}
        <div className="flex-shrink-0 md:w-64 space-y-4">
          {/* Schedule Card */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-2 mb-3">
              <Icon name="Calendar" size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Earliest Available Schedule
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {doctor?.schedule}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Consultation Fee:</p>
              <p className="text-lg font-bold text-primary">
                {doctor?.fee}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="default"
            fullWidth
            onClick={handleViewProfile}
            className="shadow-coral-md hover:shadow-coral-lg"
          >
            VIEW PROFILE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;