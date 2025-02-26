
import { Search, Calendar, Droplet } from "lucide-react";

export const features = [
  {
    title: "Analyze Ingredients",
    description: "Scan or input your product ingredients to understand what's beneficial and what might be causing issues.",
    icon: Search,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-700",
    path: "/analyze"
  },
  {
    title: "Build Your Routine",
    description: "Create personalized morning and evening routines with the optimal order for maximum efficacy.",
    icon: Calendar,
    bgColor: "bg-accent/30",
    iconColor: "text-accent-foreground",
    path: "/routines"
  },
  {
    title: "Track Results",
    description: "Monitor your skin's progress and adjust your routine based on what's working for your unique needs.",
    icon: Droplet,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-700",
    path: "/analyze"
  }
];
