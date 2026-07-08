
import React from 'react';
import type { ReceiptData } from '../types';
import ImageUploader from './ImageUploader';

interface ReceiptFormProps {
  data: ReceiptData;
  setData: React.Dispatch<React.SetStateAction<ReceiptData>>;
}

const InputField: React.FC<{ label: string; value: string | number; name: keyof ReceiptData; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = ({ label, value, name, onChange, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
    />
  </div>
);

const ReceiptForm: React.FC<ReceiptFormProps> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };
  
  const handleImageUpload = (field: 'logo' | 'tandaTangan') => (file: string | null) => {
    setData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <div className="space-y-4">
       <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Formulir Kuitansi</h2>

      <InputField label="Nomor Kuitansi" name="nomor" value={data.nomor} onChange={handleChange} />
      <div>
        <label htmlFor="infoPerusahaan" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Info Perusahaan (Alamat / No. Telp)</label>
        <textarea
          id="infoPerusahaan"
          name="infoPerusahaan"
          value={data.infoPerusahaan || ''}
          onChange={handleChange}
          rows={3}
          placeholder="Alamat lengkap, No. Telp, dll."
          className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>
      <InputField label="Telah Terima Dari" name="diterimaDari" value={data.diterimaDari} onChange={handleChange} />
      <InputField label="Uang Sejumlah (Terbilang)" name="uangSejumlah" value={data.uangSejumlah} onChange={handleChange} placeholder="Contoh: Satu Juta Rupiah" />
       <div>
        <label htmlFor="untukPembayaran" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Untuk Pembayaran</label>
        <textarea
          id="untukPembayaran"
          name="untukPembayaran"
          value={data.untukPembayaran}
          onChange={handleChange}
          rows={3}
          placeholder="Masukkan detail pembayaran"
          className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-y"
        />
      </div>
      <InputField label="Jumlah (Rp)" name="jumlah" value={data.jumlah} onChange={handleChange} type="number" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Tempat" name="tempat" value={data.tempat} onChange={handleChange} />
        <InputField label="Tanggal" name="tanggal" value={data.tanggal} onChange={handleChange} type="date" />
      </div>
       <InputField label="Nama Penerima" name="penerima" value={data.penerima} onChange={handleChange} placeholder="Nama untuk tanda tangan" />
      
      <div>
        <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Catatan Tambahan</label>
        <textarea
          id="catatan"
          name="catatan"
          value={data.catatan || ''}
          onChange={handleChange}
          rows={2}
          placeholder="Catatan untuk pelanggan..."
          className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-4">
          <ImageUploader label="Upload Logo" onUpload={handleImageUpload('logo')} currentImage={data.logo} />
          <ImageUploader label="Upload Tanda Tangan" onUpload={handleImageUpload('tandaTangan')} currentImage={data.tandaTangan} />
      </div>
    </div>
  );
};

export default ReceiptForm;
