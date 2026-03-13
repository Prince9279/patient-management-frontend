export interface Contact {
  address?: string;
  number?: string;
  email?: string;
}

export interface Patient {
  patient_id: number;
  patient_name: string;
  age: number;
  photo_url: string | null;
  contact: Contact[];
  medical_issue: string;
}

export interface PaginatedResponse {
  patients: Patient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  search: string;
  minAge: number | null;
  maxAge: number | null;
  medicalIssue: string;
  sortBy: 'patient_name' | 'age';
  sortOrder: 'asc' | 'desc';
}
