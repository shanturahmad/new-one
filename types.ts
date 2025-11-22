export interface CsvRow {
  "الاسم الرباعي"?: string;
  "رقم لهوية"?: string;
  "تاريخ الميلاد"?: string;
  "رقم الجوال"?: string;
  "ارفق صورة شخصية"?: string;
  "الإقليم"?: string;
  "الجامعة"?: string;
  "صفة المشاركة"?: string;
  [key: string]: any;
}

export interface Member {
  id: string; // Unique ID (internal)
  fullName: string;
  nationalId: string;
  birthDate: string;
  phoneNumber: string;
  photoUrl: string;
  region: string;
  university: string;
  role: string;
}

export type ParseResult = {
  data: CsvRow[];
  errors: any[];
  meta: any;
};