import React, { useState } from 'react';
import { VibeProject } from '../types/project';
import {
  serializeProjectsToJson,
  parseProjectsFromJson,
} from '../utils/projectHelpers';
import {
  X,
  Github,
  Download,
  Upload,
  Copy,
  Check,
  FileJson,
  GitPullRequest,
  RotateCcw,
} from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: VibeProject[];
  onImportProjects: (imported: VibeProject[]) => void;
  onResetToDefaultSeed: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({
  isOpen,
  onClose,
  projects,
  onImportProjects,
  onResetToDefaultSeed,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'guide'>('export');
  const [copiedJson, setCopiedJson] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const catalogJson = serializeProjectsToJson(projects);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(catalogJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([catalogJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibecoded_catalog.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    const result = parseProjectsFromJson(importJsonText);
    if (!result.success || !result.projects) {
      setImportStatus({
        type: 'error',
        message: result.error || 'Failed to parse JSON.',
      });
      return;
    }
    onImportProjects(result.projects);
    setImportStatus({
      type: 'success',
      message: `Successfully imported ${result.projects.length} vibecoded projects!`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gh-pages-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sky-400">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="gh-pages-modal-title"
                className="text-base font-bold text-slate-100"
              >
                GitHub Pages Static Persistence &amp; Catalog Sync
              </h2>
              <p className="text-xs text-slate-400">
                Export added projects to commit to your GitHub Pages repo, or import a colleague&apos;s catalog JSON.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close GitHub Pages modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub-navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 border-b-2 pb-2.5 text-xs font-semibold transition ${
              activeTab === 'export'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Catalog ({projects.length} Projects)</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-1.5 border-b-2 pb-2.5 text-xs font-semibold transition ${
              activeTab === 'import'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import JSON Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 border-b-2 pb-2.5 text-xs font-semibold transition ${
              activeTab === 'guide'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            <span>How GitHub Pages Saving Works</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'export' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Download <code>vibecoded_catalog.json</code>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Includes all {projects.length} interactive prototypes, HTML bundles, and prompt recipes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied JSON!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
                  >
                    <FileJson className="h-4 w-4" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Live Catalog JSON Preview
                  </span>
                  <button
                    onClick={onResetToDefaultSeed}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Local Browser Cache to Default Lab Seed</span>
                  </button>
                </div>
                <pre className="max-h-72 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-sky-200">
                  {catalogJson}
                </pre>
              </div>
            </>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <label className="block text-xs font-semibold text-slate-200 mb-2">
                  Upload a <code>vibecoded_catalog.json</code> file or paste JSON below
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-sky-300 hover:file:bg-sky-500/30"
                />
              </div>

              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"projects": [ ... ]}'
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />

              {importStatus && (
                <div
                  className={`rounded-lg p-3 text-xs font-medium ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {importStatus.message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleImportSubmit}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
                >
                  Load Catalog into Showcase
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <h4 className="text-sm font-bold text-white">
                  1. Instant Browser Testing (Zero Backend Needed)
                </h4>
                <p className="text-slate-400">
                  When any lab member or visitor clicks <strong>&ldquo;Add Vibe Project&rdquo;</strong>, the prototype is immediately saved in their browser&apos;s <code>localStorage</code> and runs live inside the sandboxed workbench.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <h4 className="text-sm font-bold text-white">
                  2. Permanent Saving on GitHub Pages (Pull Request / Issue Flow)
                </h4>
                <p className="text-slate-400">
                  Because GitHub Pages hosts static files without a database server, permanent additions work in two ways:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>
                    <strong>Single Project Submission:</strong> Open any project on the Interactive Stage, click the <strong>&ldquo;GitHub Snippet&rdquo;</strong> tab, and copy the pre-formatted Markdown/JSON payload into a GitHub Issue or PR.
                  </li>
                  <li>
                    <strong>Full Catalog Commit:</strong> Maintainers can add multiple projects in the UI, click <strong>&ldquo;Download .JSON&rdquo;</strong> in the Export tab, and commit the updated file directly to the repository&apos;s <code>src/data/</code> folder.
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <h4 className="text-sm font-bold text-white">
                  3. Configured for <code>gh-pages</code> Deployment
                </h4>
                <p className="text-slate-400">
                  <code>vite.config.ts</code> is configured with <code>base: &apos;./&apos;</code> so all compiled assets resolve cleanly whether hosted at <code>username.github.io</code> or a project subpath <code>username.github.io/lab-website/</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
