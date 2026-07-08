
import React, { useState } from 'react';
import { ReceiptData, NotaData, Theme } from './types';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import NotaForm from './components/NotaForm';
import NotaPreview from './components/NotaPreview';
import PreviewWrapper from './components/PreviewWrapper';
import { useLocalStorage } from './hooks/useLocalStorage';

// TypeScript declarations for libraries loaded via CDN
declare const html2canvas: any;
declare global {
  interface Window {
    jspdf: any;
  }
}

const initialReceiptData: ReceiptData = {
  nomor: '001/INV/2024',
  diterimaDari: 'PT. Sukses Selalu',
  uangSejumlah: 'Lima Juta Rupiah',
  untukPembayaran: 'Jasa Pembuatan Website',
  jumlah: 5000000,
  penerima: 'Budi Santoso',
  tempat: 'Jakarta',
  tanggal: new Date().toISOString().split('T')[0],
  logo: '/logo.png',
  tandaTangan: '/signature.png',
};

const initialNotaData: NotaData = {
  nomor: 'NT-001/2024',
  kepada: 'Pelanggan Yth.',
  tanggal: new Date().toISOString().split('T')[0],
  items: [
    { id: crypto.randomUUID(), deskripsi: 'Hosting & Domain (1 Tahun)', kuantitas: 1, harga: 750000 },
    { id: crypto.randomUUID(), deskripsi: 'Jasa Desain Website', kuantitas: 1, harga: 4250000 },
  ],
  diskon: 0,
  logo: '/logo.png',
  tandaTangan: '/signature.png',
  hormatKami: 'Manajemen',
};


function App() {
  const [receiptData, setReceiptData] = useLocalStorage<ReceiptData>('receiptData', initialReceiptData);
  const [notaData, setNotaData] = useLocalStorage<NotaData>('notaData', initialNotaData);
  const [theme, setTheme] = useLocalStorage<Theme>('documentTheme', 'classic');
  const [activeTab, setActiveTab] = useState<'kuitansi' | 'nota'>('kuitansi');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    const elementId = activeTab === 'kuitansi' ? 'receipt-preview' : 'nota-preview';
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`${activeTab} preview element not found!`);
        return;
    }

    setIsExporting(true);

    html2canvas(element, { 
      scale: 2, // scale 2 is enough for A4 printing and faster
      windowWidth: 1200, // ensure viewport is wide enough
      onclone: (clonedDoc) => {
        // Find the wrapper in the cloned document and remove the scale transform
        // to prevent html2canvas text squishing bug
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement && clonedElement.parentElement) {
            clonedElement.parentElement.style.transform = 'none';
        }
      }
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        // A4 portrait
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = pdfWidth / imgWidth;
        const pdfHeight = imgHeight * ratio;
        
        let heightLeft = pdfHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }
        
        const fileName = activeTab === 'kuitansi' 
            ? `Kuitansi-${receiptData.nomor.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`
            : `Nota-${notaData.nomor.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`;

        pdf.save(fileName);
      })
      .catch(err => {
        console.error("Error exporting PDF:", err);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };


  return (
    <div className={`min-h-screen pb-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-900 transition-colors duration-300 font-sans`}>
      <header className={`no-print sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 p-4 ${theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : ''}`}>
        <div className="container mx-auto max-w-7xl">
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Online Document Generator</h1>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Buat Kuitansi atau Nota secara real-time.</p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        <div className="no-print">
          <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ring-1 ring-black/5`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200/50 pb-4 mb-6 gap-4">
              {/* iOS style segmented control */}
              <div className="flex bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto">
                <button onClick={() => setActiveTab('kuitansi')} className={`flex-1 py-1.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'kuitansi' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}>
                    Kuitansi
                </button>
                <button onClick={() => setActiveTab('nota')} className={`flex-1 py-1.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'nota' ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}>
                    Nota
                </button>
              </div>
              <div className="w-full sm:w-auto">
                <label htmlFor="theme" className="sr-only">Tema</label>
                 <select
                    id="theme"
                    name="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as Theme)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-gray-100/80 text-sm font-medium rounded-xl border-0 focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none cursor-pointer"
                  >
                    <option value="classic">Klasik</option>
                    <option value="dark">Gelap</option>
                    <option value="modernBlue">Modern Biru</option>
                  </select>
              </div>
            </div>
            
            {activeTab === 'kuitansi' ? (
              <ReceiptForm data={receiptData} setData={setReceiptData} />
            ) : (
              <NotaForm data={notaData} setData={setNotaData} />
            )}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start">
            <h2 className={`text-2xl font-semibold mb-4 text-center lg:text-left no-print ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Preview {activeTab === 'kuitansi' ? 'Kuitansi' : 'Nota'}
            </h2>
            <div className="w-full">
              <PreviewWrapper>
                {activeTab === 'kuitansi' ? (
                  <ReceiptPreview data={receiptData} theme={theme} />
                ) : (
                  <NotaPreview data={notaData} theme={theme} />
                )}
              </PreviewWrapper>
            </div>
            <div className="mt-8 text-center lg:text-left no-print w-full flex justify-center lg:justify-start">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-lg py-3.5 px-8 rounded-2xl shadow-sm shadow-blue-500/30 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export as PDF
                  </>
                )}
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
