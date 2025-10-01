
import React, { useState, useCallback } from 'react';
import { fetchGoldMarketNews } from '../services/geminiService';
import type { NewsArticle } from '../types';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
);

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-brand-light p-4 rounded-lg hover:bg-brand-surface transition-colors duration-200"
    >
        <h3 className="font-semibold text-gold">{article.title}</h3>
        <p className="text-sm text-brand-text-secondary mt-1">{article.summary}</p>
        <p className="text-xs text-blue-400 mt-2 break-all">{article.url}</p>
    </a>
);


const News: React.FC = () => {
    const [analysis, setAnalysis] = useState<string>('');
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getNews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis('');
        setArticles([]);
        try {
            const result = await fetchGoldMarketNews();
            setAnalysis(result.analysis);
            setArticles(result.articles);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    return (
        <div className="p-4 text-brand-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Market News & AI Analysis</h1>

            <div className="mb-6">
                <button
                    onClick={getNews}
                    disabled={isLoading}
                    className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Fetching Analysis...' : 'Get Latest Market News'}
                </button>
            </div>

            {isLoading && <LoadingSpinner />}
            
            {error && (
                <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {analysis && (
                <div className="bg-brand-surface rounded-xl p-6 shadow-lg mb-6">
                    <h2 className="text-lg font-semibold text-gold mb-2">AI Market Analysis</h2>
                    <p className="text-brand-text whitespace-pre-wrap">{analysis}</p>
                </div>
            )}

            {articles.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gold mb-4">Related News Sources</h2>
                    <div className="space-y-4">
                        {articles.map((article, index) => (
                           <NewsCard key={index} article={article} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default News;