import React from 'react';
import NewsCard from '../../../components/ui/NewsCard';

const NewsGrid = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {articles?.map((article) => (
        <NewsCard
          key={article?.id}
          title={article?.title}
          excerpt={article?.excerpt}
          date={article?.date}
          imageUrl={article?.imageUrl}
          imageAlt={article?.imageAlt}
          articleUrl={article?.articleUrl}
          category={article?.category}
          readTime={article?.readTime}
        />
      ))}
    </div>
  );
};

export default NewsGrid;