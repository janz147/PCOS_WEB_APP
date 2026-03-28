import React, { useState } from 'react';
import NewsCard from '../../../components/ui/NewsCard';

const isExternalUrl = (url = '') => /^https?:\/\//i.test(url);

const NewsGrid = ({ articles = [] }) => {
  const [startIndex, setStartIndex] = useState(0);

  const VISIBLE_COUNT = 3;

  const total = articles.length;

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + VISIBLE_COUNT >= total ? 0 : prev + VISIBLE_COUNT
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev - VISIBLE_COUNT < 0
        ? Math.max(total - VISIBLE_COUNT, 0)
        : prev - VISIBLE_COUNT
    );
  };

  const visibleArticles = articles.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  return (
    <div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {visibleArticles.map((article) => (
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
            external={isExternalUrl(article?.articleUrl)}
          />
        ))}
      </div>

      {/* Controls */}
      {total > VISIBLE_COUNT && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-muted"
          >
            ← Prev
          </button>

          <span className="text-sm text-muted-foreground">
            {startIndex + 1}–{Math.min(startIndex + VISIBLE_COUNT, total)} of {total}
          </span>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-muted"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;