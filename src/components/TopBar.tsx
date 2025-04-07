
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingBag, BarChart, Settings, Clock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

const TopBar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const tabs = [
    { path: "/", label: "المبيعات", icon: <Home size={isMobile ? 18 : 20} /> },
    { path: "/inventory", label: "المخزون", icon: <Package size={isMobile ? 18 : 20} /> },
    { path: "/sales", label: "الفواتير", icon: <ShoppingBag size={isMobile ? 18 : 20} /> },
    { path: "/dashboard", label: "الإحصائيات", icon: <BarChart size={isMobile ? 18 : 20} /> },
    { path: "/shift-end", label: "الجرد", icon: <Clock size={isMobile ? 18 : 20} /> },
    { path: "/settings", label: "الإعدادات", icon: <Settings size={isMobile ? 18 : 20} /> },
  ];
  
  return (
    <div className={`top-tab-bar ${theme} z-50 fixed top-0 left-0 right-0 flex justify-around py-2 px-1 md:px-4 border-b`}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex items-center justify-center p-1 md:p-2 rounded-lg transition-colors ${
            isActive(tab.path)
              ? theme === 'dark' ? "text-primary bg-slate-800/50" : "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.icon}
          <span className={`text-xs md:text-sm ml-1 md:ml-2 ${isMobile ? 'text-[10px]' : ''}`}>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default TopBar;
