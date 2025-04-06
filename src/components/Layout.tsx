
import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // إنشاء تأثير بقع الألوان
  const colorSpots = [
    { color: "bg-blue-500", size: "w-64 h-64", top: "top-20", left: "left-10" },
    { color: "bg-purple-500", size: "w-72 h-72", top: "top-40", right: "right-10" },
    { color: "bg-pink-500", size: "w-48 h-48", bottom: "bottom-20", left: "left-20" },
    { color: "bg-cyan-500", size: "w-56 h-56", bottom: "bottom-10", right: "right-20" },
  ];
  
  return (
    <div className={`flex h-screen bg-background rtl overflow-hidden ${theme}`}>
      {/* بقع الألوان */}
      {colorSpots.map((spot, index) => (
        <div
          key={index}
          className={`color-spot ${spot.color} ${spot.size} ${spot.top} ${spot.left || ''} ${spot.right || ''} ${spot.bottom || ''}`}
        />
      ))}
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* رأس الصفحة */}
        <header className="glass py-4 px-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {location.pathname === "/" ? "نقطة البيع" : 
               location.pathname === "/inventory" ? "المخزون" :
               location.pathname === "/sales" ? "المبيعات" :
               location.pathname === "/dashboard" ? "الإحصائيات" :
               location.pathname === "/settings" ? "الإعدادات" : "الصفحة الرئيسية"}
            </h1>
          </div>
        </header>
        
        {/* محتوى الصفحة */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
