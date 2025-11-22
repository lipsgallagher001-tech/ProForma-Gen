import React, { useState, useEffect } from 'react';
import { Download, Save, FolderOpen, Printer, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import { Invoice, InvoiceSavedSummary } from './types';
import { EMPTY_INVOICE } from './constants';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { Button } from './components/Button';

export default function App() {
  const [invoice, setInvoice] = useState<Invoice>(EMPTY_INVOICE);
  const [savedInvoices, setSavedInvoices] = useState<InvoiceSavedSummary[]>([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load list of saved invoices from localStorage on mount
  useEffect(() => {
    const loadSaved = () => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('invoice_'));
      const summaries: InvoiceSavedSummary[] = keys.map(key => {
        try {
          const inv = JSON.parse(localStorage.getItem(key) || '{}') as Invoice;
          const total = inv.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
          return {
            id: inv.id || key.replace('invoice_', ''),
            number: inv.number,
            client: inv.client,
            date: inv.date,
            currency: inv.currency,
            total
          };
        } catch (e) {
          return null;
        }
      }).filter((i): i is InvoiceSavedSummary => i !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setSavedInvoices(summaries);
    };
    loadSaved();
  }, [notification]); // Reload when saved

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    const id = invoice.id || Date.now().toString();
    const invoiceToSave = { ...invoice, id };
    localStorage.setItem(`invoice_${id}`, JSON.stringify(invoiceToSave));
    setInvoice(invoiceToSave);
    showNotification('Proforma sauvegardé avec succès !');
  };

  const handleLoad = (id: string) => {
    const raw = localStorage.getItem(`invoice_${id}`);
    if (raw) {
      setInvoice(JSON.parse(raw));
      setShowLoadModal(false);
      showNotification('Proforma chargé.');
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Êtes-vous sûr de vouloir supprimer ce proforma ?')) {
        localStorage.removeItem(`invoice_${id}`);
        setSavedInvoices(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleNew = () => {
    if(confirm('Créer un nouveau proforma ? Les modifications non sauvegardées seront perdues.')) {
        setInvoice({
            ...EMPTY_INVOICE,
            number: `PF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        });
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    const element = document.getElementById('invoice-preview');
    
    if (!element) {
        setIsExporting(false);
        return;
    }

    const opt = {
      margin: 0,
      filename: `Proforma-${invoice.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
        setTimeout(() => {
            // @ts-ignore
            window.html2pdf().set(opt).from(element).save().then(() => {
                setIsExporting(false);
                showNotification('PDF téléchargé !');
            }).catch((err: any) => {
                console.error(err);
                setIsExporting(false);
                alert("Une erreur est survenue lors de la génération du PDF.");
            });
        }, 100);
    } else {
        // Fallback
        window.print();
        setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-purple-500 selection:text-white font-sans print:bg-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-xl print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                    PF
                </div>
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ProForma Gen</span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                 <Button variant="ghost" onClick={handleNew} title="Nouveau" className="hidden md:flex">
                    <PlusCircle size={18} />
                    <span className="ml-2">Nouveau</span>
                </Button>
                <Button variant="secondary" onClick={() => setShowLoadModal(true)} title="Charger">
                    <FolderOpen size={18} />
                    <span className="ml-2 hidden md:inline">Charger</span>
                </Button>
                <Button variant="secondary" onClick={handleSave} title="Sauvegarder">
                    <Save size={18} />
                    <span className="ml-2 hidden md:inline">Sauvegarder</span>
                </Button>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <Button 
                    variant="primary" 
                    onClick={handleExportPDF} 
                    className="shadow-purple-500/20"
                    loading={isExporting}
                >
                    <Download size={18} />
                    <span className="ml-2 hidden md:inline">Télécharger PDF</span>
                </Button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-2 gap-8 print:block print:p-0 print:m-0">
        
        {/* Editor Column */}
        <div className="flex flex-col gap-6 print:hidden">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-white/5 border border-white/10">📝</span>
                    Éditeur
                </h2>
                <div className="text-sm text-slate-400">
                    Modifiez les détails ci-dessous
                </div>
            </div>
            <InvoiceForm invoice={invoice} onChange={setInvoice} />
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-24 h-fit print:static print:w-full">
             <div className="flex items-center justify-between mb-8 print:hidden">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-white/5 border border-white/10">👁️</span>
                    Aperçu
                </h2>
                <div className="text-sm text-slate-400">
                    Format A4
                </div>
            </div>
            <div className="print:w-full print:absolute print:top-0 print:left-0 print:m-0">
                <InvoicePreview invoice={invoice} />
            </div>
        </div>

      </main>

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/50">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Proformas sauvegardés</h3>
                    <button onClick={() => setShowLoadModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {savedInvoices.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            Aucun proforma sauvegardé pour le moment.
                        </div>
                    ) : (
                        savedInvoices.map(inv => (
                            <div key={inv.id} 
                                onClick={() => handleLoad(inv.id)}
                                className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 cursor-pointer transition-all"
                            >
                                <div>
                                    <div className="font-bold text-white mb-1">{inv.client.name || 'Client sans nom'}</div>
                                    <div className="text-sm text-slate-400 flex gap-3">
                                        <span>#{inv.number}</span>
                                        <span>•</span>
                                        <span>{new Date(inv.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="text-right">
                                        <div className="font-bold text-emerald-400">{inv.total.toFixed(2)} {inv.currency}</div>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(inv.id, e)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                 <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl">
                    <Button variant="secondary" className="w-full" onClick={() => setShowLoadModal(false)}>Fermer</Button>
                </div>
            </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-4">
            {notification}
        </div>
      )}
    </div>
  );
}