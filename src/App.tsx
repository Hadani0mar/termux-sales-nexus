
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import ShiftEnd from "./pages/ShiftEnd";
import ShiftReports from "./pages/ShiftReports";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);

  const handleLandingComplete = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Landing onComplete={handleLandingComplete} />
        </TooltipProvider>
      </ThemeProvider>
    );
  }

  return (
    <AppProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<POS />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/shift-end" element={<ShiftEnd />} />
              <Route path="/shift-reports" element={<ShiftReports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
