'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Patient } from '@/app/api/patients/route';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail, MapPin, Download, AlertTriangle, AlertCircle, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

import { Avatar } from '@/components/avatar';
import { formatPatientId } from '@/lib/format';

import { getIssueBadgeClasses } from '@/lib/issueColors';


export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients?search=${patientId}`);
        const data = await response.json();
        const foundPatient = data.patients.find((p: Patient) => p.patient_id.toString() === patientId);
        
        if (foundPatient) {
          setPatient(foundPatient);
        } else {
          setError('Patient not found');
        }
      } catch (err) {
        setError('Failed to fetch patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>
          <div className="text-center py-12">
            <p className="text-gray-500">{error || 'Patient not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const contact = patient.contact[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between gap-8">
            
            <div className="flex gap-6">
              <Avatar
                src={patient.photo_url}
                alt={patient.patient_name}
                size={96}
              />

              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {patient.patient_name}
                  </h1>
                  <span className="text-sm text-gray-500">
                    {formatPatientId(patient.patient_id)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#A7F3D0] text-[#065F46] px-3 py-1 text-xs font-semibold">
                    Active Patient
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Female, {patient.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Blood Type: O+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>PCP: Dr. Sarah Smith</span>
                  </div>
                </div>
              </div>
            </div>

          
            <Button className="bg-[#4A90E2] hover:bg-[#357ABD] text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Profile
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
        
          <div className="col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">Vitals & Clinical Performance</h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
           
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 font-medium mb-2">Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">72</p>
                  <p className="text-xs text-gray-600 font-medium">bpm</p>
                  <p className="text-xs text-red-600 mt-2">↓ 2% from avg</p>
                  <p className="text-xs text-green-600">Normal Range</p>
                </div>

             
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 font-medium mb-2">BP</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">120/80</p>
                  <p className="text-xs text-gray-600 font-medium">mmHg</p>
                  <p className="text-xs text-red-600 mt-2">↓ 0.5% dec</p>
                </div>

                {/* Temperature */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 font-medium mb-2">Temp</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">98.6</p>
                  <p className="text-xs text-gray-600 font-medium">°F</p>
                  <p className="text-xs text-red-600 mt-2">↓ 0.5% dec</p>
                </div>

                {/* O2 Level */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 font-medium mb-2">O2 Level</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">98</p>
                  <p className="text-xs text-gray-600 font-medium">%</p>
                  <p className="text-xs text-gray-400 mt-2">Stable</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">Recent Activity Timeline</h2>
              </div>
              <div className="space-y-4">
                {/* Timeline Item 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs text-gray-500 font-medium">OCT 24, 2025</p>
                    <p className="font-semibold text-gray-900">Annual Physical Examination</p>
                    <p className="text-sm text-gray-600">Completed by Dr. Sarah Smith at City General Medical Center.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs text-gray-500 font-medium">OCT 18, 2025</p>
                    <p className="font-semibold text-gray-900">Blood Work Results Released</p>
                    <p className="text-sm text-gray-600">Cholesterol and lipid panel within normal limits. <span className="text-[#4A90E2] font-medium cursor-pointer">View Report</span></p>
                  </div>
                </div>

          
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold text-sm">Rx</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs text-gray-500 font-medium">OCT 12, 2025</p>
                    <p className="font-semibold text-gray-900">Medication Adjustment</p>
                    <p className="text-sm text-gray-600">Lisinopril dosage increased from 10mg to 20mg daily.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Clinical Alerts</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-[#FEE2E2] rounded-lg border border-[#FCA5A5] p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#7F1D1D]">Allergy: Penicillin</p>
                      <p className="text-sm text-[#7F1D1D] opacity-75">Severe reaction (anaphylaxis risk)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FEF3C7] rounded-lg border border-[#FCD34D] p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#92400E]">High Risk: Hypertension</p>
                      <p className="text-sm text-[#92400E] opacity-75">Family history of cardiac episodes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📋</span>
                <h2 className="text-lg font-bold text-gray-900">Medical Summary</h2>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
  
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Active Conditions</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Essential Hypertension</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Seasonal Allergies (Allergic Rhinitis)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Vitamin D Deficiency</span>
                    </li>
                  </ul>
                </div>

           
                <div className="h-px bg-gray-200"></div>

            
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Current Medications</p>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Lisinopril</p>
                        <p className="text-xs text-gray-600">20mg Oral Tablet, Daily</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Rx #45892</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Vitamin D3</p>
                        <p className="text-xs text-gray-600">2500 IU Once Daily</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">OTC</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Zyrtec</p>
                        <p className="text-xs text-gray-600">10mg As Needed</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">OTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
