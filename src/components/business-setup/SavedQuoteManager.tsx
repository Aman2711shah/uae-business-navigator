import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, FolderOpen, Trash2, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessSetupState } from "@/types/businessSetup";

interface SavedQuoteManagerProps {
  currentState: BusinessSetupState;
  onLoadQuote: (quoteData: any) => void;
}

const SavedQuoteManager: React.FC<SavedQuoteManagerProps> = ({ 
  currentState, 
  onLoadQuote 
}) => {
  const [quoteName, setQuoteName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedQuotes, isLoading } = useQuery({
    queryKey: ["saved-quotes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("saved_quotes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const saveQuoteMutation = useMutation({
    mutationFn: async ({ name, isUpdate = false, quoteId }: { 
      name: string; 
      isUpdate?: boolean; 
      quoteId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const quoteData = {
        quote_name: name,
        selected_activities: currentState.selectedActivities,
        shareholders: currentState.shareholders,
        total_visas: currentState.totalVisas,
        tenure: currentState.tenure,
        entity_type: currentState.entityType,
        estimated_cost: currentState.estimatedCost,
        recommended_package: currentState.recommendedPackage,
        alternative_packages: currentState.alternativePackages,
        cost_breakdown: currentState.costBreakdown,
        is_freezone: currentState.isFreezone,
        updated_at: new Date().toISOString()
      };

      if (isUpdate && quoteId) {
        const { data, error } = await supabase
          .from("saved_quotes")
          .update(quoteData)
          .eq("id", quoteId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("saved_quotes")
          .insert({
            ...quoteData,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-quotes"] });
      toast({
        title: "Quote Saved",
        description: "Your business setup quote has been saved successfully."
      });
      setQuoteName("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { error } = await supabase
        .from("saved_quotes")
        .delete()
        .eq("id", quoteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-quotes"] });
      toast({
        title: "Quote Deleted",
        description: "Saved quote has been deleted."
      });
    }
  });

  const handleSaveQuote = () => {
    if (!quoteName.trim()) {
      toast({
        title: "Quote Name Required",
        description: "Please enter a name for your quote.",
        variant: "destructive"
      });
      return;
    }

    saveQuoteMutation.mutate({ name: quoteName.trim() });
  };

  const handleLoadQuote = (quote: any) => {
    const loadedState = {
      selectedActivities: quote.selected_activities || [],
      shareholders: quote.shareholders || 1,
      totalVisas: quote.total_visas || 0,
      tenure: quote.tenure || 1,
      entityType: quote.entity_type || "",
      estimatedCost: quote.estimated_cost || 0,
      recommendedPackage: quote.recommended_package,
      alternativePackages: quote.alternative_packages || [],
      costBreakdown: quote.cost_breakdown,
      isFreezone: quote.is_freezone ?? true,
      searchTerm: "",
      filteredActivities: currentState.filteredActivities
    };

    onLoadQuote(loadedState);
    setIsDialogOpen(false);
    
    toast({
      title: "Quote Loaded",
      description: `Loaded "${quote.quote_name}" successfully.`
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Enter quote name..."
          value={quoteName}
          onChange={(e) => setQuoteName(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleSaveQuote}
          disabled={saveQuoteMutation.isPending}
          size="sm"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <FolderOpen className="h-4 w-4 mr-2" />
            Load Saved Quote ({savedQuotes?.length || 0})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl" aria-describedby="saved-quotes-description">
          <DialogHeader>
            <DialogTitle>Your Saved Quotes</DialogTitle>
          </DialogHeader>
          <p id="saved-quotes-description" className="sr-only">
            Manage and load your previously saved business setup quotes
          </p>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {savedQuotes && savedQuotes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No saved quotes yet</p>
                <p className="text-sm">Save your current setup to access it later</p>
              </div>
            )}

            {savedQuotes?.map((quote) => (
              <Card key={quote.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate">
                        {quote.quote_name}
                      </h4>
                      <Badge variant={quote.status === 'draft' ? 'secondary' : 'default'}>
                        {quote.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>{quote.selected_activities?.length || 0} activities • {quote.shareholders} shareholders • {quote.total_visas} visas</p>
                      <p>AED {Number(quote.estimated_cost || 0).toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(quote.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadQuote(quote)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteQuoteMutation.mutate(quote.id)}
                      disabled={deleteQuoteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedQuoteManager;