import React, { useState, useEffect, useRef } from 'react';
import { VibeProject } from '../types/project';
import {
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Code2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
  FileText,
  Save,
} from 'lucide-react';
import { generateGitHubSubmissionMarkdown } from '../utils/projectHelpers';

interface InteractiveStageProps {
  project: VibeProject;
  onUpdateProjectCode?: (projectId: string, newHtml: string, newPrompt: string) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const InteractiveStage: React.FC<InteractiveStageProps> = ({
  project,
  onUpdateProjectCode,
  isModal = false,
  onCloseModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'prompt' | 'code' | 'github'>('preview');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [liveHtml, setLiveHtml] = useState(project.rawHtml || '');
  const [livePrompt, setLivePrompt] = useState(project.promptRecipe || '');
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLiveHtml(project.rawHtml || '');
    setLivePrompt(project.promptRecipe || '');
    setIframeKey((k) => k + 1);
  }, [project.id, project.rawHtml, project.promptRecipe]);

  const handleRestartSandbox = () => {
    setIframeKey((k) => k + 1);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleSaveRemix = () => {
    if (onUpdateProjectCode) {
      onUpdateProjectCode(project.id, liveHtml, livePrompt);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

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
    <div
      ref={stageRef}
      className={`flex flex-col rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-3 z-50' : isModal ? 'h-[85vh] w-full' : 'h-[560px] w-full'
      }`}
    >
      {/* Top Workbench Header */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-100 truncate">
                {project.title}
              </h3>
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${toolBadgeColor(
                  project.tool
                )}`}
              >
                {project.tool}
              </span>
              {project.modelUsed && (
                <span className="hidden lg:inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                  {project.modelUsed}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveSubTab('preview')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              activeSubTab === 'preview'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Interactive Sandbox</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prompt')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              activeSubTab === 'prompt'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Vibe Prompt</span>
          </button>

          <button
            onClick={() => setActiveSubTab('code')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              activeSubTab === 'code'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Live Code / Remix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('github')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              activeSubTab === 'github'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub Snippet</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          {activeSubTab === 'preview' && (
            <>
              <button
                onClick={() =>
                  setViewportMode(viewportMode === 'desktop' ? 'mobile' : 'desktop')
                }
                className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                title={
                  viewportMode === 'desktop'
                    ? 'Switch to Mobile Preview'
                    : 'Switch to Desktop Preview'
                }
                aria-label="Toggle viewport size"
              >
                {viewportMode === 'desktop' ? (
                  <Smartphone className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={handleRestartSandbox}
                className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                title="Reload Interactive Prototype"
                aria-label="Reload interactive prototype"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}

          {project.embedUrl && (
            <a
              href={project.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-sky-400"
            >
              <span>Open External</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            aria-label="Toggle fullscreen preview"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="ml-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-rose-600 hover:text-white transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
        {activeSubTab === 'preview' && (
          <div
            className={`h-full transition-all duration-300 ${
              viewportMode === 'mobile'
                ? 'w-[390px] max-w-full border-x border-slate-800 shadow-2xl my-auto'
                : 'w-full'
            }`}
          >
            {project.sourceType === 'code' || liveHtml ? (
              <iframe
                key={iframeKey}
                title={`Interactive Sandbox: ${project.title}`}
                srcDoc={liveHtml}
                sandbox="allow-scripts allow-forms allow-popups"
                className="h-full w-full border-0 bg-slate-950"
              />
            ) : project.embedUrl ? (
              <div className="relative h-full w-full flex flex-col">
                <iframe
                  key={iframeKey}
                  title={`External Embed: ${project.title}`}
                  src={project.embedUrl}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="flex-1 w-full border-0 bg-slate-950"
                />
                <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Embedded from <strong>{project.tool}</strong> ({project.embedUrl})
                  </span>
                  <a
                    href={project.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Launch in new tab if blocked by X-Frame-Options{' '}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                No runnable source or URL attached to this project.
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'prompt' && (
          <div className="h-full w-full overflow-y-auto p-6 text-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  The Vibecoding Recipe
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Copy this prompt into Claude, Lovable, v0, or Bolt to reproduce or extend this research artifact.
                </p>
              </div>
              <button
                onClick={() => handleCopy(livePrompt, 'prompt')}
                className="flex items-center gap-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition"
              >
                {copiedState === 'prompt' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Prompt Recipe</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Primary Prompt
              </label>
              <textarea
                value={livePrompt}
                onChange={(e) => setLivePrompt(e.target.value)}
                rows={5}
                aria-label="Primary Vibecoding Prompt"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs leading-relaxed text-sky-100 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {project.systemPrompt && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  System Prompt / Vibe Framing
                </label>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-xs text-slate-300">
                  {project.systemPrompt}
                </div>
              </div>
            )}

            {project.iterationsSummary && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Iteration History &amp; Researcher Notes
                </label>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 leading-relaxed">
                  {project.iterationsSummary}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
                <div className="text-[11px] text-slate-400">Vibecoded By</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {project.author.name}
                </div>
                <div className="text-xs text-slate-400">{project.author.role}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
                <div className="text-[11px] text-slate-400">Platform &amp; Model</div>
                <div className="text-sm font-semibold text-sky-400 mt-0.5">
                  {project.tool}
                </div>
                <div className="text-xs text-slate-400">
                  {project.modelUsed || 'Default Foundation Model'}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
                <div className="text-[11px] text-slate-400">Research Area</div>
                <div className="text-sm font-semibold text-indigo-300 mt-0.5">
                  {project.category}
                </div>
                {project.paperTitle && (
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    Paper: {project.paperTitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'code' && (
          <div className="h-full w-full flex flex-col p-4 bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live HTML / JS / CSS Artifact Bundle
                </h4>
                <p className="text-[11px] text-slate-400">
                  Edit the vibecoded source right here and switch back to &ldquo;Interactive Sandbox&rdquo; to test changes live!
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onUpdateProjectCode && (
                  <button
                    onClick={handleSaveRemix}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{savedNotice ? 'Saved to Browser!' : 'Save Changes'}</span>
                  </button>
                )}
                <button
                  onClick={() => handleCopy(liveHtml, 'code')}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  {copiedState === 'code' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied HTML</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Full Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <textarea
              value={liveHtml}
              onChange={(e) => setLiveHtml(e.target.value)}
              aria-label="Live HTML source code editor"
              className="flex-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-300 focus:border-sky-500 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        )}

        {activeSubTab === 'github' && (
          <div className="h-full w-full flex flex-col p-6 overflow-y-auto text-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  GitHub Pages Repository Submission Block
                </h4>
                <p className="text-xs text-slate-400">
                  Since GitHub Pages is static, contributors can paste this Markdown/JSON block into a GitHub Issue or PR to add this project permanently to the lab website.
                </p>
              </div>
              <button
                onClick={() =>
                  handleCopy(generateGitHubSubmissionMarkdown(project), 'gh')
                }
                className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
              >
                {copiedState === 'gh' ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy PR / Issue Markdown</span>
                  </>
                )}
              </button>
            </div>
            <pre className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
              {generateGitHubSubmissionMarkdown(project)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
