
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Droplet, Layers, Calendar } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { path: "/", label: "Home", icon: Droplet },
    { path: "/analyze", label: "Analyze", icon: Layers },
    { path: "/routines", label: "Routines", icon: Calendar },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-semibold flex items-center gap-2"
          >
            <Droplet className="h-6 w-6 text-accent" />
            <span className="font-serif">glow</span>
            <span className="text-muted-foreground">checker</span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full flex items-center gap-2 transition-all",
                    isActive 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="md:hidden flex items-center">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
