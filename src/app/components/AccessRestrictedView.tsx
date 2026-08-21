import { ShieldAlert } from 'lucide-react';

export function AccessRestrictedView() {
  return (
    <div className="flex items-center justify-center h-full p-4 sm:p-8">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
          Access Restricted
        </h2>
        
        <p className="text-neutral-600 mb-6">
          You do not have permission to access this section. Settings and administrative functions are restricted to Tenant Admin roles.
        </p>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
          <div className="font-medium text-blue-900 mb-2">Your Role: Primary Operations User</div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Full operational access to workspaces and exchanges</li>
            <li>• Create and manage documents and E-Sign packets</li>
            <li>• View audit logs and evidence packages</li>
            <li>• No access to Settings or destructive actions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}