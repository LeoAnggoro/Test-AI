import React, { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function BentoCard({ children, className, title, icon, action }: BentoCardProps) {
  return (
    <div className={cn("glass-card p-6 flex flex-col relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-32 bg-volt/5 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:bg-volt/10 pointer-events-none"></div>
      
      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-white/5 rounded-lg text-volt">{icon}</div>}
            {title && <h3 className="font-orbitron font-semibold text-lg tracking-wide text-white">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className="flex-1 relative z-10">
        {children}
      </div>
    </div>
  );
}
