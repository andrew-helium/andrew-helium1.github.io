import React, { useState } from 'react';
import {
  VibeProject,
  VibecodingTool,
  LabCategory,
} from '../types/project';
import {
  detectVibecodingTool,
  validateProjectInput,
} from '../utils/projectHelpers';
import {
  X,
  Sparkles,
  Code2,
  Link2,
  Play,
  AlertCircle,
  CheckCircle2,
  Wand2,
} from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: VibeProject) => void;
}

const VIBE_TOOLS: VibecodingTool[] = [
  'Claude Artifacts',
  'Lovable',
  'v0 by Vercel',
  'Bolt.new',
  'Cursor',
  'Replit',
  'Custom Prompt',
];

const LAB_CATEGORIES: LabCategory[] = [
  'Human-AI Interaction',
  'Generative Interfaces',
  'Cognitive & Thinking Tools',
  'Autonomous Agents',
  'Computational Science',
  'Creative & 3D Media',
];

const SAMPLE_STARTER_TEMPLATES = [
  {
    name: 'Interactive cellular automata (Claude Artifact style)',
    tool: 'Claude Artifacts' as VibecodingTool,
    category: 'Computational Science' as LabCategory,
    prompt: 'Create an interactive Conway Game of Life cellular automaton with neon cells, brush size slider, and speed control.',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #090d16; color: #38bdf8; font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .bar { padding: 10px 16px; background: #111827; display: flex; gap: 12px; align-items: center; border-bottom: 1px solid #1e293b; font-size: 12px; }
  button { background: #0284c7; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; }
  canvas { flex: 1; cursor: crosshair; }
</style>
</head>
<body>
<div class="bar">
  <strong>VibeAutomata // Morphogenetic Grid</strong>
  <button id="toggle">Pause / Resume</button>
  <button id="random">Randomize Seed</button>
  <button id="clear">Clear</button>
  <span>Click or drag to draw living cells</span>
</div>
<canvas id="c"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const res = 12;
  let cols, rows, grid;
  let running = true;

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 45;
    cols = Math.floor(canvas.width / res);
    rows = Math.floor(canvas.height / res);
    grid = Array.from({length: cols}, () => Array.from({length: rows}, () => Math.random() > 0.78 ? 1 : 0));
  }
  window.addEventListener('resize', init);
  init();

  function step() {
    if (running) {
      const next = grid.map(arr => [...arr]);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let neighbors = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              const x = (i + dx + cols) % cols;
              const y = (j + dy + rows) % rows;
              neighbors += grid[x][y];
            }
          }
          if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) next[i][j] = 0;
          else if (grid[i][j] === 0 && neighbors === 3) next[i][j] = 1;
        }
      }
      grid = next;
    }
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j]) ctx.fillRect(i * res, j * res, res - 1, res - 1);
      }
    }
  }
  setInterval(step, 70);

  let drawing = false;
  canvas.addEventListener('mousedown', () => drawing = true);
  window.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / res);
    const y = Math.floor((e.clientY - rect.top) / res);
    if (grid[x] && grid[x][y] !== undefined) grid[x][y] = 1;
  });

  document.getElementById('toggle').onclick = () => running = !running;
  document.getElementById('random').onclick = init;
  document.getElementById('clear').onclick = () => {
    grid = Array.from({length: cols}, () => Array(rows).fill(0));
  };
