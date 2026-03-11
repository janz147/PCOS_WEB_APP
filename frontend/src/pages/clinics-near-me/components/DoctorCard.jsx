import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DoctorCard = ({ clinic, className = '' }) => {
  const handleViewOnMap = () => {
    const { lat, lng } = clinic?.location || {};
    if (lat && lng) {
      window.open(
        `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`,
        '_blank'
      );
    }
  };

  const handleCallPhone = () => {
    if (clinic?.phone) {
      window.location.href = `tel:${clinic?.phone}`;
    }
  };

  const handleVisitWebsite = () => {
    if (clinic?.website) {
      window.open(clinic?.website, '_blank');
    }
  };

  return (
    <div className={cn(
      'card-base hover:shadow-coral-lg transition-default',
      className
    )}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Clinic Icon */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center">
            <Icon name="Building2" size={48} className="text-primary" />
          </div>
        </div>

        {/* Clinic Information */}
        <div className="flex-1 space-y-4">
          {/* Name */}
          <div>
            <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-1">
              {clinic?.name || 'Unknown Clinic'}
            </h3>
            {clinic?.tags?.healthcare && (
              <p className="text-sm text-muted-foreground capitalize">
                {clinic?.tags?.healthcare?.replace('_', ' ')}
              </p>
            )}
          </div>

          {/* Address */}
          {clinic?.address && (
            <div className="flex items-start gap-2">
              <Icon name="MapPin" size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                {clinic?.address}
              </p>
            </div>
          )}

          {/* Phone */}
          {clinic?.phone && (
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={18} className="text-muted-foreground flex-shrink-0" />
              <a
                href={`tel:${clinic?.phone}`}
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e?.preventDefault();
                  handleCallPhone();
                }}
              >
                {clinic?.phone}
              </a>
            </div>
          )}

          {/* Website */}
          {clinic?.website && (
            <div className="flex items-center gap-2">
              <Icon name="Globe" size={18} className="text-muted-foreground flex-shrink-0" />
              <a
                href={clinic?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate"
                onClick={(e) => {
                  e?.preventDefault();
                  handleVisitWebsite();
                }}
              >
                Visit Website
              </a>
            </div>
          )}

          {/* Opening Hours */}
          {clinic?.opening_hours && (
            <div className="flex items-start gap-2">
              <Icon name="Clock" size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Opening Hours</p>
                <p className="text-sm text-foreground">
                  {clinic?.opening_hours}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {clinic?.tags?.amenity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs md:text-sm font-medium capitalize">
                {clinic?.tags?.amenity?.replace('_', ' ')}
              </span>
            )}
            {clinic?.tags?.healthcare && clinic?.tags?.healthcare !== clinic?.tags?.amenity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs md:text-sm font-medium capitalize">
                {clinic?.tags?.healthcare?.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex-shrink-0 md:w-48 space-y-3">
          {/* View on Map Button */}
          <Button
            variant="default"
            fullWidth
            onClick={handleViewOnMap}
            className="shadow-coral-md hover:shadow-coral-lg"
          >
            <Icon name="Map" size={18} className="mr-2" />
            VIEW ON MAP
          </Button>

          {/* Additional Actions */}
          {clinic?.phone && (
            <Button
              variant="outline"
              fullWidth
              onClick={handleCallPhone}
            >
              <Icon name="Phone" size={18} className="mr-2" />
              CALL
            </Button>
          )}

          {clinic?.website && (
            <Button
              variant="outline"
              fullWidth
              onClick={handleVisitWebsite}
            >
              <Icon name="Globe" size={18} className="mr-2" />
              WEBSITE
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;