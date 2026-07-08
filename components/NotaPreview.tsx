import React from 'react';
import type { NotaData, Theme } from '../types';

interface NotaPreviewProps {
  data: NotaData;
  theme: Theme;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    } catch (error) {
        return dateString; // fallback
    }
}

const themeStyles = {
  classic: {
    container: 'bg-white text-black',
    border: 'border-black',
    headerBg: 'bg-gray-100',
    tableHeader: 'bg-gray-200',
  },
  dark: {
    container: 'bg-gray-800 text-gray-200',
    border: 'border-gray-500',
    headerBg: 'bg-gray-700',
    tableHeader: 'bg-gray-600',
  },
  modernBlue: {
    container: 'bg-white text-slate-800',
    border: 'border-blue-600',
    headerBg: 'bg-blue-600 text-white',
    tableHeader: 'bg-blue-100 text-blue-800',
  }
};

const NotaPreview: React.FC<NotaPreviewProps> = ({ data, theme }) => {
  const currentTheme = themeStyles[theme] || themeStyles.classic;

  const subtotal = data.items.reduce((acc, item) => acc + item.kuantitas * item.harga, 0);
  const total = subtotal - data.diskon;

  return (
    <div id="nota-preview" className={`shadow-2xl w-[794px] min-h-[559px] shrink-0 text-black bg-white font-['Plus_Jakarta_Sans',sans-serif] ${currentTheme.container}`}>
      <div className={`border-2 h-full min-h-[559px] flex flex-col p-8 ${currentTheme.border}`}>
        
        <div className="flex justify-between items-start pb-6">
          <div className="flex flex-col space-y-2">
            {data.logo && <img src={data.logo} alt="Logo" className="h-16 w-auto max-w-[200px]" />}
            {data.infoPerusahaan && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap max-w-xs">{data.infoPerusahaan}</p>
            )}
          </div>
          <div className="text-right text-base flex flex-col items-end">
            <h1 className={`text-3xl font-serif font-bold tracking-widest uppercase mb-1 ${theme === 'modernBlue' ? 'text-blue-700' : 'text-gray-900'}`}>NOTA</h1>
            <p className="font-bold text-lg mt-2 text-gray-900">No: {data.nomor}</p>
            <p className="text-gray-900 font-medium">Tanggal: {formatDate(data.tanggal)}</p>
          </div>
        </div>

        <div className={`border-y-2 py-3 mb-6 text-base ${currentTheme.border}`}>
            <p className="font-bold text-gray-900">Kepada Yth. / <span className="font-normal italic">Invoiced to:</span></p>
            <p className="break-words line-clamp-2 text-lg font-bold text-gray-900 mt-1">{data.kepada}</p>
        </div>

        <div className="flex-grow text-base">
            <table className="w-full table-fixed">
                <thead className={`${currentTheme.tableHeader}`}>
                    <tr>
                        <th className="p-2 text-left font-semibold w-[45%]">Deskripsi</th>
                        <th className="p-2 text-center font-semibold w-[15%]">Jumlah</th>
                        <th className="p-2 text-right font-semibold w-[20%]">Harga Satuan</th>
                        <th className="p-2 text-right font-semibold w-[20%]">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="p-2 break-words text-ellipsis overflow-hidden align-top">{item.deskripsi}</td>
                            <td className="p-2 text-center align-top">{item.kuantitas}</td>
                            <td className="p-2 text-right align-top break-words">{formatCurrency(item.harga)}</td>
                            <td className="p-2 text-right align-top break-words">{formatCurrency(item.kuantitas * item.harga)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-between items-end mt-4">
            <div className="w-1/3 text-sm self-end pr-4">
                {(data.namaBank || data.nomorRekening || data.namaRekening) && (
                    <div className="border rounded-md p-3 bg-gray-50/50 mb-3">
                        <p className="font-semibold mb-1">Info Pembayaran:</p>
                        {data.namaBank && <p>Bank: {data.namaBank}</p>}
                        {data.nomorRekening && <p>No. Rek: <span className="font-mono">{data.nomorRekening}</span></p>}
                        {data.namaRekening && <p>A/N: {data.namaRekening}</p>}
                    </div>
                )}
                {data.catatan && (
                    <div className="text-gray-700 whitespace-pre-wrap italic">
                        <p className="font-semibold not-italic mb-1">Catatan:</p>
                        {data.catatan}
                    </div>
                )}
            </div>
            <div className="text-center w-1/3 self-end px-4">
                <p className="text-base">Hormat Kami,</p>
                <div className="h-20 flex items-center justify-center">
                {data.tandaTangan && <img src={data.tandaTangan} alt="Tanda Tangan" className="max-h-20 w-auto" />}
                </div>
                <p className={`border-t pt-1 mt-1 text-base font-medium ${currentTheme.border}`}>{data.hormatKami}</p>
            </div>
            <div className="w-1/3 text-base space-y-2 self-end pl-4">
                <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="text-right ml-2 break-words">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Diskon:</span>
                    <span className="text-right ml-2 break-words">{formatCurrency(data.diskon)}</span>
                </div>
                 <div className={`flex justify-between font-bold text-lg border-t pt-2 mt-2 ${currentTheme.border}`}>
                    <span>TOTAL:</span>
                    <span className="text-right ml-2 break-words">{formatCurrency(total)}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NotaPreview;