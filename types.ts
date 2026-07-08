
export interface ReceiptData {
  nomor: string;
  diterimaDari: string;
  uangSejumlah: string;
  untukPembayaran: string;
  jumlah: number;
  penerima: string;
  tempat: string;
  tanggal: string;
  logo: string | null;
  tandaTangan: string | null;
  infoPerusahaan?: string;
  catatan?: string;
}

export type Theme = 'classic' | 'dark' | 'modernBlue';

export interface NotaItem {
  id: string;
  deskripsi: string;
  kuantitas: number;
  harga: number;
}

export interface NotaData {
  nomor: string;
  kepada: string;
  tanggal: string;
  items: NotaItem[];
  diskon: number;
  logo: string | null;
  tandaTangan: string | null;
  hormatKami: string;
  namaBank?: string;
  nomorRekening?: string;
  namaRekening?: string;
  infoPerusahaan?: string;
  catatan?: string;
}
