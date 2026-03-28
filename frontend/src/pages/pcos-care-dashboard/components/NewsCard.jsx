import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({
  title,
  excerpt,
  date,
  imageUrl,
  imageAlt,
  articleUrl,
  category,
  readTime,
  external = false,
}) => {
  const content = (
    <article className="card-base overflow-hidden h-full transition-transform duration-200 hover:-translate-y-1">
      {imageUrl ? (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={imageAlt || title || 'News article'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {category || 'News'}
          </span>
          {date ? <span className="text-xs text-muted-foreground">{date}</span> : null}
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title || 'Untitled article'}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
          {excerpt || 'Read more about this update.'}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-primary">
            {readTime || 'Read more'}
          </span>
          <span className="text-sm text-muted-foreground">
            {external ? 'Open article ↗' : 'Open article →'}
          </span>
        </div>
      </div>
    </article>
  );

  if (external) {
    return (
      <a
        href={articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={articleUrl || '#'} className="block h-full">
      {content}
    </Link>
  );
};

export default NewsCard;