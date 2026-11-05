import React from 'react';
import {
  Sparkles,
  PlusCircle,
  Download,
  Github,
  BookOpen,
  Users,
  Compass,
  Layers,
  Info,
} from 'lucide-react';

export type NavTab = 'prototypes' | 'areas' | 'publications' | 'team' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  projectCount: number;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  projectCount,
  onOpenAddModal,
  onOpenExportModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Lab Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('prototypes')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            aria-label="Go to VibeLab home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-100 text-lg leading-tight">
                  Vibe<span className="text-sky-400">Lab</span>
                </span>
                <span className="rounded bg-sky-950 border border-sky-800/60 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400">
                  GitHub Pages Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Vibecoded Research Prototypes
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => onSelectTab('prototypes')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'prototypes'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Vibe Prototypes</span>
            <span className="ml-1 rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
              {projectCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('areas')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'areas'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Research Areas</span>
          </button>

          <button
            onClick={() => onSelectTab('publications')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'publications'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Publications</span>
          </button>

          <button
            onClick={() => onSelectTab('team')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'team'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Lab Team</span>
          </button>

          <button
            onClick={() => onSelectTab('about')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>About &amp; Vibe Ethos</span>
          </button>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {/* GitHub Pages Sync / Export */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition"
            title="Export for GitHub Pages or Import Catalog"
            aria-label="Export or sync for GitHub Pages"
          >
            <Github className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">GitHub Pages</span>
            <Download className="h-3 w-3 text-slate-400" />
          </button>

          {/* Add Project Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition active:scale-95"
            aria-label="Add vibecoded project"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Vibe Project</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => onSelectTab('prototypes')}
          className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
            activeTab === 'prototypes'
              ? 'bg-sky-500/15 text-sky-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Prototypes ({projectCount})
        </button>
        <button
          onClick={() => onSelectTab('areas')}
          className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
            activeTab === 'areas'
              ? 'bg-sky-500/15 text-sky-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Research Areas
        </button>
        <button
          onClick={() => onSelectTab('publications')}
          className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
            activeTab === 'publications'
              ? 'bg-sky-500/15 text-sky-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Publications
        </button>
        <button
          onClick={() => onSelectTab('team')}
          className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
            activeTab === 'team'
              ? 'bg-sky-500/15 text-sky-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Team
        </button>
        <button
          onClick={() => onSelectTab('about')}
          className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
            activeTab === 'about'
              ? 'bg-sky-500/15 text-sky-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          About
        </button>
      </div>
    </header>
  );
};
