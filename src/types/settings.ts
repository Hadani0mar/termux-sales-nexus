
export interface Settings {
  businessName: string;
  receiptFooter: string;
  theme: 'light' | 'dark';
  location: string;
  shouldApplyTax: boolean;
  authorizedDebtors: Array<{ name: string; phone?: string; limit?: number; notes?: string }>;
}

export const defaultSettings: Settings = {
  businessName: "نورا للمنظفات",
  receiptFooter: "شكراً لزيارتكم - سبها",
  theme: 'light',
  location: "سبها",
  shouldApplyTax: false,
  authorizedDebtors: []
};
