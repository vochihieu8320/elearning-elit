import React from "react";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, size = 16, className = "" }: StarRatingProps) {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={`flex ${className}`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star 
          key={`star-full-${i}`} 
          className="text-amber-500 fill-amber-500" 
          size={size} 
        />
      ))}
      
      {/* Half star if needed */}
      {hasHalfStar && (
        <StarHalf 
          key="star-half" 
          className="text-amber-500 fill-amber-500" 
          size={size} 
        />
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star 
          key={`star-empty-${i}`} 
          className="text-amber-500" 
          size={size} 
        />
      ))}
    </div>
  );
}
