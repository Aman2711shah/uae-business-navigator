import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, Image, Download, Trash2, AlertCircle } from 'lucide-react';

interface UserDocument {
  id: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  document_type: string;
  created_at: string;
  signed_url?: string;
}

const MyDocuments = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('documents', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed. Please upload PDF, JPEG, PNG, or WebP files.');
    }
    if (file.size > maxFileSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }
  };

  const uploadDocument = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      validateFile(file);

      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      setUploadProgress(25);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(75);

      // Save metadata
      const { data, error } = await supabase.functions.invoke('documents', {
        body: {
          file_name: file.name,
          file_path: uploadData.path,
          mime_type: file.type,
          file_size: file.size,
          storage_path: fileName,
          document_type: file.type.startsWith('image/') ? 'image' : 'document'
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });

      // Refresh documents list
      fetchDocuments();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadDocument(file);
    }
    // Reset input value so same file can be selected again
    event.target.value = '';
  };

  const deleteDocument = async (document: UserDocument) => {
    try {
      const { error } = await supabase.functions.invoke('documents', {
        method: 'DELETE',
        body: { document_id: document.id },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      // Remove from local state
      setDocuments(docs => docs.filter(d => d.id !== document.id));

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const downloadDocument = (document: UserDocument) => {
    if (document.signed_url) {
      window.open(document.signed_url, '_blank');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-primary" />;
    }
    return <FileText className="w-6 h-6 text-primary" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground mt-2">
              Upload and manage your documents securely
            </p>
          </div>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload your documents</p>
                  <p className="text-muted-foreground mb-4">
                    Support for PDF, JPEG, PNG, WebP files up to 10MB
                  </p>
                  <div className="flex items-center justify-center">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileSelect}
                      disabled={uploading}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      asChild 
                      disabled={uploading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </Button>
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Documents ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No documents uploaded</p>
                  <p className="text-muted-foreground">
                    Upload your first document using the form above
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(doc.mime_type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument(doc)}
                          disabled={!doc.signed_url}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-destructive" />
                                Delete Document
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{doc.file_name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDocument(doc)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;