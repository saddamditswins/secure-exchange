import { useState, useRef, useEffect } from "react";
import { LanguageDropdown } from "./LanguageDropdown";
import { ThemeSwitcher } from "./ui/ThemeSwitcher";
import {
  NotificationPanel,
  Notification,
} from "./NotificationPanel";

interface TopBarProps {
  orgName: string;
  userRole: string;
  userName: string;
  onLogout?: () => void;
  onViewProfile?: () => void;
  onMenuClick?: () => void;
  notifications?: Notification[];
  onMarkAllNotificationsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function TopBar({
  orgName,
  userRole,
  userName,
  onLogout,
  onViewProfile,
  onMenuClick,
  notifications = [],
  onMarkAllNotificationsRead,
  onNotificationClick,
}: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] =
    useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [showProfileMenu]);

  const handleNotificationClick = (
    notification: Notification,
  ) => {
    setShowNotifications(false);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  return (
    <header className="h-16 bg-[#153240] border-b border-[#243F4D] flex items-center justify-between px-6 text-[#FFFFFF]">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-neutral-400 hover:text-[#FFFFFF] md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        {/* <ThemeSwitcher /> */}

        {/* Language Switcher */}
        <LanguageDropdown variant="topbar" />

        {/* Notifications Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="relative p-2 text-neutral-300 hover:text-[#FFFFFF] hover:bg-[#243F4D] rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
            title="Notifications"
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-emerald-500 text-[#153240] rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-[#153240]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAllAsRead={() => {
              if (onMarkAllNotificationsRead) {
                onMarkAllNotificationsRead();
              }
            }}
            onNotificationClick={handleNotificationClick}
            unreadCount={unreadCount}
          />
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-[#243F4D]">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
              className="group flex items-center gap-3 hover:bg-[#1E3A4A] pl-1 pr-3 py-1 rounded-full transition-colors cursor-pointer border border-transparent hover:border-[#243F4D]"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-900 flex items-center justify-center text-sm font-medium">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="text-sm font-medium text-[#FFFFFF] group-hover:text-emerald-400 transition-colors">
                {userName}
              </div>
              <svg
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#153240] border border-[#243F4D] rounded-lg shadow-xl shadow-black/20 py-1 z-50">
                <div className="px-4 py-3 border-b border-[#243F4D]">
                  <div className="text-sm font-medium text-[#FFFFFF]">
                    {userName}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {userRole}
                  </div>
                  <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {orgName}
                  </div>
                </div>

                {onViewProfile && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onViewProfile();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-300 hover:bg-[#1E3A4A] hover:text-[#FFFFFF] flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-rose-400 hover:bg-[#1E3A4A] hover:text-rose-300 flex items-center gap-3 transition-colors border-t border-[#243F4D] cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-rose-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}