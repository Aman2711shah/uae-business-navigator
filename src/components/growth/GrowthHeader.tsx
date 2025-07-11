import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GrowthHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const GrowthHeader = ({ searchTerm, onSearchChange }: GrowthHeaderProps) => {
  return (
    <div className="bg-white border-b border-border p-4">
      <h1 className="text-2xl font-bold text-foreground mb-4">Growth Services</h1>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search growth services..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
        />
      </div>
    </div>
  );
};

export default GrowthHeader;