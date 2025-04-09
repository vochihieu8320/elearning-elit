import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BookOpen, Users, DollarSign, Globe 
} from "lucide-react";

export default function BecomeInstructorSection() {
  return (
    <div className="py-16 bg-muted">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Become an instructor and change lives — including your own
            </h2>
            <p className="text-muted-foreground">
              Join thousands of instructors who share their knowledge and skills with millions of students worldwide. 
              Build your teaching portfolio and earn income while making a positive impact.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                  disabled
                >
                  <BookOpen className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-medium">Share your expertise</h3>
                  <p className="text-sm text-muted-foreground">
                    Create comprehensive courses using our simple course builder and showcase your unique teaching methods.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                  disabled
                >
                  <Users className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-medium">Inspire students</h3>
                  <p className="text-sm text-muted-foreground">
                    Help people learn new skills, advance their careers, and explore their hobbies and passions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                  disabled
                >
                  <DollarSign className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-medium">Get rewarded</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn income from course sales and build your reputation as an expert in your field.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                  disabled
                >
                  <Globe className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-medium">Reach a global audience</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with millions of students around the world who are eager to learn from your experience.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Link href="/become-instructor">
                <Button size="lg" className="mt-2">
                  Start Teaching Today
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden h-full min-h-[400px] bg-gradient-to-br from-primary/5 to-primary/30 flex items-center justify-center">
            <div className="text-center p-6 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">Instructor Success</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">10,000+</div>
                  <div className="text-sm text-muted-foreground">Active Instructors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">$50M+</div>
                  <div className="text-sm text-muted-foreground">Instructor Earnings</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">100+</div>
                  <div className="text-sm text-muted-foreground">Countries Reached</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}