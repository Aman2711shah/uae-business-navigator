import { TrendingUp, Megaphone, Users, Globe, Lightbulb, DollarSign, BookOpen } from "lucide-react";

export const growthServices = [
  {
    title: "Business Consultancy",
    icon: Lightbulb,
    color: "text-brand-blue",
    bgColor: "bg-blue-50",
    description: "Unlock expert business strategy and planning tailored to your industry",
    fullDescription: "Our consultants help refine your goals, optimize processes, and build actionable roadmaps for success.",
    price: "Starting from AED 1,500",
    rating: 4.8,
    popular: true
  },
  {
    title: "Digital Marketing", 
    icon: Megaphone,
    color: "text-brand-purple",
    bgColor: "bg-purple-50",
    description: "Maximize your online presence with comprehensive digital marketing services",
    fullDescription: "From social media to SEO, we craft campaigns that drive traffic, leads, and conversions.",
    price: "Starting from AED 2,000",
    rating: 4.9,
    popular: true
  },
  {
    title: "Website Development",
    icon: Globe,
    color: "text-brand-green", 
    bgColor: "bg-green-50",
    description: "Build a powerful digital foundation with custom website solutions",
    fullDescription: "Whether you're launching a brand or scaling up, we create user-friendly, mobile-responsive sites.",
    price: "Starting from AED 3,000",
    rating: 4.7,
    popular: false
  },
  {
    title: "Business Networking",
    icon: Users,
    color: "text-brand-orange",
    bgColor: "bg-orange-50", 
    description: "Connect with industry leaders through exclusive networking events",
    fullDescription: "Expand your business connections and explore partnerships through our platforms.",
    price: "Starting from AED 500",
    rating: 4.6,
    popular: false
  },
  {
    title: "Investor Assistance",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Gain access to funding through expert advisory and connections",
    fullDescription: "We assist in investor matchmaking, pitch deck development, and funding strategy.",
    price: "Starting from AED 2,500", 
    rating: 4.8,
    popular: true
  },
  {
    title: "Business Training",
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Empower your team with specialized workshops and training programs",
    fullDescription: "Learn essential business, marketing, and leadership skills from industry experts.",
    price: "Starting from AED 800",
    rating: 4.5,
    popular: false
  }
];

export const successStories = [
  {
    company: "TechStart Dubai",
    industry: "Technology",
    growth: "300% revenue increase",
    story: "From a small startup to a leading tech company in 18 months",
    image: "/placeholder.svg"
  },
  {
    company: "Green Foods UAE",
    industry: "F&B",
    growth: "5 new branches",
    story: "Expanded from single restaurant to food chain across UAE",
    image: "/placeholder.svg"
  },
  {
    company: "Digital Solutions Pro",
    industry: "Digital Marketing",
    growth: "200+ clients",
    story: "Built a thriving digital agency serving major brands",
    image: "/placeholder.svg"
  }
];

export const upcomingWorkshops = [
  {
    title: "Digital Marketing Masterclass",
    date: "Dec 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Dubai Business Bay",
    spots: 12,
    price: "AED 299"
  },
  {
    title: "Investment & Funding Workshop",
    date: "Dec 20, 2024", 
    time: "10:00 AM - 1:00 PM",
    location: "Abu Dhabi",
    spots: 8,
    price: "AED 499"
  }
];