import type { Tenant, OrganizationStatus } from '../types';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { SuperAdminCreateTenant } from "./SuperAdminCreateTenant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SuperAdminTenantDetailProps {
  tenant: Tenant;
  onBack: () => void;
}

export function SuperAdminTenantDetail({ tenant, onBack }: SuperAdminTenantDetailProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      {/* Back Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6 transition-colors font-medium cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tenant List
      </button>

      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-neutral-900">{tenant.orgName}</h1>
            <StatusBadge status={tenant.status} />
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="font-medium">ID: {tenant.id}</span>
            <span>•</span>
            <span>Created {tenant.createdDate}</span>
            <span>•</span>
            <span>{tenant.region || '-'}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditOpen(true)}
          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Organization
        </button>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="mb-8 bg-neutral-100 p-1 rounded-lg inline-flex max-w-full overflow-x-auto">
          <TabsTrigger value="overview" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-emerald-500 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm transition-all cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="features" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-emerald-500 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm transition-all cursor-pointer">Features & Integrations</TabsTrigger>
          <TabsTrigger value="settings" className="px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-emerald-500 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm transition-all cursor-pointer">Settings & Actions</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard label="Total Users" value={(tenant.userCount || 0).toString()} />
            <SummaryCard label="Total Exchanges" value={(tenant.exchangeCount || 0).toString()} />
            <SummaryCard label="Data Region" value={tenant.region || '-'} />
            <SummaryCard label="Admin Email" value={tenant.adminEmail || '-'} isSmall />
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Organization Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              <DetailRow label="Organization Name" value={tenant.orgName} />
              <DetailRow label="Organization ID" value={tenant.id} />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-neutral-500">Data Residency</span>
                <Select defaultValue={tenant.region}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US-East">US-East</SelectItem>
                    <SelectItem value="US-West">US-West</SelectItem>
                    <SelectItem value="EU-West">EU-West</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DetailRow label="Admin Email" value={tenant.adminEmail} />
            </div>
          </div>
        </TabsContent>

        {/* Features Tab Content */}
        <TabsContent value="features">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Enabled Features</h3>
            <div className="space-y-4">
              <FeatureRow 
                icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                title="E-Signature"
                description="Digital document signing capabilities"
                enabled={true}
              />
              <FeatureRow 
                icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                title="AI Risk Analysis"
                description="Automated risk assessment for documents"
                enabled={false}
              />
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="settings">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Platform Actions</h3>
            
            <div className="space-y-4">
              <ActionRow 
                title="Update Organization Settings"
                description="Modify global configuration and defaults"
              />
              <ActionRow 
                title="Modify Security Profile"
                description="SSO, 2FA, and password policies"
              />
              <ActionRow 
                title="View Platform Audit Log"
                description="System-level events for this tenant"
              />
              
              <div className="pt-4">
                <button className="w-full flex items-center justify-between p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-all group cursor-pointer">
                  <div className="text-left">
                    <div className="text-base font-semibold text-red-700">Suspend Organization</div>
                    <div className="text-sm text-red-500 mt-0.5">Temporarily disable all access</div>
                  </div>
                  <svg className="w-5 h-5 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Organization Drawer */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="w-full sm:w-[540px] sm:max-w-none overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Edit Organization</SheetTitle>
            <SheetDescription>Update organization details and settings.</SheetDescription>
          </SheetHeader>
          <SuperAdminCreateTenant 
            initialData={tenant}
            isEdit={true}
            onBack={() => setIsEditOpen(false)}
            onCreate={() => setIsEditOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Subcomponents

function StatusBadge({ status }: { status: OrganizationStatus }) {
  const styles: Record<OrganizationStatus, string> = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-neutral-100 text-neutral-600',
    Suspended: 'bg-amber-100 text-amber-700',
  };
  const dotStyles: Record<OrganizationStatus, string> = {
    Active: 'bg-green-600',
    Inactive: 'bg-neutral-500',
    Suspended: 'bg-amber-600',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}

function SummaryCard({ label, value, isSmall = false }: { label: string; value: string; isSmall?: boolean }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-500 mb-1">{label}</div>
      <div className={`${isSmall ? 'text-lg truncate' : 'text-2xl'} font-semibold text-neutral-900`} title={value}>
        {value}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <span className="text-base text-neutral-900">{value}</span>
    </div>
  );
}

function ActionRow({ title, description }: { title: string; description: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-sm transition-all text-left group cursor-pointer">
      <div>
        <div className="text-base font-semibold text-neutral-900">{title}</div>
        <div className="text-sm text-neutral-500 mt-0.5">{description}</div>
      </div>
      <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function FeatureRow({ icon, title, description, enabled }: { icon: React.ReactNode; title: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-neutral-50 rounded-lg">
          {icon}
        </div>
        <div>
          <div className="text-base font-semibold text-neutral-900">{title}</div>
          <div className="text-sm text-neutral-500">{description}</div>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${enabled ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
        {enabled ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
}
