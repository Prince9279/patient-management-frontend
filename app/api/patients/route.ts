import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * Contact information structure for a patient
 */
export interface Contact {
  address?: string;
  number?: string;
  email?: string;
}

/**
 * Patient data structure
 */
export interface Patient {
  patient_id: number;
  patient_name: string;
  age: number;
  photo_url: string | null;
  contact: Contact[];
  medical_issue: string;
}

/**
 * Paginated response structure with metadata
 */
export interface PaginatedResponse {
  patients: Patient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * GET endpoint for fetching paginated, filtered, and sorted patients
 * 
 * Query Parameters:
 * - page: Current page number (default: 1)
 * - pageSize: Number of items per page (default: 10)
 * - search: Search term for patient name, email, or phone (optional)
 * - minAge: Minimum age filter (optional)
 * - maxAge: Maximum age filter (optional)
 * - medicalIssue: Filter by medical issue (optional)
 * - sortBy: Sort field - 'patient_name' | 'age' | 'patient_id' (default: 'patient_name')
 * - sortOrder: Sort direction - 'asc' | 'desc' (default: 'asc')
 * 
 * Returns: PaginatedResponse with filtered and sorted patients
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') || '10'));
    
    // Parse filter parameters
    const search = searchParams.get('search')?.toLowerCase() || '';
    const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge') || '0') : null;
    const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge') || '100') : null;
    const medicalIssue = searchParams.get('medicalIssue')?.toLowerCase() || '';
    
    // Parse sort parameters
    const sortBy = searchParams.get('sortBy') || 'patient_name'; // patient_name, age, patient_id
    const sortOrder = searchParams.get('sortOrder') || 'asc'; // asc, desc

    // Load patient data from JSON file
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    let allPatients: Patient[] = JSON.parse(fileContent);

    // Apply filters to patient list
    // Filters: name/email/phone search, age range, medical issue
    allPatients = allPatients.filter((patient) => {
      const nameMatch =
        patient.patient_name.toLowerCase().includes(search) ||
        patient.contact[0]?.email?.toLowerCase().includes(search) ||
        patient.contact[0]?.number?.includes(search);

      const ageMatch =
        (minAge === null || patient.age >= minAge) &&
        (maxAge === null || patient.age <= maxAge);

      const medicalMatch =
        !medicalIssue ||
        patient.medical_issue.toLowerCase().includes(medicalIssue);

      // Return true if all applicable filters match
      return nameMatch && ageMatch && medicalMatch;
    });

    // Sort patients by specified field and order
    // Supported sort fields: patient_name, age, patient_id
    allPatients.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'age') {
        compareValue = a.age - b.age;
      } else if (sortBy === 'patient_id') {
        compareValue = a.patient_id - b.patient_id;
      } else {
        compareValue = a.patient_name.localeCompare(b.patient_name);
      }

      // Return negative for ascending, positive for descending
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    // Apply pagination to sorted and filtered results
    const total = allPatients.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const patients = allPatients.slice(startIdx, endIdx);

    // Return paginated response with metadata
    return NextResponse.json({
      patients,
      total,
      page,
      pageSize,
      totalPages,
    } as PaginatedResponse);
  } catch (error) {
    // Log error and return appropriate response
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients. Please try again later.' },
      { status: 500 }
    );
  }
}
