import { Building2, FileText, Plane, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    icon: Building2,
    title: "Start New Company",
    description: "Setup your business in UAE",
    color: "text-brand-blue",
    bgColor: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Apply for Trade License",
    description: "Get your trading license",
    color: "text-brand-green",
    bgColor: "bg-green-50",
  },
  {
    icon: Plane,
    title: "Visa Processing",
    description: "Employee & Investor visas",
    color: "text-brand-purple",
    bgColor: "bg-purple-50",
  },
  {
    icon: Eye,
    title: "Track Application",
    description: "Monitor your progress",
    color: "text-brand-orange",
    bgColor: "bg-orange-50",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  const handleActionClick = (index: number) => {
    if (index === 0) { // Start New Company
      navigate("/business-setup");
    } else if (index === 1) { // Apply for Trade License
      navigate("/trade-license");
    } else if (index === 3) { // Track Application
      navigate("/track-application");
    }
    // Add more navigation logic for other actions as needed
  };

  return (
    <div className="px-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => handleActionClick(index)}
          >
            <CardContent className="p-4">
              <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-3`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1 leading-tight">
                {action.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;