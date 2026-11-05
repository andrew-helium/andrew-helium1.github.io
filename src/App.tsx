import React, { useState, useEffect, useMemo } from 'react';
import {
  VibeProject,
  ProjectFilterState,
  LabCategory,
  VibecodingTool,
} from './types/project';
import {
  SEED_PROJECTS,
  LAB_PUBLICATIONS,
  LAB_MEMBERS,
} from './data/seedProjects';
import { filterAndSortProjects } from './utils/projectHelpers';
import { Navbar, NavTab } from './components/Navbar';
import { InteractiveStage } from './components/InteractiveStage';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal } from './components/AddProjectModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import {
  Search,
  Sparkles,
  Plus,
  Filter,
  Play,
  BookOpen,
  Users,
  Compass,
  Github,
  ExternalLink,
  Code2,
  Terminal,
  ArrowUpRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'vibelab_projects_v1';

const ALL_CATEGORIES: (LabCategory | 'All')[] = [
  'All',
  'Human-AI Interaction',
  'Generative Interfaces',
  'Cognitive & Thinking Tools',
  'Autonomous Agents',
  'Computational Science',
  'Creative & 3D Media',
];

const ALL_TOOLS: (VibecodingTool | 'All')[] = [
  'All',
  'Claude Artifacts',
  'Lovable',
  'v0 by Vercel',
  'Bolt.new',
  'Cursor',
  'Custom Prompt',
];

