import { Invoice } from './types';

export const CURRENCIES = [
  { value: 'EUR', symbol: '€', label: 'Euro (EUR)' },
  { value: 'USD', symbol: '$', label: 'US Dollar (USD)' },
  { value: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
  { value: 'CHF', symbol: 'CHF', label: 'Swiss Franc (CHF)' },
  { value: 'CFA', symbol: 'FCFA', label: 'Franc CFA (XOF/XAF)' },
];

export const EMPTY_INVOICE: Invoice = {
  id: '',
  number: `PF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'EUR',
  company: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  },
  client: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  },
  items: [
    {
      id: '1',
      description: 'Consulting Services',
      quantity: 1,
      unitPrice: 0,
    },
  ],
  taxRate: 20,
  discountRate: 0,
  notes: 'Validité de l\'offre : 30 jours.\nPaiement : 50% à la commande, solde à la livraison.',
};
