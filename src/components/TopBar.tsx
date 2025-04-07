
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingBag, BarChart, Settings, Clock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const TopBar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const tabs = [
    { path: "/", label: "المبيعات", icon: <Home size={20} /> },
    { path: "/inventory", label: "المخزون", icon: <Package size={20} /> },
    { path: "/sales", label: "الفواتير", icon: <ShoppingBag size={20} /> },
    { path: "/dashboard", label: "الإحصائيات", icon: <BarChart size={20} /> },
    { path: "/shift-end", label: "الجرد", icon: <Clock size={20} /> },
    { path: "/settings", label: "الإعدادات", icon: <Settings size={20} /> },
  ];
  
  return (
    <div className={`top-tab-bar glass ${theme} z-50 flex justify-around py-2 px-4 mb-4`}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
            isActive(tab.path)
              ? theme === 'dark' ? "text-primary bg-slate-800/50" : "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.icon}
          <span className="text-xs md:text-sm ml-2">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default TopBar;
