import { OrgSettings } from './settings/OrgSettings';
import { RolesSettings } from './settings/RolesSettings';
import { UsersSettings } from './settings/UsersSettings';
import { IntegrationsSettings } from './settings/IntegrationsSettings';

export type SettingsTab = 'org' | 'roles' | 'users' | 'integrations';

interface SettingsViewProps {
  activeTab?: SettingsTab;
}

export function SettingsView({ activeTab = 'org' }: SettingsViewProps) {
  const components = {
    org: OrgSettings,
    roles: RolesSettings,
    users: UsersSettings,
    integrations: IntegrationsSettings
  };

  const ActiveComponent = components[activeTab] || OrgSettings;

  return (
    <div className="flex-1 overflow-y-auto h-full bg-neutral-50">
      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 pb-20">
        <ActiveComponent />
      </div>
    </div>
  );
}
