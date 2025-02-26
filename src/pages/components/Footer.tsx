
import { Droplet } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Droplet className="h-5 w-5 text-accent" />
            <span className="font-serif">glow</span>
            <span className="text-muted-foreground">checker</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GlowChecker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
