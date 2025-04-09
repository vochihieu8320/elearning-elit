import { Section as BaseSection, Lesson as BaseLesson } from "@shared/schema";

// Extended types with additional properties needed for UI
interface Lesson extends BaseLesson {
  type?: 'video' | 'quiz' | 'text';
  isPreview?: boolean;
  completed?: boolean;
}

interface Section extends BaseSection {
  lessons?: Lesson[];
  duration?: number;
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Lock, PlayCircle, FileText, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseContentProps {
  sections: Section[];
  isLoading: boolean;
  expandedSectionId: number | null;
  toggleSection: (sectionId: number) => void;
  isEnrolled: boolean;
}

export default function CourseContent({
  sections,
  isLoading,
  expandedSectionId,
  toggleSection,
  isEnrolled
}: CourseContentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="pl-6 space-y-2">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sections.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No content available for this course yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total hours and lessons
  const totalLessons = sections.reduce((sum, section) => sum + (section.lessons?.length || 0), 0);
  
  // Utility to format time
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return `${hours}h ${mins}min`;
  };

  const LessonIcon = ({ lesson }: { lesson: Lesson }) => {
    if (lesson.type === 'video') {
      return <PlayCircle className="h-4 w-4 mr-2 flex-shrink-0" />;
    } else if (lesson.type === 'quiz') {
      return <FileText className="h-4 w-4 mr-2 flex-shrink-0" />;
    } else {
      return <FileText className="h-4 w-4 mr-2 flex-shrink-0" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-medium">Course Content</h3>
          <div className="text-sm text-muted-foreground">
            {sections.length} sections • {totalLessons} lessons
          </div>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={expandedSectionId?.toString()}
          >
            {sections.map((section) => (
              <AccordionItem 
                key={section.id} 
                value={section.id.toString()}
                className="border px-4 rounded-md mb-3"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-start justify-between w-full text-left">
                    <div>
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.lessons?.length || 0} lessons • {formatDuration(section.duration || 0)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-2">
                    {section.lessons?.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className={`flex items-center py-2 px-3 rounded-md ${isEnrolled ? 'hover:bg-muted cursor-pointer' : ''}`}
                      >
                        <div className="flex-1 flex items-center">
                          <LessonIcon lesson={lesson} />
                          <span className={!isEnrolled && !lesson.isPreview ? "text-muted-foreground" : ""}>
                            {lesson.title}
                          </span>
                          {isEnrolled && lesson.completed && (
                            <Check className="h-4 w-4 ml-2 text-green-500" />
                          )}
                          {lesson.isPreview && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-primary/10 text-primary">
                              Preview
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(lesson.duration || 0)}
                          </span>
                          {!isEnrolled && !lesson.isPreview && (
                            <Lock className="h-3 w-3 ml-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}