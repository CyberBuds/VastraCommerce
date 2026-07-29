// app/product-recommendations/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProductRecommendations } from '@/features/marketing/hooks/useProductRecommendations';

// This would typically be a searchable select component
const ProductSelector = ({ onProductSelect }: { onProductSelect: (productId: string) => void }) => {
    return (
        <div>
            <label htmlFor="product-search">Search for a product</label>
            <input id="product-search" type="text" onChange={e => onProductSelect(e.target.value)} placeholder="Enter product ID"/>
        </div>
    )
}

const RecommendationsList = ({ productId }: { productId: string }) => {
    const { data: recommendations, isLoading, isError } = useGetProductRecommendations(productId);

    if(!productId) return <p>Select a product to see recommendations.</p>
    if(isLoading) return <p>Loading recommendations...</p>
    if(isError) return <p>Error loading recommendations.</p>

    return (
        <div className="mt-4">
            <h3 className="font-bold">Recommendations for product: {productId}</h3>
            <ul>
                {recommendations?.map(rec => (
                    <li key={rec.id}>
                        <p>Type: {rec.type}</p>
                        <p>Recommended: {rec.recommendedProductIds.join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}


const ProductRecommendationsPage = () => {
    const [selectedProductId, setSelectedProductId] = useState('');

    return (
        <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Product Recommendations</h1>
            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductSelector onProductSelect={setSelectedProductId} />
                    <RecommendationsList productId={selectedProductId} />
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductRecommendationsPage;
