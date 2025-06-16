
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { Database, BarChart2, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="h-16 container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <h1 className="text-xl font-semibold tracking-tight">Server Manager</h1>
        </div>
        
        <Tabs value={currentPath} className="hidden md:block">
          <TabsList>
            <TabsTrigger 
              value="/" 
              onClick={() => navigate("/")}
              className="flex items-center gap-1"
            >
              <Database className="w-4 h-4" />
              <span>Server List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="/dashboard" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="/help" 
              onClick={() => navigate("/help")}
              className="flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:block">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          <div className="flex md:hidden">
            <Button
              variant={currentPath === "/" ? "default" : "ghost"}
              size="icon"
              onClick={() => navigate("/")}
            >
              <Database className="h-5 w-5" />
            </Button>
            <Button
              variant={currentPath === "/dashboard" ? "default" : "ghost"}
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
            <Button
              variant={currentPath === "/help" ? "default" : "ghost"}
              size="icon"
              onClick={() => navigate("/help")}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
