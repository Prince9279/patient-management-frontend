'use client';

import { Patient } from '@/app/api/patients/route';
import { Phone, Mail, MapPin } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { formatPatientId } from '@/lib/format';

interface PatientCardProps {
  patient: Patient;
}

import { getIssueBadgeClasses } from '@/lib/issueColors';


export function PatientCard({ patient }: PatientCardProps) {
  const contact = patient.contact[0];

  return (
    <div className="w-full min-w-0 flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
  
      <div className="flex flex-wrap items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar
          src={patient.photo_url}
          alt={patient.patient_name}
          size={48}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {patient.patient_name}
          </h3>
          <p className="text-xs text-gray-500">
            {formatPatientId(patient.patient_id)}
          </p>
        </div>
        </div>
     
        <span className="ml-2 mt-2 sm:mt-0 inline-flex items-center rounded-full bg-[#4A90E2] px-3 py-1 text-xs font-semibold text-white flex-shrink-0">
          Age {patient.age}
        </span>
      </div>

   
      <div className="mb-4">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getIssueBadgeClasses(patient.medical_issue)}`}>
          {patient.medical_issue}
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-700 flex-1">
        {contact.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
            <span className="line-clamp-1">{contact.address}</span>
          </div>
        )}
        {contact.number && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{contact.number}</span>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
