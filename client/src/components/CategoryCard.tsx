import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  BookOpen, Code, Briefcase, Brain, 
  Dumbbell, Palette, Music, Camera, 
  BarChartHorizontal, Globe, Heart, 
  Leaf, Coffee, Building
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
}

// Map of category icons
const categoryIcons = {
  "development": <Code className="h-6 w-6" />,
  "business": <Briefcase className="h-6 w-6" />,
  "academics": <BookOpen className="h-6 w-6" />,
  "health": <Heart className="h-6 w-6" />,
  "fitness": <Dumbbell className="h-6 w-6" />,
  "music": <Music className="h-6 w-6" />,
  "art": <Palette className="h-6 w-6" />,
  "photography": <Camera className="h-6 w-6" />,
  "marketing": <BarChartHorizontal className="h-6 w-6" />,
  "languages": <Globe className="h-6 w-6" />,
  "science": <Brain className="h-6 w-6" />,
  "lifestyle": <Coffee className="h-6 w-6" />,
  "architecture": <Building className="h-6 w-6" />,
  "environment": <Leaf className="h-6 w-6" />,
  // Add more mappings as needed
};

export default function CategoryCard({ name, slug, icon }: CategoryCardProps) {
  return (
    <Link href={`/courses/category/${slug}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="flex items-center p-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            {categoryIcons[icon as keyof typeof categoryIcons] || <BookOpen className="h-6 w-6 text-primary" />}
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">
              Explore courses
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}