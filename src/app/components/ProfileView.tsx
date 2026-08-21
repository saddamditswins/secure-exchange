interface ProfileViewProps {
  userName: string;
  userRole: string;
  userEmail: string;
  orgName?: string;
}

export function ProfileView({ userName, userRole, userEmail, orgName }: ProfileViewProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-1">Profile</h1>
          <p className="text-sm text-neutral-600">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-neutral-900">Personal Information</h2>
              <button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer">
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Full Name</label>
                <div className="text-neutral-900">{userName}</div>
              </div>

              <div>
                <label className="block text-sm text-neutral-600 mb-1">Email Address</label>
                <div className="text-neutral-900">{userEmail}</div>
              </div>

              <div>
                <label className="block text-sm text-neutral-600 mb-1">Role</label>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-neutral-900">{userRole}</span>
                </div>
              </div>

              {orgName && (
                <div>
                  <label className="block text-sm text-neutral-600 mb-1">Organization</label>
                  <div className="text-neutral-900">{orgName}</div>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-neutral-900 mb-6">Security Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                <div>
                  <div className="text-sm text-neutral-900">Password</div>
                  <div className="text-sm text-neutral-600 mt-0.5">Last changed 30 days ago</div>
                </div>
                <button className="px-4 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                <div>
                  <div className="text-sm text-neutral-900">Two-Factor Authentication</div>
                  <div className="text-sm text-green-600 mt-0.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Enabled
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm text-neutral-900">Active Sessions</div>
                  <div className="text-sm text-neutral-600 mt-0.5">2 active sessions</div>
                </div>
                <button className="px-4 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                  View All
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-neutral-900 mb-6">Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                <div>
                  <div className="text-sm text-neutral-900">Security Alerts</div>
                  <div className="text-sm text-neutral-600 mt-0.5">Get notified about security events</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                <div>
                  <div className="text-sm text-neutral-900">Document Activity</div>
                  <div className="text-sm text-neutral-600 mt-0.5">Notifications for document views and downloads</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm text-neutral-900">Weekly Activity Summary</div>
                  <div className="text-sm text-neutral-600 mt-0.5">Receive weekly email with activity digest</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-sm text-neutral-900 mb-4">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center text-2xl text-neutral-700 mb-4">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="px-4 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                Upload New Photo
              </button>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-sm text-neutral-900 mb-4">Account Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Last Login</span>
                <span className="text-neutral-900">Today, 9:24 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Account Created</span>
                <span className="text-neutral-900">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Last Updated</span>
                <span className="text-neutral-900">Jan 07, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Login Count</span>
                <span className="text-neutral-900">342 times</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-sm text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Data
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Activity Log
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-sm text-red-900 mb-4">Danger Zone</h3>
            <button className="w-full px-4 py-2 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}