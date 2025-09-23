import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette, Monitor, Sun, Moon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Appearance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label className="text-sm font-medium">Choose your theme</Label>
          <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center cursor-pointer text-sm">
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center cursor-pointer text-sm">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center cursor-pointer text-sm">
                <Monitor className="h-4 w-4 mr-2" />
                System
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            System will use your device's preference
          </p>
        </div>
      </CardContent>
    </Card>
  );
};