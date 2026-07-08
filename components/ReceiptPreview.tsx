import React from 'react';
import type { ReceiptData, Theme } from '../types';

interface ReceiptPreviewProps {
  data: ReceiptData;
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
    watermarkColor: 'rgba(0, 0, 0, 0.04)',
    amountBox: 'bg-gray-100 border-black',
  },
  dark: {
    container: 'bg-gray-800 text-gray-200',
    border: 'border-gray-500',
    watermarkColor: 'rgba(255, 255, 255, 0.05)',
    amountBox: 'bg-gray-700 border-gray-500',
  },
  modernBlue: {
    container: 'bg-white text-slate-800',
    border: 'border-blue-600',
    watermarkColor: 'rgba(60, 130, 240, 0.06)',
    amountBox: 'bg-blue-50 border-blue-600 text-blue-800',
  }
};

const generateWatermarkSvg = (text: string, color: string, theme: Theme) => {
  const fontFamily = "'Inter', sans-serif";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <text
      x="50%"
      y="50%"
      font-size="140"
      font-weight="bold"
      font-family="${fontFamily}"
      fill="${color}"
      text-anchor="middle"
      dominant-baseline="central"
      transform="rotate(-20 400 300)"
      style="user-select: none;"
    >
      ${text}
    </text>
  </svg>`;
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return `url("data:image/svg+xml;base64,${window.btoa(svg)}")`;
  }
  return 'none';
};


const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data, theme }) => {
  const currentTheme = themeStyles[theme] || themeStyles.classic;

  const watermarkStyle = {
    backgroundImage: generateWatermarkSvg('KUITANSI', currentTheme.watermarkColor, theme),
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '90% auto',
  };
    
  return (
    <div id="receipt-preview" className={`shadow-2xl w-[794px] min-h-[559px] shrink-0 text-black bg-white font-['Plus_Jakarta_Sans',sans-serif] ${currentTheme.container}`}>
      <div 
        className={`border-2 h-full min-h-[559px] flex flex-col p-8 relative ${currentTheme.border}`}
        style={watermarkStyle}
      >
        {/* Watermark is now a background SVG */}
        
        <div className={`flex justify-between items-start border-b-2 pb-4 z-10 ${currentTheme.border}`}>
          <div className="flex flex-col space-y-2">
            {data.logo && <img src={data.logo} alt="Logo" className="h-16 w-auto max-w-[200px]" />}
            {data.infoPerusahaan && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap max-w-xs">{data.infoPerusahaan}</p>
            )}
          </div>
          <div className="text-right flex flex-col items-end">
            <h1 className={`text-3xl font-serif font-bold tracking-widest uppercase mb-1 ${theme === 'modernBlue' ? 'text-blue-700' : 'text-gray-900'}`}>KUITANSI</h1>
            <div className="mt-2 text-right">
                <p className="font-bold text-gray-900">No.</p>
                <p className="text-xl font-bold text-gray-900">{data.nomor}</p>
            </div>
          </div>
        </div>

        <div className="flex-grow mt-8 space-y-5 text-lg z-10">
          <div className="flex">
            <p className="w-[30%] font-semibold shrink-0">Telah Terima Dari</p>
            <p className="w-[5%] text-center shrink-0">:</p>
            <p className="w-[65%] break-words">{data.diterimaDari}</p>
          </div>
          <div className="flex">
            <p className="w-[30%] font-semibold shrink-0">Uang Sejumlah</p>
            <p className="w-[5%] text-center shrink-0">:</p>
            <p className="w-[65%] italic break-words bg-gray-50/50 p-2 border border-gray-100 rounded inline-block">{data.uangSejumlah}</p>
          </div>
          <div className="flex">
            <p className="w-[30%] font-semibold shrink-0">Untuk Pembayaran</p>
            <p className="w-[5%] text-center shrink-0">:</p>
            <p className="w-[65%] break-words line-clamp-3">{data.untukPembayaran}</p>
          </div>
          {data.catatan && (
            <div className="flex">
              <p className="w-[30%] font-semibold shrink-0">Catatan Tambahan</p>
              <p className="w-[5%] text-center shrink-0">:</p>
              <p className="w-[65%] break-words line-clamp-2 text-gray-700 italic">{data.catatan}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-8 z-10">
          <div className={`border p-4 text-2xl font-bold ${currentTheme.amountBox}`}>
            {formatCurrency(data.jumlah)}
          </div>
          <div className="text-center w-1/3">
            <p>{data.tempat}, {formatDate(data.tanggal)}</p>
            <div className="h-24 flex items-center justify-center">
              {data.tandaTangan && <img src={data.tandaTangan} alt="Tanda Tangan" className="max-h-20 w-auto" />}
            </div>
            <p className={`border-t pt-1 mt-1 ${currentTheme.border}`}>{data.penerima}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;