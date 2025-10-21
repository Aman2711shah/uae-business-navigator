import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, Save, User, Mail, Phone, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name too long"),
  display_name: z.string().max(50, "Display name too long").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number in E.164 format (e.g., +1234567890)")
    .optional().or(z.literal("")),
  company: z.string().max(100, "Company name too long").optional(),
  address: z.string().max(255, "Address too long").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  headline: z.string().max(100, "Headline too long").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      display_name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      bio: "",
      headline: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('profile', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.ok && data.profile) {
        const profileData = data.profile;
        setProfile(profileData);
        setAvatarUrl(profileData.avatar_url || "");
        
        // Update form with fetched data
        form.reset({
          full_name: profileData.full_name || "",
          display_name: profileData.display_name || "",
          email: profileData.email || user?.email || "",
          phone: profileData.phone || "",
          company: profileData.company || "",
          address: profileData.address || "",
          bio: profileData.bio || "",
          headline: profileData.headline || "",
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data, error } = await supabase.functions.invoke('profile-avatar', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: formData,
      });

      if (error) throw error;

      if (data.ok) {
        setAvatarUrl(data.avatar_url);
        toast({
          title: "Success",
          description: "Profile photo updated successfully",
        });
      } else {
        throw new Error(data.error || "Failed to upload avatar");
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('profile', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: data,
      });

      if (error) throw error;

      if (responseData.ok) {
        setProfile(responseData.profile);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(responseData.error || "Failed to update profile");
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.full_name || user?.email || "User";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="mr-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Profile Settings</h1>
            </div>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={saving}
              size="sm"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={avatarUrl} alt="Profile" />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">
                  {displayName}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a new profile photo (JPEG, PNG, WebP - max 5MB)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? "Uploading..." : "Change Photo"}
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Full Name *
                </Label>
                <Input
                  {...form.register("full_name")}
                  placeholder="Your full name"
                  className={form.formState.errors.full_name ? "border-destructive" : ""}
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  {...form.register("display_name")}
                  placeholder="How others see you"
                  className={form.formState.errors.display_name ? "border-destructive" : ""}
                />
                {form.formState.errors.display_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.display_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address *
              </Label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="your.email@example.com"
                className={form.formState.errors.email ? "border-destructive" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Email changes require verification and may affect your login.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </Label>
              <Input
                {...form.register("phone")}
                placeholder="+1234567890"
                className={form.formState.errors.phone ? "border-destructive" : ""}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +971 for UAE)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Professional Headline</Label>
              <Input
                {...form.register("headline")}
                placeholder="e.g., Business Setup Consultant | Entrepreneur"
                className={form.formState.errors.headline ? "border-destructive" : ""}
              />
              {form.formState.errors.headline && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.headline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Company Name
              </Label>
              <Input
                {...form.register("company")}
                placeholder="Your company or organization"
                className={form.formState.errors.company ? "border-destructive" : ""}
              />
              {form.formState.errors.company && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                {...form.register("bio")}
                placeholder="Tell others about yourself, your expertise, and what you do..."
                rows={4}
                className={form.formState.errors.bio ? "border-destructive" : ""}
              />
              {form.formState.errors.bio && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.bio.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {form.watch("bio")?.length || 0}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                {...form.register("address")}
                placeholder="Your address or preferred business location"
                rows={2}
                className={form.formState.errors.address ? "border-destructive" : ""}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button - Mobile */}
        <div className="md:hidden">
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={saving}
            className="w-full"
            size="lg"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;