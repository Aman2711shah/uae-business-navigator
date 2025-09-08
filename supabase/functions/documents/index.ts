import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Documents function started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create service client for admin operations
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create client for user operations
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const method = req.method;

    // GET /documents - List user documents
    if (method === 'GET') {
      console.log('Fetching documents for user:', user.id);
      
      const { data: documents, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch documents' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate signed URLs for documents
      const documentsWithUrls = await Promise.all(
        documents.map(async (doc) => {
          const { data: signedUrl } = await supabase.storage
            .from('user-documents')
            .createSignedUrl(doc.storage_path, 3600); // 1 hour expiry

          return {
            ...doc,
            signed_url: signedUrl?.signedUrl || null
          };
        })
      );

      return new Response(
        JSON.stringify({ documents: documentsWithUrls }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // POST /documents - Create document metadata (after client uploads to storage)
    if (method === 'POST') {
      const body = await req.json();
      const { file_name, file_path, mime_type, file_size, storage_path, document_type = 'general' } = body;

      if (!file_name || !file_path || !mime_type || !file_size || !storage_path) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Creating document metadata for user:', user.id);

      const { data: document, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          file_name,
          file_path,
          mime_type,
          file_size,
          storage_path,
          document_type
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create document' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ document }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE /documents - Delete document
    if (method === 'DELETE') {
      const body = await req.json();
      const { document_id } = body;

      if (!document_id) {
        return new Response(
          JSON.stringify({ error: 'Document ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Deleting document:', document_id);

      // First get the document to find the storage path
      const { data: document, error: fetchError } = await supabase
        .from('user_documents')
        .select('storage_path')
        .eq('id', document_id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !document) {
        console.error('Document not found:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Document not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-documents')
        .remove([document.storage_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', document_id)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Error deleting from database:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to delete document' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});