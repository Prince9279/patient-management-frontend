'use client';

import { Patient } from '@/app/api/patients/route';
import Link from 'next/link';

import { Avatar } from '@/components/avatar';
import { formatPatientId } from '@/lib/format';

interface PatientRowProps {
  patient: Patient;
}

import { getIssueBadgeClasses } from '@/lib/issueColors';


export function PatientRow({ patient }: PatientRowProps) {
  const contact = patient.contact[0];

  return (
    <Link href={`/patient/${patient.patient_id}`}>
      <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-4 hover:bg-gray-50 transition-colors text-sm cursor-pointer">
      {/* ID */}
      <div className="w-20 text-[#4A90E2] font-medium">
        {formatPatientId(patient.patient_id)}
      </div>

      <div className="flex items-center gap-3 w-40">
        <Avatar
          src={patient.photo_url}
          alt={patient.patient_name}
          size={40}
        />
        <span className="font-medium text-gray-900 truncate">{patient.patient_name}</span>
      </div>

  
      <div className="w-16 text-gray-700">
        {patient.age}
      </div>

     
      <div className="w-32">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getIssueBadgeClasses(patient.medical_issue)}`}>
          {patient.medical_issue}
        </span>
      </div>

  
      <div className="flex-1 text-gray-700 truncate">
        {contact.address || 'N/A'}
      </div>

 
      <div className="w-32 text-gray-700 truncate">
        {contact.number || 'N/A'}
      </div>

 
      <div className="w-40 text-gray-700 truncate">
        {contact.email || 'N/A'}
      </div>
      </div>
    </Link>
  );
}
