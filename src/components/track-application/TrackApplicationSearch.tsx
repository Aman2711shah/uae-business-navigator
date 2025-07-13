import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface TrackApplicationSearchProps {
  requestId: string;
  setRequestId: (id: string) => void;
  onSearch: () => void;
  loading: boolean;
  error: string;
}

export const TrackApplicationSearch: React.FC<TrackApplicationSearchProps> = ({
  requestId,
  setRequestId,
  onSearch,
  loading,
  error
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Your Application
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="requestId">Service Request ID</Label>
            <Input
              id="requestId"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="Enter your request ID (e.g., SR48936845)"
            />
          </div>
          <Button 
            onClick={onSearch}
            disabled={loading || !requestId.trim()}
            className="w-full"
          >
            {loading ? "Searching..." : "Search Application"}
          </Button>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};