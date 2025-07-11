import { Award, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SuccessStory {
  company: string;
  industry: string;
  growth: string;
  story: string;
  image: string;
}

interface SuccessStoryCardProps {
  story: SuccessStory;
  onClick: (companyName: string) => void;
}

const SuccessStoryCard = ({ story, onClick }: SuccessStoryCardProps) => {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div 
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => onClick(story.company)}
        >
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Award className="h-6 w-6 text-brand-orange" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{story.company}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{story.industry}</Badge>
              <Badge variant="outline" className="text-xs text-green-600">
                {story.growth}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{story.story}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessStoryCard;