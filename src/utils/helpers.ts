
import { Product, CartItem, Sale, ShiftReport } from "@/types";
import html2pdf from "html2pdf.js";
import { defaultSettings } from "@/types/settings";

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Format currency for display (Libyan Dinar)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-LY", {
    style: "currency",
    currency: "LYD",
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
  const afterTax = tax > 0 ? afterDiscount + (afterDiscount * tax) / 100 : afterDiscount;
  return afterTax;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("ar-LY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Generate a receipt as PDF
export const generateReceipt = (sale: Sale, businessName?: string, receiptFooter?: string): void => {
  // Get settings from localStorage or use defaults
  const settings = (() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  })();
  
  const companyName = businessName || settings.businessName;
  const footer = receiptFooter || settings.receiptFooter;
  const applyTax = settings.shouldApplyTax;
  const printDiscountReasons = settings.printDiscountReasons || false;
  const printNotes = settings.printNotes || false;
  
  const container = document.createElement("div");
  container.className = "receipt-container rtl p-4";
  
  const content = `
    <div class="text-center mb-4">
      <h2 class="text-xl font-bold">${companyName}</h2>
      <p class="text-sm">${settings.location || ""}</p>
      <p class="text-sm">${formatDate(sale.createdAt)}</p>
      <p class="text-sm">فاتورة رقم: ${sale.id}</p>
    </div>
    
    <div class="border-t border-b py-2 my-2">
      ${sale.customerName ? `<p class="text-sm">العميل: ${sale.customerName}</p>` : ''}
      ${sale.customerPhone ? `<p class="text-sm">رقم الهاتف: ${sale.customerPhone}</p>` : ''}
      ${sale.isDebt ? `<p class="text-sm font-bold">نوع البيع: دين</p>` : ''}
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
        ${printDiscountReasons && sale.discountReason ? `
          <div class="flex justify-between text-xs">
            <span>سبب الخصم:</span>
            <span>${sale.discountReason}</span>
          </div>
        ` : ''}
      ` : ''}
      ${applyTax && sale.tax > 0 ? `
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
        <span>${sale.paymentMethod === 'cash' ? 'نقدي' : sale.paymentMethod === 'card' ? 'بطاقة' : 'دين'}</span>
      </div>
      ${printNotes && sale.notes ? `
        <div class="mt-2 text-xs">
          <p>ملاحظات: ${sale.notes}</p>
        </div>
      ` : ''}
    </div>
    
    <div class="text-center mt-4 text-sm">
      <p>${footer}</p>
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

// Export JSON data 
export const exportDataToJson = (data: any): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `nora_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import JSON data
export const importDataFromJson = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result);
          resolve(data);
        } else {
          reject(new Error('Failed to read file'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

// Track debts
export const getDebtsForCustomer = (sales: Sale[], customerName: string): number => {
  return sales
    .filter(sale => sale.isDebt && !sale.isFrozen && sale.debtorName === customerName)
    .reduce((total, sale) => total + sale.finalTotal, 0);
};

// Check if customer has reached debt limit
export const hasReachedDebtLimit = (
  sales: Sale[], 
  customerName: string, 
  limit: number
): boolean => {
  const totalDebt = getDebtsForCustomer(sales, customerName);
  return totalDebt >= limit;
};

// Calculate end-of-shift summary
export const calculateShiftSummary = (sales: Sale[]) => {
  const totalCashSales = sales
    .filter(sale => sale.paymentMethod === 'cash')
    .reduce((total, sale) => total + sale.finalTotal, 0);
    
  const totalCardSales = sales
    .filter(sale => sale.paymentMethod === 'card')
    .reduce((total, sale) => total + sale.finalTotal, 0);
    
  const totalDebtSales = sales
    .filter(sale => sale.isDebt || sale.paymentMethod === 'other')
    .reduce((total, sale) => total + sale.finalTotal, 0);
    
  const totalSales = totalCashSales + totalCardSales + totalDebtSales;
  
  return {
    totalSales,
    totalCashSales,
    totalCardSales,
    totalDebtSales,
    salesCount: sales.length
  };
};

// Generate a shift report PDF
export const generateShiftReport = (report: ShiftReport): void => {
  const container = document.createElement("div");
  container.className = "report-container rtl p-4";
  
  // Get settings from localStorage or use defaults
  const settings = (() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  })();
  
  const content = `
    <div class="text-center mb-4">
      <h2 class="text-xl font-bold">${settings.businessName}</h2>
      <p class="text-sm">${settings.location || ""}</p>
      <h3 class="text-lg font-bold mt-4">تقرير نهاية الدوام</h3>
      <p class="text-sm">${formatDate(report.date)}</p>
    </div>
    
    <div class="border-t border-b py-2 my-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="font-bold">عدد المبيعات:</p>
          <p>${report.salesCount}</p>
        </div>
        <div>
          <p class="font-bold">إجمالي المبيعات:</p>
          <p>${formatCurrency(report.totalSales)}</p>
        </div>
      </div>
    </div>
    
    <table class="w-full text-right my-4">
      <tr>
        <td class="font-bold py-1">المبيعات النقدية:</td>
        <td class="py-1">${formatCurrency(report.totalCashSales)}</td>
      </tr>
      <tr>
        <td class="font-bold py-1">مبيعات البطاقات:</td>
        <td class="py-1">${formatCurrency(report.totalCardSales)}</td>
      </tr>
      <tr>
        <td class="font-bold py-1">مبيعات الدين:</td>
        <td class="py-1">${formatCurrency(report.totalDebtSales)}</td>
      </tr>
      <tr>
        <td class="font-bold py-1">النقد في الصندوق:</td>
        <td class="py-1">${formatCurrency(report.cashInDrawer)}</td>
      </tr>
      <tr>
        <td class="font-bold py-1">الفرق (${report.cashShortage >= 0 ? 'فائض' : 'عجز'}):</td>
        <td class="py-1">${formatCurrency(Math.abs(report.cashShortage))}</td>
      </tr>
    </table>
    
    ${report.notes ? `
      <div class="border-t pt-2 mt-2">
        <p class="font-bold">ملاحظات:</p>
        <p>${report.notes}</p>
      </div>
    ` : ''}
  `;
  
  container.innerHTML = content;
  document.body.appendChild(container);
  
  const options = {
    margin: [10, 10, 10, 10],
    filename: `تقرير_نهاية_الدوام_${new Date(report.date).toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().from(container).set(options).save().then(() => {
    document.body.removeChild(container);
  });
};

// Get all debtors with their total debts
export const getAllDebtors = (sales: Sale[]) => {
  const debtors = new Map();
  
  sales.forEach(sale => {
    if (sale.isDebt && !sale.isFrozen && sale.debtorName) {
      const debtorName = sale.debtorName;
      if (!debtors.has(debtorName)) {
        debtors.set(debtorName, {
          name: debtorName,
          totalDebt: 0,
          sales: []
        });
      }
      
      const debtor = debtors.get(debtorName);
      debtor.totalDebt += sale.finalTotal;
      debtor.sales.push(sale);
    }
  });
  
  return Array.from(debtors.values());
};

// Get shift reports by date range
export const getShiftReportsByDateRange = (
  reports: ShiftReport[],
  startDate: Date,
  endDate: Date
): ShiftReport[] => {
  return reports.filter((report) => {
    const reportDate = new Date(report.date);
    return reportDate >= startDate && reportDate <= endDate;
  });
};
