
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingBag, 
  Package, 
  BarChart, 
  Menu, 
  X 
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const navItems = [
    { path: "/", label: "نقطة البيع", icon: <Home className="w-5 h-5" /> },
    { path: "/inventory", label: "المخزون", icon: <Package className="w-5 h-5" /> },
    { path: "/sales", label: "المبيعات", icon: <ShoppingBag className="w-5 h-5" /> },
    { path: "/dashboard", label: "الإحصائيات", icon: <BarChart className="w-5 h-5" /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex h-screen bg-gray-100 rtl">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-20 transition-transform transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:sticky`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">نظام المبيعات</h1>
              <button onClick={toggleSidebar} className="lg:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeSidebar}
              >
                <span className="ml-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="px-4 py-4 border-t">
            <p className="text-xs text-center text-gray-500">
              نظام المبيعات الإصدار 1.0.0
            </p>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10 py-4 px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => isActive(item.path))?.label || "الصفحة الرئيسية"}
            </h1>
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md lg:hidden focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
