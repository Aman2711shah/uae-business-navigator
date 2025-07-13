import { useState } from 'react';
import { MessageSquarePlus, Image, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PostCreationBoxProps {
  onCreatePost: () => void;
  userProfile?: any;
}

export default function PostCreationBox({ onCreatePost, userProfile }: PostCreationBoxProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground font-normal h-12"
              onClick={onCreatePost}
            >
              Share an update, ask a question, or post an opportunity...
            </Button>
            <div className="flex items-center gap-4 mt-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-3">
                <Image className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-3">
                <Hash className="h-4 w-4 mr-2" />
                Tag
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-3">
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Poll
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}