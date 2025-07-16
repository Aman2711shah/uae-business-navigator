import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Image, Send, Hash, Upload, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must be less than 200 characters'),
  body: z.string().min(20, 'Post content must be at least 20 characters').max(2000, 'Post content must be less than 2000 characters'),
  tags: z.string().optional(),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  industry: string;
  onPostCreated: (post: any) => void;
}

export default function CreatePostModal({ isOpen, onClose, industry, onPostCreated }: CreatePostModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: '',
      image: null,
    },
  });

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(fileName, selectedImage);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('community-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const { data: post, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: data.title,
          body: data.body,
          industry_tag: industry,
          tags: tags,
          image_url: imageUrl,
        })
        .select('*')
        .single();

      if (error) throw error;

      // Fetch user profiles for the new post
      const [profileData, communityUserData] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('community_users')
          .select('username, company_name, business_stage')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      const postWithProfile = {
        ...post,
        profiles: profileData.data,
        community_users: communityUserData.data
      };

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });

      onPostCreated(postWithProfile);
      form.reset();
      setTags([]);
      setTagInput('');
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to create post",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setTags([]);
    setTagInput('');
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Create Post in {industry}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What's your question or topic?" 
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts, ask questions, or provide insights..."
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    {field.value?.length || 0}/2000 characters
                  </p>
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image (Optional)
              </FormLabel>
              
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload an image
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Tags (Optional)
              </FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter or comma to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyPress}
                disabled={tags.length >= 5}
              />
              <p className="text-sm text-muted-foreground">
                Add up to 5 tags to help others find your post
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant="cta"
                className="flex-1"
              >
                {isLoading ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}