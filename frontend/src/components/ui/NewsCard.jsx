import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const NewsCard = ({ 
  title, 
  excerpt, 
  date, 
  imageUrl, 
  articleUrl,
  category = 'Health',
  readTime = '5 min read',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    if (articleUrl) {
      if (articleUrl?.startsWith('http')) {
        window.open(articleUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(articleUrl);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article 
      className={`
        card-base 
        transition-default 
        hover:shadow-coral-lg 
        hover:-translate-y-1
        overflow-hidden
        ${className}
      `}
    >
      {imageUrl && (
        <div className="relative -mx-8 -mt-8 mb-6 h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {category}
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground font-caption">
          <div className="flex items-center gap-1">
            <Icon name="Calendar" size={14} />
            <time dateTime={date}>{formatDate(date)}</time>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={14} />
            <span>{readTime}</span>
          </div>
        </div>
        
        <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        
        <Button
          variant="ghost"
          onClick={handleReadMore}
          iconName="ArrowRight"
          iconPosition="right"
          className="mt-2 px-0 hover:px-4"
        >
          Read Full Article
        </Button>
      </div>
    </article>
  );
};

export default NewsCard;