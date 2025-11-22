import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';
import { CURRENCIES } from '../constants';
import { Input } from './Input';
import { Button } from './Button';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onChange }) => {
  
  const updateCompany = (field: string, value: string) => {
    onChange({ ...invoice, company: { ...invoice.company, [field]: value } });
  };

  const updateClient = (field: string, value: string) => {
    onChange({ ...invoice, client: { ...invoice.client, [field]: value } });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({ ...invoice, items: [...invoice.items, newItem] });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = invoice.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...invoice, items: newItems });
  };

  const removeItem = (id: string) => {
    if (invoice.items.length > 1) {
        onChange({ ...invoice, items: invoice.items.filter((item) => item.id !== id) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Settings Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            Paramètres Généraux
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input 
            label="Numéro" 
            value={invoice.number} 
            onChange={(e) => onChange({ ...invoice, number: e.target.value })} 
          />
          <Input 
            label="Date d'émission" 
            type="date" 
            value={invoice.date} 
            onChange={(e) => onChange({ ...invoice, date: e.target.value })} 
          />
           <Input 
            label="Date de validité" 
            type="date" 
            value={invoice.dueDate} 
            onChange={(e) => onChange({ ...invoice, dueDate: e.target.value })} 
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider ml-1">Devise</label>
            <select
              value={invoice.currency}
              onChange={(e) => onChange({ ...invoice, currency: e.target.value as any })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm [&>option]:bg-slate-800"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Votre Entreprise
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nom de l'entreprise" value={invoice.company.name} onChange={(e) => updateCompany('name', e.target.value)} placeholder="Ex: Mon Entreprise SARL" />
          <Input label="Email" value={invoice.company.email} onChange={(e) => updateCompany('email', e.target.value)} />
          <Input label="Adresse" value={invoice.company.address} onChange={(e) => updateCompany('address', e.target.value)} className="md:col-span-2" />
          <Input label="Ville" value={invoice.company.city} onChange={(e) => updateCompany('city', e.target.value)} />
          <Input label="Code Postal" value={invoice.company.zip} onChange={(e) => updateCompany('zip', e.target.value)} />
          <Input label="Pays" value={invoice.company.country} onChange={(e) => updateCompany('country', e.target.value)} />
          <Input label="Téléphone" value={invoice.company.phone} onChange={(e) => updateCompany('phone', e.target.value)} />
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
            Information Client
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nom du client" value={invoice.client.name} onChange={(e) => updateClient('name', e.target.value)} placeholder="Ex: Jean Dupont" />
          <Input label="Email" value={invoice.client.email} onChange={(e) => updateClient('email', e.target.value)} />
          <Input label="Adresse" value={invoice.client.address} onChange={(e) => updateClient('address', e.target.value)} className="md:col-span-2" />
          <Input label="Ville" value={invoice.client.city} onChange={(e) => updateClient('city', e.target.value)} />
          <Input label="Code Postal" value={invoice.client.zip} onChange={(e) => updateClient('zip', e.target.value)} />
          <Input label="Pays" value={invoice.client.country} onChange={(e) => updateClient('country', e.target.value)} />
          <Input label="Téléphone" value={invoice.client.phone} onChange={(e) => updateClient('phone', e.target.value)} />
        </div>
      </div>

      {/* Items */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Articles & Services
        </h3>
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
              <div className="col-span-12 md:col-span-6">
                <Input 
                  label={index === 0 ? "Description" : ""}
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                  placeholder="Description du produit ou service"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input 
                   label={index === 0 ? "Quantité" : ""}
                  type="number" 
                  min="0"
                  value={item.quantity} 
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} 
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                 <Input 
                   label={index === 0 ? "Prix Unitaire" : ""}
                  type="number" 
                  min="0"
                  step="0.01"
                  value={item.unitPrice} 
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} 
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end pb-2">
                <Button 
                    variant="danger" 
                    onClick={() => removeItem(item.id)}
                    className="p-2 aspect-square flex items-center justify-center"
                    title="Supprimer"
                    disabled={invoice.items.length === 1}
                >
                    <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addItem} variant="secondary" className="w-full mt-4" icon={<Plus size={16}/>}>
            Ajouter un article
          </Button>
        </div>
      </div>

      {/* Totals & Notes */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
            Totaux & Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <Input 
                    label="Notes / Conditions de paiement" 
                    as="textarea"
                    value={invoice.notes} 
                    onChange={(e) => onChange({ ...invoice, notes: e.target.value })} 
                />
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <Input 
                        label="Taux de TVA (%)" 
                        type="number"
                        min="0"
                        max="100"
                        value={invoice.taxRate} 
                        onChange={(e) => onChange({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })} 
                    />
                     <Input 
                        label="Remise Globale (%)" 
                        type="number"
                        min="0"
                        max="100"
                        value={invoice.discountRate} 
                        onChange={(e) => onChange({ ...invoice, discountRate: parseFloat(e.target.value) || 0 })} 
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
