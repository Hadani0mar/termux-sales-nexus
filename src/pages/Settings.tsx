
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { exportDataToJson, importDataFromJson } from "@/utils/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Save, Upload, Download } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { state } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  
  const [businessName, setBusinessName] = useState(() => localStorage.getItem("businessName") || "نظام المبيعات");
  const [receiptFooter, setReceiptFooter] = useState(() => localStorage.getItem("receiptFooter") || "شكراً لزيارتكم");
  
  // حفظ إعدادات الفاتورة
  const saveReceiptSettings = () => {
    localStorage.setItem("businessName", businessName);
    localStorage.setItem("receiptFooter", receiptFooter);
    toast.success("تم حفظ إعدادات الفاتورة بنجاح");
  };
  
  // تصدير البيانات
  const handleExportData = () => {
    try {
      exportDataToJson({
        products: state.products,
        sales: state.sales,
        settings: {
          businessName,
          receiptFooter,
          theme
        }
      });
      toast.success("تم تصدير البيانات بنجاح");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("حدث خطأ أثناء تصدير البيانات");
    }
  };
  
  // استيراد البيانات
  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const file = e.target.files[0];
        const data = await importDataFromJson(file);
        
        // حفظ البيانات المستوردة في localStorage
        if (data.products) localStorage.setItem("products", JSON.stringify(data.products));
        if (data.sales) localStorage.setItem("sales", JSON.stringify(data.sales));
        
        // حفظ الإعدادات إذا كانت موجودة
        if (data.settings) {
          if (data.settings.businessName) {
            localStorage.setItem("businessName", data.settings.businessName);
            setBusinessName(data.settings.businessName);
          }
          if (data.settings.receiptFooter) {
            localStorage.setItem("receiptFooter", data.settings.receiptFooter);
            setReceiptFooter(data.settings.receiptFooter);
          }
        }
        
        toast.success("تم استيراد البيانات بنجاح. يرجى تحديث الصفحة لتطبيق التغييرات.");
      } catch (error) {
        console.error("Import error:", error);
        toast.error("حدث خطأ أثناء استيراد البيانات");
      }
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto mb-16">
        <div className="glass rounded-xl p-4 mb-6">
          <h1 className="text-2xl font-bold mb-4">الإعدادات</h1>
          <p className="text-muted-foreground">تخصيص إعدادات النظام والفواتير والنسخ الاحتياطي</p>
        </div>
        
        <Tabs defaultValue="general" className="mb-20">
          <TabsList className="mb-4">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="receipt">الفواتير</TabsTrigger>
            <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>إعدادات المظهر والتخصيص</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الوضع الليلي</Label>
                    <p className="text-sm text-muted-foreground">تبديل بين الوضع الليلي والنهاري</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Sun size={18} className={theme === 'light' ? 'text-yellow-500' : 'text-muted-foreground'} />
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                    <Moon size={18} className={theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground'} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="receipt" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الفواتير</CardTitle>
                <CardDescription>تخصيص معلومات الفواتير</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">اسم المتجر / الشركة</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="أدخل اسم المتجر أو الشركة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">تذييل الفاتورة</Label>
                  <Input
                    id="receiptFooter"
                    value={receiptFooter}
                    onChange={(e) => setReceiptFooter(e.target.value)}
                    placeholder="أدخل نص تذييل الفاتورة"
                  />
                </div>
                
                <Button onClick={saveReceiptSettings} className="mt-4 w-full">
                  <Save className="ml-2" size={18} />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>النسخ الاحتياطي واستعادة البيانات</CardTitle>
                <CardDescription>تصدير واستيراد بيانات النظام</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>تصدير البيانات</Label>
                  <p className="text-sm text-muted-foreground">
                    قم بتصدير جميع بيانات النظام (المنتجات، المبيعات، الإعدادات) إلى ملف JSON
                  </p>
                  <Button onClick={handleExportData} className="w-full">
                    <Download className="ml-2" size={18} />
                    تصدير البيانات
                  </Button>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <Label>استيراد البيانات</Label>
                  <p className="text-sm text-muted-foreground">
                    استعادة البيانات من نسخة احتياطية سابقة
                  </p>
                  <div className="flex items-center">
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      id="importFile"
                      className="hidden"
                    />
                    <Button asChild className="w-full">
                      <label htmlFor="importFile" className="cursor-pointer flex items-center justify-center">
                        <Upload className="ml-2" size={18} />
                        استيراد البيانات
                      </label>
                    </Button>
                  </div>
                  <p className="text-xs text-destructive mt-2">
                    ملاحظة: استيراد البيانات سيستبدل البيانات الحالية. يرجى عمل نسخة احتياطية قبل الاستيراد.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
