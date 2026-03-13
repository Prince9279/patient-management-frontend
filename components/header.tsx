'use client';

export function Header({ totalPatients }: { totalPatients: number }) {
  return (
    <div className="relative w-full bg-gradient-to-r from-[#4A90E2] to-[#357ABD] overflow-hidden">
  
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <g fill="rgba(255, 255, 255, 0.3)">
              
                <rect x="30" y="8" width="20" height="64" />
                <rect x="8" y="30" width="64" height="20" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-pattern)" />
        </svg>
      </div>

  
      <div className="relative z-10 px-6 py-8 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Patient Directory</h1>
        <p className="text-blue-100">{totalPatients} Patient Found</p>
      </div>
    </div>
  );
}
