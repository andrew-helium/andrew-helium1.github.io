import React, { useState } from 'react';
import { VibeProject } from '../types/project';
import {
  Play,
  Star,
  Terminal,
  ExternalLink,
  Code2,
  BookOpen,
  Trash2,
  Maximize2,
  User,
} from 'lucide-react';

interface ProjectCardProps {
  project: VibeProject;
  isSelectedOnStage: boolean;
  onSelectForStage: (project: VibeProject) => void;
  onOpenModalStage: (project: VibeProject) => void;
  onToggleStar: (projectId: string) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelectedOnStage,
  onSelectForStage,
  onOpenModalStage,
  onToggleStar,
  onDeleteProject,
}) => {
  const [inlinePreviewActive, setInlinePreviewActive] = useState(false);

  const toolBadgeColor = (tool: string) => {
    switch (tool) {
      case 'Claude Artifacts':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Lovable':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'v0 by Vercel':
        return 'bg-slate-200/15 text-slate-200 border-slate-400/30';
      case 'Bolt.new':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Cursor':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelectedOnStage
          ? 'border-sky-500 bg-slate-900/95 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
          : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      {/* Top Preview Window / Interactive Mini-Stage */}
      <div className="relative h-48 w-full bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        {inlinePreviewActive && project.rawHtml ? (
          <iframe
            title={`Mini Preview: ${project.title}`}
            srcDoc={project.rawHtml}
            sandbox="allow-scripts"
            className="h-full w-full border-0"
          />
        ) : (
          <div className="relative h-full w-full flex flex-col justify-between p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
            {/* Subtle decorative grid */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${toolBadgeColor(
                  project.tool
                )}`}
              >
                {project.tool}
              </span>

              <span className="rounded-md bg-slate-800/90 border border-slate-700/70 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                {project.category}
              </span>
            </div>

            {/* Center Prompt Preview */}
            <div className="relative z-10 my-auto">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-sky-400 mb-1">
                <Terminal className="h-3 w-3" />
                <span>Vibe Prompt Excerpt</span>
              </div>
              <p className="line-clamp-2 font-mono text-xs text-slate-300 bg-slate-950/80 border border-slate-800/90 rounded-lg p-2">
                &ldquo;{project.promptRecipe}&rdquo;
              </p>
            </div>

            {/* Bottom Quick Actions inside preview */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {project.rawHtml && (
                  <button
                    onClick={() => setInlinePreviewActive(true)}
                    className="flex items-center gap-1 rounded-lg bg-sky-500/20 border border-sky-500/40 px-2.5 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Run Inline</span>
                  </button>
                )}
                <button
                  onClick={() => onSelectForStage(project)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800/90 border border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  <Code2 className="h-3 w-3 text-sky-400" />
                  <span>{isSelectedOnStage ? 'Active on Stage' : 'Load on Stage'}</span>
                </button>
              </div>

              <button
                onClick={() => onOpenModalStage(project)}
                className="rounded-lg bg-slate-900/90 border border-slate-700/80 p-1.5 text-slate-300 hover:text-white hover:border-sky-500 transition"
                title="Open Full Interactive Workbench Modal"
                aria-label={`Expand ${project.title}`}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {inlinePreviewActive && (
          <button
            onClick={() => setInlinePreviewActive(false)}
            className="absolute top-2 right-2 z-20 rounded-md bg-slate-950/90 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:text-white"
          >
            Stop Inline
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors leading-snug">
              <button
                onClick={() => onSelectForStage(project)}
                className="text-left focus:outline-none"
              >
                {project.title}
              </button>
            </h3>
            <button
              onClick={() => onToggleStar(project.id)}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 px-2 py-1 text-xs font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition shrink-0"
              aria-label={`Star ${project.title}`}
            >
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
              <span>{project.stars || 0}</span>
            </button>
          </div>

          <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">
            {project.summary}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Author & Paper Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sky-400">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="truncate">
              <div className="font-medium text-slate-200 truncate text-[11px]">
                {project.author.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {project.author.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2 py-1 text-[10px] font-medium text-indigo-300 hover:bg-indigo-500/20 transition"
                title={project.paperTitle || 'Read Associated Paper'}
              >
                <BookOpen className="h-3 w-3" />
                <span>Paper</span>
              </a>
            )}

            {project.embedUrl && (
              <a
                href={project.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-slate-800 p-1 text-slate-400 hover:text-sky-400"
                title="Open External Vibe Link"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {onDeleteProject && project.id.startsWith('custom-') && (
              <button
                onClick={() => onDeleteProject(project.id)}
                className="rounded-md bg-slate-800 p-1 text-slate-400 hover:text-rose-400 transition"
                title="Remove custom project"
                aria-label={`Delete ${project.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
