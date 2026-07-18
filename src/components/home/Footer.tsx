import React from 'react';

/** Site-wide footer with copyright and utility links. */
export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-t border-slate-900/50 text-[10px] text-slate-600">
      <div>© 2026 Stadium Knowledge Network. All rights reserved.</div>
      <div className="flex gap-4">
        <span className="hover:text-slate-400 cursor-pointer">Security Policy</span>
        <span className="hover:text-slate-400 cursor-pointer">System Status</span>
      </div>
    </footer>
  );
}
