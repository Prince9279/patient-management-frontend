'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Patient, PaginatedResponse } from '@/app/api/patients/route';
import { PatientCard } from '@/components/patient-card';
import { PatientRow } from '@/components/patient-row';
import { SearchFilters, FilterParams } from '@/components/search-filters';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LayoutGrid, LayoutList, Download, ArrowUpDown } from 'lucide-react';


type ViewType = 'card' | 'row';


export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('card');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    minAge: null,
    maxAge: null,
    medicalIssue: '',
    sortBy: 'patient_name',
    sortOrder: 'asc',
  });
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [medicalIssues, setMedicalIssues] = useState<string[]>([]);

  
  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const response = await fetch('/api/patients?pageSize=10000');
        const data: PaginatedResponse = await response.json();
        setAllPatients(data.patients);
        
       
        const issues = Array.from(
          new Set(data.patients.map((p) => p.medical_issue))
        ).sort();
        setMedicalIssues(issues);
      } catch (err) {
        console.error('Error fetching all patients:', err);
      }
    };

    fetchAllPatients();
  }, []);


  const fetchPatients = useCallback(
    async (filterParams: FilterParams) => {
      setLoading(true);
      setError(null);
      try {
        // Build query parameters from filters
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          search: filterParams.search || '',
          minAge: filterParams.minAge?.toString() || '',
          maxAge: filterParams.maxAge?.toString() || '',
          medicalIssue: filterParams.medicalIssue || '',
          sortBy: filterParams.sortBy,
          sortOrder: filterParams.sortOrder,
        });

        const response = await fetch(`/api/patients?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        
        const data: PaginatedResponse = await response.json();
        setPatients(data.patients);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  
  useEffect(() => {
    fetchPatients(filters);
  }, [filters, page, fetchPatients]);

  const handleFilterChange = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1); 
  }, []);

  const displayPatients = viewType === 'card' ? patients : patients;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header totalPatients={total} />

      {/* Main Content */}
      <div className="px-6 py-8 sm:px-8 md:px-12 max-w-7xl mx-auto">
        {/* View Toggle and Info Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 border-b border-gray-300 pb-2">
            <button
              onClick={() => setViewType('row')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                viewType === 'row'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewType('card')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                viewType === 'card'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Card View
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-gray-600">
              Active Filters: {[
                filters.search ? 1 : 0,
                filters.minAge !== null ? 1 : 0,
                filters.maxAge !== null ? 1 : 0,
                filters.medicalIssue ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
            <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Download className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

      
        <div className="mb-6">
          <SearchFilters onSearch={handleFilterChange} medicalIssues={medicalIssues} />
        </div>

    
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="text-gray-600 text-sm">Active Filters: {filters.search || filters.minAge || filters.maxAge || filters.medicalIssue ? Object.values(filters).filter(Boolean).length : 0}</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 font-medium">Sort by:</span>
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1"
            >
              <option value="patient_name">Name</option>
              <option value="age">Age</option>
              <option value="patient_id">ID</option>
            </select>
            <button
              onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
              className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

      
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        )}


        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Error Loading Patients</h3>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        
        {!loading && !error && patients.length > 0 && (
          <>
            {viewType === 'card' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                {displayPatients.map((patient) => (
                  <PatientCard key={patient.patient_id} patient={patient} />
                ))}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-x-auto mb-8">
            
                <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-4 bg-gray-50 text-sm font-semibold text-gray-900 min-w-max md:min-w-full">
                  <div className="w-12 md:w-20">ID</div>
                  <div className="w-32 md:w-40">Name</div>
                  <div className="w-12 md:w-16">Age</div>
                  <div className="w-28 md:w-32">Issue</div>
                  <div className="w-32 md:flex-1 hidden md:block">Address</div>
                  <div className="w-28 md:w-32">Phone</div>
                  <div className="w-32 md:w-40">Email</div>
                </div>
              
                {displayPatients.map((patient) => (
                  <PatientRow key={patient.patient_id} patient={patient} />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !error && patients.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg font-medium mb-2">No patients found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search filters or clear them to see all patients</p>
            {Object.values(filters).some(v => v) && (
              <button 
                onClick={() => handleFilterChange({
                  search: '',
                  minAge: null,
                  maxAge: null,
                  medicalIssue: '',
                  sortBy: 'patient_name',
                  sortOrder: 'asc',
                })}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

   
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return pageNum;
            }).map((pageNum, idx, arr) => {
              
              if (idx > 0 && arr[idx - 1] === pageNum) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 text-sm rounded font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-[#4A90E2] text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
