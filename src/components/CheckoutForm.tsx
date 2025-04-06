
import React, { useState } from "react";
import { CartItem, Sale } from "@/types";
import { formatCurrency, calculateCartTotal, calculateFinalTotal } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CheckoutFormProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onCheckout: (sale: Omit<Sale, "id" | "createdAt">) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  open,
  onClose,
  cartItems,
  onCheckout,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    paymentMethod: "cash" as "cash" | "card" | "other",
    discount: 0,
    tax: 15, // ضريبة القيمة المضافة الافتراضية
    notes: "",
  });
  
  const subtotal = calculateCartTotal(cartItems);
  const finalTotal = calculateFinalTotal(subtotal, formData.tax, formData.discount);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value as "cash" | "card" | "other",
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData: Omit<Sale, "id" | "createdAt"> = {
      items: cartItems,
      total: subtotal,
      discount: formData.discount,
      tax: formData.tax,
      finalTotal: finalTotal,
      paymentMethod: formData.paymentMethod,
      customerName: formData.customerName || undefined,
      customerPhone: formData.customerPhone || undefined,
      notes: formData.notes || undefined,
    };
    
    onCheckout(saleData);
  };
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md" side="left">
        <SheetHeader>
          <SheetTitle>إتمام عملية البيع</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">تفاصيل الفاتورة</h3>
            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>المجموع:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>الخصم:</span>
                <div className="w-24">
                  <Input
                    type="number"
                    name="discount"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    className="h-8 text-left"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>الضريبة (%):</span>
                <div className="w-24">
                  <Input
                    type="number"
                    name="tax"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.tax}
                    onChange={handleChange}
                    className="h-8 text-left"
                  />
                </div>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>الإجمالي:</span>
                <span className="text-primary">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">بيانات العميل (اختياري)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="customerName">اسم العميل</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone">رقم الهاتف</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">طريقة الدفع</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقداً</SelectItem>
                  <SelectItem value="card">بطاقة</SelectItem>
                  <SelectItem value="other">طريقة أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" className="w-full">
              إتمام البيع
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutForm;
