
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingBag, BarChart, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const TabBar = () => {
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
    { path: "/settings", label: "الإعدادات", icon: <Settings size={20} /> },
  ];
  
  return (
    <div className={`bottom-tab-bar glass ${theme}`}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            isActive(tab.path)
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.icon}
          <span className="text-xs mt-1">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default TabBar;
