import React from 'react';
import { Invoice } from '../types';
import { CURRENCIES } from '../constants';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const currencySymbol = CURRENCIES.find(c => c.value === invoice.currency)?.symbol || invoice.currency;

  const calculateItemTotal = (qty: number, price: number) => qty * price;
  const subtotal = invoice.items.reduce((acc, item) => acc + calculateItemTotal(item.quantity, item.unitPrice), 0);
  const discountAmount = subtotal * (invoice.discountRate / 100);
  const taxAmount = (subtotal - discountAmount) * (invoice.taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  return (
    <div className="bg-white text-slate-900 p-8 md:p-12 shadow-2xl rounded-sm min-h-[297mm] w-full max-w-[210mm] mx-auto relative overflow-hidden print:shadow-none print:m-0 print:w-full print:max-w-none print:h-auto print:rounded-none">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">PRO FORMA</h1>
          <p className="text-slate-500 font-medium">#{invoice.number}</p>
        </div>
        <div className="text-right">
            {invoice.company.name ? (
                <h2 className="text-xl font-bold text-slate-800">{invoice.company.name}</h2>
            ) : (
                <div className="text-slate-300 italic">Nom de votre entreprise</div>
            )}
            <div className="text-sm text-slate-600 mt-2 space-y-0.5">
                <p>{invoice.company.address}</p>
                <p>{invoice.company.zip} {invoice.company.city} {invoice.company.country}</p>
                <p>{invoice.company.phone}</p>
                <p>{invoice.company.email}</p>
            </div>
        </div>
      </div>

      {/* Client & Dates */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facturer à</h3>
          <div className="text-slate-800 font-semibold text-lg">{invoice.client.name || <span className="text-slate-300 italic">Nom du client</span>}</div>
          <div className="text-sm text-slate-600 mt-2 space-y-0.5">
            <p>{invoice.client.address}</p>
            <p>{invoice.client.zip} {invoice.client.city} {invoice.client.country}</p>
            <p>{invoice.client.phone}</p>
            <p>{invoice.client.email}</p>
          </div>
        </div>
        <div className="text-right space-y-3">
          <div className="flex justify-between md:justify-end gap-8 border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">Date d'émission:</span>
            <span className="font-semibold text-slate-800">{new Date(invoice.date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between md:justify-end gap-8 border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">Date de validité:</span>
            <span className="font-semibold text-slate-800">{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="text-left py-3 font-bold text-slate-800 w-1/2">Description</th>
              <th className="text-right py-3 font-bold text-slate-800">Qté</th>
              <th className="text-right py-3 font-bold text-slate-800">Prix Unit.</th>
              <th className="text-right py-3 font-bold text-slate-800">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className="py-4 text-slate-800 font-medium">{item.description}</td>
                <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                <td className="py-4 text-right text-slate-600">{item.unitPrice.toFixed(2)} {currencySymbol}</td>
                <td className="py-4 text-right font-semibold text-slate-800">
                  {calculateItemTotal(item.quantity, item.unitPrice).toFixed(2)} {currencySymbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} {currencySymbol}</span>
          </div>
          {invoice.discountRate > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Remise ({invoice.discountRate}%)</span>
              <span>-{discountAmount.toFixed(2)} {currencySymbol}</span>
            </div>
          )}
           {invoice.taxRate > 0 && (
            <div className="flex justify-between text-slate-600">
                <span>TVA ({invoice.taxRate}%)</span>
                <span>+{taxAmount.toFixed(2)} {currencySymbol}</span>
            </div>
           )}
          <div className="flex justify-between border-t-2 border-slate-800 pt-3 text-xl font-bold text-slate-900">
            <span>Total</span>
            <span>{total.toFixed(2)} {currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      {(invoice.notes) && (
        <div className="border-t border-slate-100 pt-8">
            <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Notes & Conditions</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Decorative Print Elements */}
      <div className="hidden print:block fixed bottom-4 left-0 w-full text-center text-xs text-slate-400">
        Généré par ProForma Gen
      </div>
    </div>
  );
};
