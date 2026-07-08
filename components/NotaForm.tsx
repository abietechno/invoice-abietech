
import React from 'react';
import type { NotaData, NotaItem } from '../types';
import ImageUploader from './ImageUploader';

interface NotaFormProps {
  data: NotaData;
  setData: React.Dispatch<React.SetStateAction<NotaData>>;
}

const InputField: React.FC<{ label: string; value: string | number; name: keyof NotaData; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = ({ label, value, name, onChange, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={`nota-${name}`} className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{label}</label>
    <input
      type={type}
      id={`nota-${name}`}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
    />
  </div>
);

const NotaForm: React.FC<NotaFormProps> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleImageUpload = (field: 'logo' | 'tandaTangan') => (file: string | null) => {
    setData(prev => ({ ...prev, [field]: file }));
  };

  const handleItemChange = (id: string, field: keyof NotaItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), deskripsi: '', kuantitas: 1, harga: 0 }],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Formulir Nota</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nomor Nota" name="nomor" value={data.nomor} onChange={handleChange} />
        <InputField label="Tanggal" name="tanggal" value={data.tanggal} onChange={handleChange} type="date" />
      </div>
      <InputField label="Kepada Yth." name="kepada" value={data.kepada} onChange={handleChange} />
      
      <div>
        <label htmlFor="nota-infoPerusahaan" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Info Perusahaan (Alamat / No. Telp)</label>
        <textarea
          id="nota-infoPerusahaan"
          name="infoPerusahaan"
          value={data.infoPerusahaan || ''}
          onChange={(e) => setData(prev => ({ ...prev, infoPerusahaan: e.target.value }))}
          placeholder="Alamat lengkap, No. Telp, dll."
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      <div className="pt-6 mt-2 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 ml-1">Detail Barang/Jasa</h3>
        <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          {data.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-2 items-center bg-white p-3 sm:p-0 rounded-xl sm:rounded-none sm:bg-transparent shadow-sm sm:shadow-none border border-gray-100 sm:border-0">
              <input
                type="text"
                placeholder="Deskripsi Barang / Jasa"
                value={item.deskripsi}
                onChange={(e) => handleItemChange(item.id, 'deskripsi', e.target.value)}
                className="col-span-1 sm:col-span-5 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full text-sm"
              />
              <div className="col-span-1 sm:col-span-7 grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Jml"
                  value={item.kuantitas}
                  onChange={(e) => handleItemChange(item.id, 'kuantitas', parseFloat(e.target.value) || 0)}
                  className="col-span-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full text-sm"
                />
                <input
                  type="number"
                  placeholder="Harga"
                  value={item.harga}
                  onChange={(e) => handleItemChange(item.id, 'harga', parseFloat(e.target.value) || 0)}
                  className="col-span-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full text-sm"
                />
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="col-span-1 bg-red-50 text-red-600 font-medium px-2 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm border border-red-100 w-full"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="w-full mt-2 bg-blue-50 text-blue-600 font-medium px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Baris
          </button>
        </div>
      </div>
      
      <InputField label="Diskon (Rp)" name="diskon" value={data.diskon} onChange={handleChange} type="number" />
      <InputField label="Hormat Kami (Penanda Tangan)" name="hormatKami" value={data.hormatKami} onChange={handleChange} placeholder="Nama untuk tanda tangan" />
      
      <div className="pt-4 border-t mt-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Informasi Pembayaran (Bank)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Nama Bank" name="namaBank" value={data.namaBank || ''} onChange={handleChange} placeholder="BCA / Mandiri / dll" />
          <InputField label="Nomor Rekening" name="nomorRekening" value={data.nomorRekening || ''} onChange={handleChange} placeholder="1234567890" />
          <InputField label="Atas Nama" name="namaRekening" value={data.namaRekening || ''} onChange={handleChange} placeholder="Nama Pemilik Rekening" />
        </div>
      </div>

      <div className="pt-4 border-t mt-4">
        <label htmlFor="nota-catatan" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Catatan Tambahan</label>
        <textarea
          id="nota-catatan"
          name="catatan"
          value={data.catatan || ''}
          onChange={(e) => setData(prev => ({ ...prev, catatan: e.target.value }))}
          placeholder="Catatan untuk pelanggan..."
          rows={2}
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

export default NotaForm;
