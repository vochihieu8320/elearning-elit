import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Link href="/">
            <Button>
              Go to Home Page
            </Button>
          </Link>
          
          <Link href="/courses">
            <Button variant="outline">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}