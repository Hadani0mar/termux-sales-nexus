
import { Product, CartItem, Sale } from "@/types";
import html2pdf from "html2pdf.js";

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);
};

// Calculate cart total
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

// Calculate final total with tax and discount
export const calculateFinalTotal = (
  total: number,
  tax: number,
  discount: number
): number => {
  const afterDiscount = total - discount;
  const afterTax = afterDiscount + (afterDiscount * tax) / 100;
  return afterTax;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Generate a receipt as PDF
export const generateReceipt = (sale: Sale, businessName: string): void => {
  const container = document.createElement("div");
  container.className = "receipt-container rtl p-4";
  
  const content = `
    <div class="text-center mb-4">
      <h2 class="text-xl font-bold">${businessName}</h2>
      <p class="text-sm">${formatDate(sale.createdAt)}</p>
      <p class="text-sm">فاتورة رقم: ${sale.id}</p>
    </div>
    
    <div class="border-t border-b py-2 my-2">
      ${sale.customerName ? `<p class="text-sm">العميل: ${sale.customerName}</p>` : ''}
      ${sale.customerPhone ? `<p class="text-sm">رقم الهاتف: ${sale.customerPhone}</p>` : ''}
    </div>
    
    <table class="w-full text-right text-sm">
      <thead>
        <tr>
          <th class="py-1">المنتج</th>
          <th class="py-1">الكمية</th>
          <th class="py-1">السعر</th>
          <th class="py-1">المجموع</th>
        </tr>
      </thead>
      <tbody>
        ${sale.items.map(item => `
          <tr>
            <td class="py-1">${item.product.name}</td>
            <td class="py-1">${item.quantity}</td>
            <td class="py-1">${formatCurrency(item.product.price)}</td>
            <td class="py-1">${formatCurrency(item.product.price * item.quantity)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="border-t mt-2 pt-2">
      <div class="flex justify-between">
        <span>المجموع:</span>
        <span>${formatCurrency(sale.total)}</span>
      </div>
      ${sale.discount > 0 ? `
        <div class="flex justify-between">
          <span>الخصم:</span>
          <span>${formatCurrency(sale.discount)}</span>
        </div>
      ` : ''}
      ${sale.tax > 0 ? `
        <div class="flex justify-between">
          <span>الضريبة (${sale.tax}%):</span>
          <span>${formatCurrency((sale.total - sale.discount) * sale.tax / 100)}</span>
        </div>
      ` : ''}
      <div class="flex justify-between font-bold border-t pt-1 mt-1">
        <span>الإجمالي:</span>
        <span>${formatCurrency(sale.finalTotal)}</span>
      </div>
      <div class="flex justify-between">
        <span>طريقة الدفع:</span>
        <span>${sale.paymentMethod === 'cash' ? 'نقدي' : sale.paymentMethod === 'card' ? 'بطاقة' : 'أخرى'}</span>
      </div>
    </div>
    
    <div class="text-center mt-4 text-sm">
      <p>شكراً لزيارتكم</p>
    </div>
  `;
  
  container.innerHTML = content;
  document.body.appendChild(container);
  
  const options = {
    margin: [0, 0, 0, 0],
    filename: `فاتورة_${sale.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: [80, 150], orientation: 'portrait' }
  };
  
  html2pdf().from(container).set(options).save().then(() => {
    document.body.removeChild(container);
  });
};

// Filter sales by date range
export const filterSalesByDateRange = (
  sales: Sale[],
  startDate: Date,
  endDate: Date
): Sale[] => {
  return sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= startDate && saleDate <= endDate;
  });
};

// Calculate total sales for a period
export const calculateTotalSales = (sales: Sale[]): number => {
  return sales.reduce((total, sale) => {
    return total + sale.finalTotal;
  }, 0);
};

// Get today's sales
export const getTodaySales = (sales: Sale[]): Sale[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
};

// Check if product has enough stock
export const hasEnoughStock = (product: Product, quantity: number): boolean => {
  return product.stock >= quantity;
};

// Update product stock
export const updateProductStock = (
  product: Product,
  quantity: number
): Product => {
  return {
    ...product,
    stock: product.stock - quantity,
    updatedAt: new Date(),
  };
};