</script>
</body>
</html>`,
  },
  {
    name: 'Attention Heatmap Inspector (Lovable style)',
    tool: 'Lovable' as VibecodingTool,
    category: 'Human-AI Interaction' as LabCategory,
    prompt: 'Build an interactive Transformer self-attention token-to-token weight matrix inspector where hovering a token highlights its attention distribution.',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; padding: 24px; }
  h2 { font-size: 16px; color: #38bdf8; margin-bottom: 6px; }
  p { font-size: 12px; color: #94a3b8; margin-bottom: 18px; }
  .tokens { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
  .token { padding: 8px 14px; border-radius: 8px; background: #1e293b; border: 1px solid #334155; cursor: pointer; font-family: monospace; font-size: 14px; transition: all 0.15s; }
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 12px; font-family: monospace; }
  .bar-track { flex: 1; background: #1e293b; height: 10px; border-radius: 5px; overflow: hidden; }
  .bar-fill { height: 100%; background: #f43f5e; transition: width 0.2s; }
</style>
</head>
<body>
  <h2>Transformer Cross-Attention Head #4 Inspector</h2>
  <p>Click or hover any token below to inspect its real-time attention distribution across context tokens.</p>
  <div class="tokens" id="tokenList"></div>
  <div id="bars"></div>
<script>
  const words = ["The", "autonomous", "agent", "synthesized", "a", "novel", "interactive", "interface"];
  const weights = [
    [0.6, 0.1, 0.15, 0.05, 0.02, 0.02, 0.03, 0.03],
    [0.08, 0.45, 0.32, 0.05, 0.01, 0.03, 0.03, 0.03],
    [0.05, 0.35, 0.4, 0.12, 0.01, 0.02, 0.02, 0.03],
    [0.03, 0.18, 0.38, 0.25, 0.02, 0.04, 0.05, 0.05],
    [0.05, 0.02, 0.03, 0.1, 0.5, 0.15, 0.1, 0.05],
    [0.02, 0.04, 0.04, 0.08, 0.12, 0.45, 0.15, 0.1],
    [0.02, 0.05, 0.05, 0.08, 0.05, 0.2, 0.35, 0.2],
    [0.02, 0.06, 0.12, 0.15, 0.03, 0.12, 0.22, 0.28]
  ];

  const tokenList = document.getElementById('tokenList');
  const bars = document.getElementById('bars');

  function selectToken(idx) {
    const w = weights[idx];
    document.querySelectorAll('.token').forEach((el, i) => {
      const alpha = w[i];
      el.style.background = i === idx ? '#0284c7' : \`rgba(244, 63, 94, \${alpha * 1.4})\`;
      el.style.borderColor = i === idx ? '#38bdf8' : '#475569';
    });

    bars.innerHTML = words.map((word, i) => \`
      <div class="bar-row">
        <span style="width:110px">\${word}</span>
        <div class="bar-track"><div class="bar-fill" style="width:\${(w[i]*100).toFixed(0)}%"></div></div>
        <span style="width:45px; text-align:right">\${(w[i]*100).toFixed(1)}%</span>
      </div>
    \`).join('');
  }

  words.forEach((word, idx) => {
    const el = document.createElement('div');
    el.className = 'token';
    el.textContent = word;
    el.onmouseenter = () => selectToken(idx);
    el.onclick = () => selectToken(idx);
    tokenList.appendChild(el);
  });

  selectToken(2);
</script>
</body>
</html>`,
  },
];

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<LabCategory>('Human-AI Interaction');
  const [tool, setTool] = useState<VibecodingTool>('Claude Artifacts');
  const [modelUsed, setModelUsed] = useState('Claude 3.7 Sonnet');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Researcher');
  const [authorGithub, setAuthorGithub] = useState('');
  const [sourceType, setSourceType] = useState<'code' | 'embed_url'>('code');
  const [rawHtml, setRawHtml] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [promptRecipe, setPromptRecipe] = useState('');
  const [tagsInput, setTagsInput] = useState('vibecoding, prototype, interactive');
  const [paperTitle, setPaperTitle] = useState('');
  const [paperUrl, setPaperUrl] = useState('');

  const [errors, setErrors] = useState<string[]>([]);
  const [showLivePreview, setShowLivePreview] = useState(false);

  if (!isOpen) return null;

  const handleUrlChange = (val: string) => {
    setEmbedUrl(val);
    if (val.trim().length > 8) {
      const detected = detectVibecodingTool(val);
      if (detected !== 'Custom Prompt') {
        setTool(detected);
      }
    }
  };

  const handleLoadTemplate = (idx: number) => {
    const tpl = SAMPLE_STARTER_TEMPLATES[idx];
    if (!tpl) return;
    setTitle(tpl.name);
    setSummary(`Interactive research prototype exploring ${tpl.name.toLowerCase()}.`);
    setTool(tpl.tool);
    setCategory(tpl.category);
    setSourceType('code');
    setRawHtml(tpl.html);
    setPromptRecipe(tpl.prompt);
    if (!authorName) setAuthorName('Lab Contributor');
    setErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidate: Partial<VibeProject> = {
      title: title.trim(),
      summary: summary.trim(),
      category,
      tool,
      author: {
        name: authorName.trim(),
        role: authorRole.trim() || 'Lab Researcher',
        github: authorGithub.trim() || undefined,
      },
      sourceType,
      rawHtml: sourceType === 'code' ? rawHtml : undefined,
      embedUrl: sourceType === 'embed_url' ? embedUrl.trim() : undefined,
      promptRecipe: promptRecipe.trim() || 'Vibecoded interactive prototype',
    };

    const validation = validateProjectInput(candidate);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const newProject: VibeProject = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      slug: title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      summary: summary.trim(),
      category,
      tool,
      modelUsed: modelUsed.trim() || undefined,
      author: {
        name: authorName.trim(),
        role: authorRole.trim() || 'Lab Researcher',
        github: authorGithub.trim() || undefined,
      },
      sourceType,
      rawHtml: sourceType === 'code' ? rawHtml : undefined,
      embedUrl: sourceType === 'embed_url' ? embedUrl.trim() : undefined,
      promptRecipe: promptRecipe.trim() || 'Interactive vibecoded prototype.',
      tags: tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean),
      paperTitle: paperTitle.trim() || undefined,
      paperUrl: paperUrl.trim() || undefined,
      featured: true,
      stars: 1,
      testedWorking: true,
      createdAt: new Date().toISOString(),
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-vibe-project-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="add-vibe-project-title"
                className="text-base font-bold text-slate-100"
              >
                Add Vibecoded Project to Lab Showcase
              </h2>
              <p className="text-xs text-slate-400">
                Paste runnable HTML/JS from Claude Artifacts, or link your Lovable / v0 / Bolt deployment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Quick Template Fill Bar for Easy Testing */}
          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-sky-200">
              <Wand2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>
                Want to test adding a vibecoded artifact right away? Load a ready-to-run template:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_STARTER_TEMPLATES.map((tpl, i) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => handleLoadTemplate(i)}
                  className="rounded-lg bg-sky-500/20 border border-sky-500/40 px-2.5 py-1 text-xs font-medium text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition"
                >
                  + {tpl.tool} Demo
                </button>
              ))}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs text-rose-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-300">
                <AlertCircle className="h-4 w-4" />
                <span>Please fix the following before saving:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Basic Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., LatentSpace Particle Explorer"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vibecoding App *
                </label>
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value as VibecodingTool)}
                  aria-label="Vibecoding App"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                >
                  {VIBE_TOOLS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Research Area *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LabCategory)}
                  aria-label="Research Area"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                >
                  {LAB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Research Summary *
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 sentences explaining what this interactive prototype demonstrates..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Section 2: Prototype Source (Code vs Live URL) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Interactive Prototype Source *
              </span>

              <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSourceType('code')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                    sourceType === 'code'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Paste HTML / JS Artifact</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('embed_url')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                    sourceType === 'embed_url'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Embed Lovable / v0 / Web URL</span>
                </button>
              </div>
            </div>

            {sourceType === 'code' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Paste a self-contained HTML5 document (with inline &lt;style&gt; and &lt;script&gt;) from Claude, ChatGPT, Bolt, or Cursor.
                  </span>
                  {rawHtml.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:underline"
                    >
                      <Play className="h-3 w-3" />
                      <span>
                        {showLivePreview ? 'Hide Test Sandbox' : 'Test in Live Sandbox'}
                      </span>
                    </button>
                  )}
                </div>

                <textarea
                  rows={6}
                  value={rawHtml}
                  onChange={(e) => setRawHtml(e.target.value)}
                  placeholder="<!DOCTYPE html><html><body><h1>My Vibecoded Prototype</h1><script>...</script></body></html>"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-emerald-300 placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                />

                {showLivePreview && rawHtml && (
                  <div className="h-56 w-full rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                    <iframe
                      title="Add Modal Live Test"
                      srcDoc={rawHtml}
                      sandbox="allow-scripts allow-same-origin"
                      className="h-full w-full border-0"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-[11px] text-slate-400">
                  Enter the deployed URL from Lovable (.lovable.app), Claude Artifacts, v0.dev, Bolt.new, or GitHub Pages. Tool badge auto-detects!
                </label>
                <input
                  type="url"
                  value={embedUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://my-research-demo.lovable.app"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-sky-300 placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Section 3: Vibe Prompt Recipe */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              The Vibe Recipe (Original Prompt / Instructions)
            </label>
            <textarea
              rows={3}
              value={promptRecipe}
              onChange={(e) => setPromptRecipe(e.target.value)}
              placeholder="Share the prompt that generated this prototype so other lab members can learn from or remix your vibe workflow..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Section 4: Author & Lab Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contributor Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., Alex Rivera"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lab Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g., PhD Student"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Model Used (Optional)
              </label>
              <input
                type="text"
                value={modelUsed}
                onChange={(e) => setModelUsed(e.target.value)}
                placeholder="e.g., Claude 3.7 Sonnet"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="agents, visualization, simulation"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Associated Paper Title (Optional)
              </label>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                placeholder="e.g., CHI 2026 Late-Breaking Work"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>
                Saves immediately in your browser &amp; ready for GitHub Pages JSON export.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition"
              >
                Save &amp; Launch Prototype
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
