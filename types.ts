export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Invoice {
  id: string; // Internal ID for localStorage
  number: string;
  date: string;
  dueDate: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'CHF' | 'CFA';
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  taxRate: number;
  discountRate: number;
  notes: string;
}

export type InvoiceSavedSummary = Pick<Invoice, 'id' | 'number' | 'client' | 'date' | 'currency'> & { total: number };
