import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const SearchBar = () => {
  const { searchTerm, setSearchTerm, searchResults, hasResults } = useGlobalSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleResultClick = (route: string) => {
    setShowDropdown(false);
    setSearchTerm('');
    navigate(route);
  };

  const handleInputFocus = () => {
    if (searchTerm.trim().length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative p-4 sm:p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground z-10" />
        <Input 
          ref={inputRef}
          placeholder="Search services across WAZEET..." 
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-9 sm:pl-10 h-11 sm:h-12 bg-muted/50 border-none rounded-xl text-sm sm:text-base"
        />
        
        {/* Search Results Dropdown */}
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg max-h-96 overflow-y-auto z-50"
          >
            {hasResults ? (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result.route)}
                    className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group touch-target"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base text-foreground truncate group-hover:text-primary">
                        {result.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={result.tab === 'Services' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {result.tab}
                        </Badge>
                        {result.category && (
                          <span className="text-xs text-muted-foreground truncate">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary ml-3 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : searchTerm.trim().length > 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No matching service found.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;