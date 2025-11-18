import type { ComponentType } from 'react';

interface SidebarItemProps {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon: Icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-left ${
        isActive
          ? 'liquid-button text-primary-foreground'
          : 'ios-surface text-foreground hover:scale-[1.02] liquid-glow'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
          isActive ? 'bg-white/20' : 'bg-primary/20'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
      </div>
      <span className="font-semibold">{label}</span>
    </button>
  );
}
