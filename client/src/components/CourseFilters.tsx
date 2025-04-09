import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Category } from "@shared/schema";
import { Check, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CourseFiltersProps {
  categories: Category[];
  filters: {
    category: string;
    priceRange: string;
    level: string;
    rating: number;
  };
  onFilterChange: (filters: any) => void;
}

export default function CourseFilters({ categories, filters, onFilterChange }: CourseFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleCategoryChange = (value: string) => {
    const newFilters = { ...localFilters, category: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: string) => {
    const newFilters = { ...localFilters, priceRange: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLevelChange = (value: string) => {
    const newFilters = { ...localFilters, level: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...localFilters, rating: value[0] };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Desktop filters
  const DesktopFilters = () => (
    <div className="hidden md:block">
      <Card>
        <CardHeader>
          <CardTitle>Filter Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Category</h3>
            <RadioGroup 
              value={localFilters.category} 
              onValueChange={handleCategoryChange}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-categories" />
                <Label htmlFor="all-categories" className="cursor-pointer">All Categories</Label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.slug} id={`category-${category.id}`} />
                  <Label htmlFor={`category-${category.id}`} className="cursor-pointer">{category.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Price</h3>
            <RadioGroup 
              value={localFilters.priceRange} 
              onValueChange={handlePriceChange}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-prices" />
                <Label htmlFor="all-prices" className="cursor-pointer">All Prices</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free" className="cursor-pointer">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="discounted" id="discounted" />
                <Label htmlFor="discounted" className="cursor-pointer">Discounted</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Level Filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Level</h3>
            <RadioGroup 
              value={localFilters.level} 
              onValueChange={handleLevelChange}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-levels" />
                <Label htmlFor="all-levels" className="cursor-pointer">All Levels</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="cursor-pointer">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="cursor-pointer">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="cursor-pointer">Advanced</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <h3 className="font-medium">Rating</h3>
              <span className="text-sm">{localFilters.rating}+ stars</span>
            </div>
            <Slider
              value={[localFilters.rating]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={handleRatingChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Mobile filters (using sheet)
  const MobileFilters = () => (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80%]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 p-4 overflow-auto h-full">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="font-medium">Category</h3>
              <RadioGroup 
                value={localFilters.category} 
                onValueChange={handleCategoryChange}
                className="space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="mobile-all-categories" />
                  <Label htmlFor="mobile-all-categories" className="cursor-pointer">All Categories</Label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.slug} id={`mobile-category-${category.id}`} />
                    <Label htmlFor={`mobile-category-${category.id}`} className="cursor-pointer">{category.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <h3 className="font-medium">Price</h3>
              <RadioGroup 
                value={localFilters.priceRange} 
                onValueChange={handlePriceChange}
                className="space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="mobile-all-prices" />
                  <Label htmlFor="mobile-all-prices" className="cursor-pointer">All Prices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="mobile-free" />
                  <Label htmlFor="mobile-free" className="cursor-pointer">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="mobile-paid" />
                  <Label htmlFor="mobile-paid" className="cursor-pointer">Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="discounted" id="mobile-discounted" />
                  <Label htmlFor="mobile-discounted" className="cursor-pointer">Discounted</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Level Filter */}
            <div className="space-y-3">
              <h3 className="font-medium">Level</h3>
              <RadioGroup 
                value={localFilters.level} 
                onValueChange={handleLevelChange}
                className="space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="mobile-all-levels" />
                  <Label htmlFor="mobile-all-levels" className="cursor-pointer">All Levels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="mobile-beginner" />
                  <Label htmlFor="mobile-beginner" className="cursor-pointer">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="mobile-intermediate" />
                  <Label htmlFor="mobile-intermediate" className="cursor-pointer">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="mobile-advanced" />
                  <Label htmlFor="mobile-advanced" className="cursor-pointer">Advanced</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium">Rating</h3>
                <span className="text-sm">{localFilters.rating}+ stars</span>
              </div>
              <Slider
                value={[localFilters.rating]}
                min={0}
                max={5}
                step={0.5}
                onValueChange={handleRatingChange}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      <DesktopFilters />
      <MobileFilters />
    </>
  );
}