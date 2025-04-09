import React from "react";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  avatarUrl: string;
  name: string;
  role: string;
  rating: number;
}

export default function TestimonialCard({ content, avatarUrl, name, role, rating }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex text-amber-500 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} />
        ))}
      </div>
      <p className="text-gray-700 mb-6">{content}</p>
      <div className="flex items-center">
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-10 h-10 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
}