export default function App() {
  // Load initial projects from localStorage or fallback to SEED_PROJECTS
  const [projects, setProjects] = useState<VibeProject[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return SEED_PROJECTS;
  });

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore storage errors
    }
  }, [projects]);

  const [activeTab, setActiveTab] = useState<NavTab>('prototypes');
  const [stageProjectId, setStageProjectId] = useState<string>(
    () => projects[0]?.id || SEED_PROJECTS[0].id
  );
  const [modalStageProject, setModalStageProject] =
    useState<VibeProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [filters, setFilters] = useState<ProjectFilterState>({
    searchQuery: '',
    category: 'All',
    tool: 'All',
    sourceType: 'All',
    sortBy: 'featured',
  });

  const stageProject = useMemo(() => {
    return (
      projects.find((p) => p.id === stageProjectId) ||
      projects[0] ||
      SEED_PROJECTS[0]
    );
  }, [projects, stageProjectId]);

  const filteredProjects = useMemo(() => {
    return filterAndSortProjects(projects, filters);
  }, [projects, filters]);

  const handleAddProject = (newProj: VibeProject) => {
    setProjects((prev) => [newProj, ...prev]);
    setStageProjectId(newProj.id);
    setActiveTab('prototypes');
  };

  const handleUpdateProjectCode = (
    projectId: string,
    newHtml: string,
    newPrompt: string
  ) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              rawHtml: newHtml,
              promptRecipe: newPrompt,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const handleToggleStar = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, stars: (p.stars || 0) + 1 } : p
      )
    );
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== projectId);
      if (stageProjectId === projectId && next.length > 0) {
        setStageProjectId(next[0].id);
      }
      return next;
    });
  };

  const handleImportProjects = (imported: VibeProject[]) => {
    setProjects(imported);
    if (imported.length > 0) {
      setStageProjectId(imported[0].id);
    }
  };

  const handleResetToDefaultSeed = () => {
    setProjects(SEED_PROJECTS);
    setStageProjectId(SEED_PROJECTS[0].id);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleJumpToProjectFromLink = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (target) {
      setStageProjectId(target.id);
      setActiveTab('prototypes');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        projectCount={projects.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'prototypes' && (
          <div className="space-y-8">
            {/* Live Interactive Stage Section */}
            <section aria-label="Featured Interactive Prototype Workbench">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Active Research Sandbox &bull; Click &amp; Interact Directly Below
                  </h2>
                </div>

                {/* Quick Switcher Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  <span className="text-[11px] text-slate-400 mr-1 shrink-0">
                    Quick Load:
                  </span>
                  {projects.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setStageProjectId(p.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition ${
                        stageProject.id === p.id
                          ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {p.title.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <InteractiveStage
                project={stageProject}
                onUpdateProjectCode={handleUpdateProjectCode}
              />
            </section>

            {/* Filter & Search Bar */}
            <section
              aria-label="Filter and search vibecoded projects"
              className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                      }))
                    }
                    placeholder="Search projects by title, prompt recipe, author, model, or #tag..."
                    aria-label="Search vibecoded projects"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* Tool Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Filter className="h-3.5 w-3.5 text-sky-400" />
                    <span>Vibe App:</span>
                  </div>
                  <select
                    value={filters.tool}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        tool: e.target.value as VibecodingTool | 'All',
                      }))
                    }
                    aria-label="Filter by vibecoding tool"
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-sky-500 focus:outline-none"
                  >
                    {ALL_TOOLS.map((t) => (
                      <option key={t} value={t}>
                        {t === 'All' ? 'All Vibecoding Apps' : t}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as ProjectFilterState['sortBy'],
                      }))
                    }
                    aria-label="Sort projects by"
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="featured">Sort: Featured First</option>
                    <option value="stars">Sort: Most Starred</option>
                    <option value="recent">Sort: Newest Added</option>
                    <option value="title">Sort: Alphabetical</option>
                  </select>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Submit Prototype</span>
                  </button>
                </div>
              </div>

              {/* Research Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: cat }))
                    }
                    className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                      filters.category === cat
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'bg-slate-950/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Project Grid */}
            <section aria-label="Vibecoded Projects Directory">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  <span>
                    Interactive Vibecoded Catalog ({filteredProjects.length})
                  </span>
                </h2>
                {filters.searchQuery ||
                filters.category !== 'All' ||
                filters.tool !== 'All' ? (
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        category: 'All',
                        tool: 'All',
                        sourceType: 'All',
                        sortBy: 'featured',
                      })
                    }
                    className="text-xs text-sky-400 hover:underline"
                  >
                    Clear active filters
                  </button>
                ) : null}
              </div>

              {filteredProjects.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
                  <p className="text-sm text-slate-300 font-medium">
                    No vibecoded prototypes match your current filters.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        setFilters({
                          searchQuery: '',
                          category: 'All',
                          tool: 'All',
                          sourceType: 'All',
                          sortBy: 'featured',
                        })
                      }
                      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400"
                    >
                      + Add a New Vibe Project
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isSelectedOnStage={stageProject.id === project.id}
                      onSelectForStage={(p) => {
                        setStageProjectId(p.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onOpenModalStage={(p) => setModalStageProject(p)}
                      onToggleStar={handleToggleStar}
                      onDeleteProject={handleDeleteProject}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Research Areas View */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Compass className="h-6 w-6 text-sky-400" />
                <span>Interactive Research Areas &amp; Vibe Tracks</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-3xl">
                Our lab organizes vibecoded prototypes into core research thrusts. Instead of static PDFs, each area is anchored by runnable artifacts that anyone can test, inspect, and remix in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ALL_CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                const matching = projects.filter((p) => p.category === cat);
                return (
                  <div
                    key={cat}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-sky-400">{cat}</h3>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                          {matching.length} Prototypes
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                        Interactive investigations and rapid software probes built by our researchers in {cat}.
                      </p>

                      <div className="mt-4 space-y-2">
                        {matching.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 p-3"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-semibold text-slate-200 truncate">
                                {m.title}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Vibecoded with {m.tool} &bull; {m.author.name}
                              </div>
                            </div>
                            <button
                              onClick={() => handleJumpToProjectFromLink(m.id)}
                              className="shrink-0 flex items-center gap-1 rounded-lg bg-sky-500/20 border border-sky-500/40 px-2.5 py-1 text-xs font-semibold text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition"
                            >
                              <Play className="h-3 w-3" />
                              <span>Launch</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          category: cat as LabCategory,
                        }));
                        setActiveTab('prototypes');
                      }}
                      className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1 self-start"
                    >
                      <span>Filter catalog by {cat}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Publications View (Connected to Vibecoded Artifacts) */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-sky-400" />
                <span>Lab Publications &amp; Companion Vibe Artifacts</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-3xl">
                Every paper published by our lab pairs traditional peer-reviewed findings with an interactive, vibecoded companion prototype you can launch right in the browser.
              </p>
            </div>

            <div className="space-y-4">
              {LAB_PUBLICATIONS.map((pub) => {
                const linkedProj = projects.find(
                  (p) => p.id === pub.linkedProjectId
                );
                return (
                  <div
                    key={pub.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                          {pub.venue}
                        </span>
                        {pub.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100">
                        {pub.title}
                      </h3>
                      <p className="text-xs font-medium text-sky-400">
                        {pub.authors.join(', ')} ({pub.year})
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {pub.abstract}
                      </p>
                    </div>

                    <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 w-full lg:w-60">
                      {linkedProj && (
                        <button
                          onClick={() =>
                            handleJumpToProjectFromLink(linkedProj.id)
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 shadow-md shadow-sky-500/10 transition"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Run Companion Prototype</span>
                        </button>
                      )}
                      {pub.paperUrl && (
                        <a
                          href={pub.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                        >
                          <span>Read Paper Preprint</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lab Team View */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Users className="h-6 w-6 text-sky-400" />
                  <span>Researchers &amp; Vibe Contributors</span>
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Meet the faculty, postdocs, and graduate researchers building interactive prototypes in our lab.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
              >
                + Submit Your Prototype
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LAB_MEMBERS.map((member) => {
                const memberProjs = projects.filter(
                  (p) =>
                    member.contributedProjectIds.includes(p.id) ||
                    p.author.name.toLowerCase() === member.name.toLowerCase()
                );

                return (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400 font-bold text-base">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white">
                            {member.name}
                          </h3>
                          <p className="text-xs text-sky-400">{member.role}</p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                        {member.bio}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Vibecoded Prototypes ({memberProjs.length})
                        </div>
                        <div className="space-y-1.5">
                          {memberProjs.map((mp) => (
                            <button
                              key={mp.id}
                              onClick={() => handleJumpToProjectFromLink(mp.id)}
                              className="w-full flex items-center justify-between rounded-lg bg-slate-950 px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-sky-500/15 hover:text-sky-300 border border-slate-800 transition"
                            >
                              <span className="truncate">{mp.title}</span>
                              <Play className="h-3 w-3 shrink-0 ml-2 text-sky-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {member.github && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Github className="h-3.5 w-3.5" />
                        <span>@{member.github}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* About & GitHub Pages Architecture View */}
        {activeTab === 'about' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs font-semibold text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Interactive Research Lab Architecture</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Designed for Vibecoded Prototypes on GitHub Pages
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Modern AI coding tools like <strong>Claude Artifacts</strong>,{' '}
                <strong>Lovable</strong>, <strong>v0</strong>,{' '}
                <strong>Bolt.new</strong>, and <strong>Cursor</strong> allow
                researchers to turn theoretical ideas into interactive software
                probes in minutes. This platform is purpose-built to showcase,
                execute, remix, and archive those prototypes on a static{' '}
                <strong>GitHub Pages</strong> site.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
                    <Code2 className="h-4 w-4" />
                    <span>1. Sandboxed Execution</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Paste raw HTML/CSS/JS bundles from Claude or Cursor and run
                    them inside an isolated iframe stage with desktop/mobile
                    toggles and live code remixing.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                    <Terminal className="h-4 w-4" />
                    <span>2. Prompt Provenance</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every project records its &ldquo;Vibe Recipe&rdquo; (the
                    prompts, model, and iteration notes) alongside academic
                    metadata and paper links.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>3. Static Repo Persistence</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Users add projects instantly in local storage, then export a
                    clean <code>vibecoded_catalog.json</code> or GitHub PR
                    Markdown snippet to save permanently on GitHub Pages.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
                >
                  + Add Your Vibecoded Project
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  Open GitHub Pages Export / Import
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Workbench when a user clicks Expand on a card */}
      {modalStageProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Interactive Workbench for ${modalStageProject.title}`}
        >
          <div className="w-full max-w-6xl">
            <InteractiveStage
              project={modalStageProject}
              onUpdateProjectCode={handleUpdateProjectCode}
              isModal={true}
              onCloseModal={() => setModalStageProject(null)}
            />
          </div>
        </div>
      )}

      {/* Add Vibecoded Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProject}
      />

      {/* GitHub Pages Export / Sync Modal */}
      <GitHubPagesModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projects}
        onImportProjects={handleImportProjects}
        onResetToDefaultSeed={handleResetToDefaultSeed}
      />

      {/* Minimal Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span className="font-semibold text-slate-200">VibeLab</span>
            <span>&mdash; Interactive Vibecoded Research Showcase</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-sky-400 transition"
            >
              Add Project
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-sky-400 transition"
            >
              Export Catalog JSON
            </button>
            <span className="text-slate-600">&bull;</span>
            <span>Static GitHub Pages Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
