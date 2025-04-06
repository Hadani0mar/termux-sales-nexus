
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface LandingProps {
  onComplete: () => void;
}

const Landing: React.FC<LandingProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  
  // إنشاء تأثير بقع الألوان
  const colorSpots = [
    { color: "bg-blue-500", size: "w-64 h-64", top: "top-20", left: "left-10" },
    { color: "bg-purple-500", size: "w-72 h-72", top: "top-40", right: "right-10" },
    { color: "bg-pink-500", size: "w-48 h-48", bottom: "bottom-20", left: "left-20" },
    { color: "bg-cyan-500", size: "w-56 h-56", bottom: "bottom-10", right: "right-20" },
  ];
  
  // محاكاة تقدم التحميل
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 50);
    
    return () => clearInterval(timer);
  }, []);
  
  // الانتقال التلقائي بعد إكمال التحميل
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);
  
  return (
    <div className={`landing-container ${theme}`}>
      {/* بقع الألوان */}
      {colorSpots.map((spot, index) => (
        <div
          key={index}
          className={`color-spot ${spot.color} ${spot.size} ${spot.top} ${spot.left || ''} ${spot.right || ''} ${spot.bottom || ''}`}
        />
      ))}
      
      <div className="landing-content glass p-10 rounded-2xl">
        <h1 className="landing-title">نظام المبيعات</h1>
        <p className="landing-subtitle">حل متكامل لإدارة نقاط البيع والمخزون والمبيعات</p>
        
        {/* شريط التقدم */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          {progress < 100 ? (
            <p>جاري التحميل... {progress}%</p>
          ) : (
            <Button
              className="landing-cta"
              onClick={onComplete}
            >
              انتقل إلى التطبيق
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
