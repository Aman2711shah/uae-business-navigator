import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Ask WAZEET or Search" 
          className="pl-10 h-12 bg-muted/50 border-none rounded-xl text-base"
        />
      </div>
    </div>
  );
};

export default SearchBar;