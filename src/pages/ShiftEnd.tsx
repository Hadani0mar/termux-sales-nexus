
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";
import { calculateShiftSummary, getTodaySales, formatCurrency, generateId } from "@/utils/helpers";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Printer } from "lucide-react";
import { ShiftReport } from "@/types";

const ShiftEnd = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  
  const [cashInDrawer, setCashInDrawer] = useState<number>(0);
  const [cashShortage, setCashShortage] = useState<number | null>(null);
  const [completedCheck, setCompletedCheck] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [includeDebtInTotal, setIncludeDebtInTotal] = useState<boolean>(false);
  
  // Get today's sales
  const todaySales = getTodaySales(state.sales);
  
  // Calculate shift summary
  const shiftSummary = calculateShiftSummary(todaySales);
  
  // Calculate cash difference when cash in drawer is entered
  useEffect(() => {
    if (cashInDrawer > 0) {
      setCashShortage(cashInDrawer - shiftSummary.totalCashSales);
    } else {
      setCashShortage(null);
    }
  }, [cashInDrawer, shiftSummary.totalCashSales]);
  
  // Handle cash in drawer input change
  const handleCashInDrawerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCashInDrawer(value);
  };
  
  // Complete shift check
  const handleCompleteShift = () => {
    // Store the shift summary in localStorage
    const existingShiftReports = JSON.parse(localStorage.getItem("shiftReports") || "[]");
    
    const shiftReport: ShiftReport = {
      id: generateId(),
      date: new Date(),
      salesCount: shiftSummary.salesCount,
      totalSales: includeDebtInTotal 
        ? shiftSummary.totalSales 
        : shiftSummary.totalSales - shiftSummary.totalDebtSales,
      totalCashSales: shiftSummary.totalCashSales,
      totalCardSales: shiftSummary.totalCardSales,
      totalDebtSales: shiftSummary.totalDebtSales,
      cashInDrawer: cashInDrawer,
      cashShortage: cashShortage || 0,
      notes: notes,
      includeDebtInTotal: includeDebtInTotal
    };
    
    existingShiftReports.unshift(shiftReport);
    localStorage.setItem("shiftReports", JSON.stringify(existingShiftReports));
    
    setCompletedCheck(true);
    toast.success("تم حفظ تقرير نهاية الدوام بنجاح");
  };
  
  // Print report
  const handlePrintReport = () => {
    const reportContent = document.getElementById('shiftReport');
    if (reportContent) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow?.document.write('<html><head><title>تقرير نهاية الدوام</title>');
      printWindow?.document.write('<style>body{font-family:Arial;direction:rtl;padding:20px;}h1{text-align:center;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:right;}th{background-color:#f2f2f2;}</style>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write('<h1>تقرير نهاية الدوام</h1>');
      printWindow?.document.write('<p>التاريخ: ' + new Date().toLocaleDateString('ar-LY') + '</p>');
      printWindow?.document.write(reportContent.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto mb-16">
        <div className="glass rounded-xl p-4 mb-6">
          <h1 className="text-2xl font-bold mb-4">جرد نهاية الدوام</h1>
          <p className="text-muted-foreground">مراجعة المبيعات والمخزون وإغلاق الدوام</p>
        </div>
        
        <div id="shiftReport" className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ملخص المبيعات</CardTitle>
              <CardDescription>مبيعات اليوم الحالي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(includeDebtInTotal ? shiftSummary.totalSales : shiftSummary.totalSales - shiftSummary.totalDebtSales)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">عدد المبيعات</p>
                  <p className="text-2xl font-bold">{shiftSummary.salesCount}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span>المبيعات النقدية:</span>
                  <span className="font-medium">{formatCurrency(shiftSummary.totalCashSales)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>مبيعات البطاقات:</span>
                  <span className="font-medium">{formatCurrency(shiftSummary.totalCardSales)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>مبيعات الدين:</span>
                  <span className="font-medium">{formatCurrency(shiftSummary.totalDebtSales)}</span>
                </div>
                
                <div className="mt-4 flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="includeDebt"
                    checked={includeDebtInTotal}
                    onCheckedChange={setIncludeDebtInTotal}
                    disabled={completedCheck}
                  />
                  <Label htmlFor="includeDebt" className="cursor-pointer">
                    تضمين الديون في إجمالي المبيعات
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>تسوية الصندوق</CardTitle>
              <CardDescription>مراجعة النقد في الصندوق</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cashInDrawer">النقد الموجود في الصندوق</Label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Input
                    id="cashInDrawer"
                    type="number"
                    placeholder="أدخل المبلغ الموجود في الصندوق"
                    value={cashInDrawer || ""}
                    onChange={handleCashInDrawerChange}
                    disabled={completedCheck}
                  />
                  <span className="text-sm">د.ل</span>
                </div>
              </div>
              
              {cashShortage !== null && (
                <div className={`p-3 rounded-md ${
                  cashShortage === 0 
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                    : cashShortage > 0 
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  <p className="font-medium">
                    {cashShortage === 0 
                      ? "الصندوق متطابق تماماً!" 
                      : cashShortage > 0 
                        ? `يوجد فائض في الصندوق بقيمة ${formatCurrency(cashShortage)}` 
                        : `يوجد عجز في الصندوق بقيمة ${formatCurrency(Math.abs(cashShortage))}`}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="أضف ملاحظات حول التقرير"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={completedCheck}
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleCompleteShift} 
                className="w-full mt-4"
                disabled={cashInDrawer <= 0 || completedCheck}
              >
                إتمام تقرير نهاية الدوام
              </Button>
              
              {completedCheck && (
                <div className="flex gap-2 flex-col">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handlePrintReport}
                  >
                    <Printer className="ml-2 h-4 w-4" />
                    طباعة التقرير
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    العودة للصفحة الرئيسية
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>المنتجات منخفضة المخزون</CardTitle>
            <CardDescription>المنتجات التي يجب إعادة ملئها</CardDescription>
          </CardHeader>
          <CardContent>
            {state.products.filter(p => p.stock < 5).length > 0 ? (
              <div className="grid gap-2">
                {state.products
                  .filter(p => p.stock < 5)
                  .map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">الكمية المتبقية: {product.stock}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        product.stock === 0 
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}>
                        {product.stock === 0 ? "نفذ المخزون" : "مخزون منخفض"}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">لا توجد منتجات منخفضة المخزون</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ShiftEnd;
