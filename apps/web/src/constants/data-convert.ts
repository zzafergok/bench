export type DataFormat = 'json' | 'csv' | 'yaml';

export const DATA_FORMATS: readonly DataFormat[] = ['json', 'csv', 'yaml'];

export const SAMPLE_DATA: Record<DataFormat, string> = {
  json: `[\n  { "id": 1, "isim": "Zafer Gök", "rol": "Geliştirici", "sehir": "İstanbul" },\n  { "id": 2, "isim": "Selin Aydın", "rol": "Tasarımcı", "sehir": "İzmir" },\n  { "id": 3, "isim": "Kaan Yılmaz", "rol": "Yönetici", "sehir": "Ankara" }\n]`,
  csv: `id,isim,rol,sehir\n1,Zafer Gök,Geliştirici,İstanbul\n2,Selin Aydın,Tasarımcı,İzmir\n3,Kaan Yılmaz,Yönetici,Ankara`,
  yaml: `- id: 1\n  isim: Zafer Gök\n  rol: Geliştirici\n  sehir: İstanbul\n- id: 2\n  isim: Selin Aydın\n  rol: Tasarımcı\n  sehir: İzmir\n- id: 3\n  isim: Kaan Yılmaz\n  rol: Yönetici\n  sehir: Ankara`,
};
