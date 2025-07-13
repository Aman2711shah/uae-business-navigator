import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, User, Building, Globe, Users, Briefcase, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  businessStage: z.enum(['Startup', 'Growing', 'Established']),
  aboutYou: z.string().min(10, 'Please write at least 10 characters about yourself').max(500, 'Maximum 500 characters'),
  businessType: z.enum(['Freezone', 'Mainland', 'Offshore']),
  employeeCount: z.string().optional(),
  websiteOrLinkedin: z.string().url().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface CommunityEntryFormProps {
  selectedIndustries: string[];
  onBack: () => void;
  onSuccess: (communityUser: any) => void;
}

export default function CommunityEntryForm({ selectedIndustries, onBack, onSuccess }: CommunityEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      username: '',
      businessStage: 'Startup',
      aboutYou: '',
      businessType: 'Freezone',
      employeeCount: '',
      websiteOrLinkedin: '',
    },
  });

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from('community_users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;
      setUsernameAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (usernameAvailable === false) {
      toast({
        title: "Username unavailable",
        description: "Please choose a different username.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: communityUser, error } = await supabase
        .from('community_users')
        .insert({
          user_id: user.id,
          username: data.username,
          industry: selectedIndustries[0], // Primary industry for backward compatibility
          industries: selectedIndustries,
          company_name: data.companyName,
          business_stage: data.businessStage,
          about_you: data.aboutYou,
          business_type: data.businessType,
          employee_count: data.employeeCount || null,
          website_or_linkedin: data.websiteOrLinkedin || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Welcome to the community!",
        description: `You've successfully joined ${selectedIndustries.length} industry communities.`,
      });

      onSuccess(communityUser);
    } catch (error: any) {
      console.error('Error joining community:', error);
      toast({
        title: "Failed to join community",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="text-muted-foreground">Join the community and start connecting</p>
          </div>
        </div>

        {/* Selected Industries */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3">Selected Industries</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIndustries.map((industry) => (
                <Badge key={industry} variant="secondary" className="text-sm">
                  {industry}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Community Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Company Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Username *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Choose a unique username" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              checkUsernameAvailability(e.target.value);
                            }}
                          />
                          {checkingUsername && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            </div>
                          )}
                          {usernameAvailable === true && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                          )}
                          {usernameAvailable === false && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 bg-red-500 rounded-full" />
                          )}
                        </div>
                      </FormControl>
                      {usernameAvailable === false && (
                        <p className="text-sm text-red-500">Username is already taken</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Stage */}
                <FormField
                  control={form.control}
                  name="businessStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Business Stage *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your business stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Startup">Startup</SelectItem>
                          <SelectItem value="Growing">Growing</SelectItem>
                          <SelectItem value="Established">Established</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* About You */}
                <FormField
                  control={form.control}
                  name="aboutYou"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        About You *
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell the community about yourself, your business, and what you're looking to achieve..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Type */}
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Freezone">Freezone</SelectItem>
                          <SelectItem value="Mainland">Mainland</SelectItem>
                          <SelectItem value="Offshore">Offshore</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Employee Count */}
                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Employees (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Just me</SelectItem>
                          <SelectItem value="2-10">2-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="200+">200+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website or LinkedIn */}
                <FormField
                  control={form.control}
                  name="websiteOrLinkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website or LinkedIn (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com or LinkedIn profile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || usernameAvailable === false}
                  variant="cta"
                  size="lg"
                >
                  {isLoading ? "Joining Community..." : "🔘 Join Community"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}