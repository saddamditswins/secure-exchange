import { useEffect } from 'react';
import { SuperAdminCreateTenant } from "./SuperAdminCreateTenant";

interface CreateOrganizationViewProps {
  onBack: () => void;
  onCreate: () => void;
}

export function CreateOrganizationView({
  onBack,
  onCreate,
}: CreateOrganizationViewProps) {
  useEffect(() => {
    // Add overflow: hidden to html tag when component mounts
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup when component unmounts
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex flex-col bg-[#153240]">
      <div className="px-4 py-3 border-b border-[#243F4D]">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-neutral-400 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#FFFFFF]">
              Create Organization
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Configure a new organization environment
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <SuperAdminCreateTenant
          onBack={onBack}
          onCreate={onCreate}
          isEdit={false}
          scrollable={false}
          className="flex-1 flex flex-col"
          contentClassName="p-4"
          theme="dark"
        />
      </div>
    </div>
  );
}
