import { VibeProject, LabPublication, LabMember } from '../types/project';

export const SEED_PROJECTS: VibeProject[] = [
  {
    id: 'latent-flow-vector-field',
    title: 'LatentFlow: Semantic Vector Field Navigator',
    slug: 'latent-flow-vector-field',
    summary: 'Interactive particle vector field simulating semantic latent space navigation with dynamic attractor poles, prompt clustering, and energy topology controls.',
    category: 'Human-AI Interaction',
    tool: 'Claude Artifacts',
    modelUsed: 'Claude 3.7 Sonnet',
    author: {
      name: 'Maya Chen',
      role: 'PhD Candidate, HCI & Generative Interfaces',
      affiliation: 'VibeLab / Interactive Intelligence',
      github: 'mayachen-ai',
      email: 'mchen@vibelab.org',
    },
    sourceType: 'code',
    featured: true,
    stars: 142,
    testedWorking: true,
    createdAt: '2026-02-14T15:20:00Z',
    tags: ['latent-space', 'vector-field', 'canvas', 'simulation', 'embeddings'],
    paperTitle: 'Steering Continuous Latent Manifolds via Direct Vector Field Manipulation',
    paperUrl: 'https://arxiv.org/abs/2405.01948',
    promptRecipe: `Create a dark-mode interactive HTML5 canvas simulation called "LatentFlow".
Particles should stream through dynamic vector fields defined by multiple semantic attractor poles: "Creativity", "Precision", "Analytical", and "Divergent".
Users can drag poles, adjust repulsion/attraction force, change particle flow speed, inject particle bursts on click, and toggle vector field lines overlay.
Include sleek sliders and stats counters in an overlaid HUD. Use vibrant neon cyan and violet colors with glowing particle trails.`,
    systemPrompt: `You are an expert computational visualization designer. Output a self-contained, responsive HTML file with embedded CSS and modern vanilla JS. Ensure no external assets are required.`,
    iterationsSummary: `Round 1 built static vectors. Round 2 added mouse drag attractors. Round 3 optimized particle buffer rendering with trail dissipation.`,
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LatentFlow</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #090d16; color: #e2e8f0; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; height: 100vh; width: 100vw; }
  canvas { display: block; width: 100%; height: 100%; }
  .hud { position: absolute; top: 16px; left: 16px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 16px; width: 280px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
  .hud h2 { font-size: 14px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }
  .badge { font-size: 10px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
  .desc { font-size: 11px; color: #94a3b8; margin-bottom: 12px; line-height: 1.4; }
  .control { margin-bottom: 10px; }
  .control label { display: flex; justify-content: space-between; font-size: 11px; color: #cbd5e1; margin-bottom: 4px; }
  .control input[type=range] { width: 100%; accent-color: #38bdf8; background: #1e293b; height: 5px; border-radius: 4px; outline: none; }
  .btn-row { display: flex; gap: 6px; margin-top: 10px; }
  button { flex: 1; background: #1e293b; border: 1px solid rgba(56, 189, 248, 0.3); color: #e2e8f0; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  button:hover { background: #38bdf8; color: #090d16; }
  .instructions { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: #94a3b8; pointer-events: none; border: 1px solid rgba(255,255,255,0.08); }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<div class="hud">
  <h2>LatentFlow <span class="badge">Vibe Prototype</span></h2>
  <div class="desc">Interactive semantic attractor vector field. Drag attractors to warp particle trajectories.</div>
  <div class="control">
    <label><span>Particle Speed</span><span id="speedVal">1.5x</span></label>
    <input type="range" id="speed" min="0.5" max="3.5" step="0.1" value="1.5">
  </div>
  <div class="control">
    <label><span>Attractor Force</span><span id="forceVal">1.2</span></label>
    <input type="range" id="force" min="0.2" max="3" step="0.1" value="1.2">
  </div>
  <div class="control">
    <label><span>Particles Count</span><span id="countVal">350</span></label>
    <input type="range" id="count" min="100" max="600" step="50" value="350">
  </div>
  <div class="btn-row">
    <button id="toggleField">Toggle Vector Grid</button>
    <button id="burstBtn">Inject Burst</button>
  </div>
</div>
<div class="instructions">Click anywhere to spawn particles &bull; Drag colored attractor nodes</div>

<script>
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const attractors = [
    { x: width * 0.3, y: height * 0.35, label: 'Creativity', color: '#f43f5e', charge: 1, radius: 18 },
    { x: width * 0.7, y: height * 0.35, label: 'Precision', color: '#06b6d4', charge: 1, radius: 18 },
    { x: width * 0.5, y: height * 0.7, label: 'Divergence', color: '#a855f7', charge: 1.2, radius: 18 },
    { x: width * 0.2, y: height * 0.75, label: 'Entropy', color: '#eab308', charge: -0.8, radius: 16 }
  ];

  let draggedAttractor = null;
  let showField = true;
  let speedMultiplier = 1.5;
  let forceMultiplier = 1.2;
  let maxParticles = 350;

  class Particle {
    constructor(x, y) {
      this.reset(x, y);
    }
    reset(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
      this.color = Math.random() > 0.5 ? '#38bdf8' : '#818cf8';
      this.size = Math.random() * 1.8 + 1;
    }
    update() {
      for (const a of attractors) {
        const dx = a.x - this.x;
        const dy = a.y - this.y;
        const distSq = dx * dx + dy * dy + 1500;
        const dist = Math.sqrt(distSq);
        const f = (a.charge * 180 * forceMultiplier) / distSq;
        this.vx += (dx / dist) * f;
        this.vy += (dy / dist) * f;
      }
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.x += this.vx * speedMultiplier;
      this.y += this.vy * speedMultiplier;
      this.life--;
      if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.min(1, this.life / 30);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let particles = Array.from({ length: maxParticles }, () => new Particle());

  function drawField() {
    if (!showField) return;
    const step = 45;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        let fx = 0, fy = 0;
        for (const a of attractors) {
          const dx = a.x - x;
          const dy = a.y - y;
          const distSq = dx * dx + dy * dy + 1500;
          const dist = Math.sqrt(distSq);
          const f = (a.charge * 100) / distSq;
          fx += (dx / dist) * f;
          fy += (dy / dist) * f;
        }
        const angle = Math.atan2(fy, fx);
        const len = Math.min(18, Math.hypot(fx, fy) * 12);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    drawField();

    for (const p of particles) {
      p.update();
      p.draw();
    }

    // Draw attractors
    ctx.globalAlpha = 1;
    for (const a of attractors) {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.fillStyle = a.color;
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(a.label, a.x, a.y - a.radius - 6);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Interaction handlers
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const a of attractors) {
      if (Math.hypot(a.x - mx, a.y - my) <= a.radius + 8) {
        draggedAttractor = a;
        return;
      }
    }
    // spawn burst
    for (let i = 0; i < 20; i++) {
      const p = new Particle(mx, my);
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6;
      particles.push(p);
    }
    if (particles.length > 600) particles.splice(0, 20);
  });

  window.addEventListener('mousemove', (e) => {
    if (draggedAttractor) {
      const rect = canvas.getBoundingClientRect();
      draggedAttractor.x = Math.max(30, Math.min(width - 30, e.clientX - rect.left));
      draggedAttractor.y = Math.max(30, Math.min(height - 30, e.clientY - rect.top));
    }
  });

  window.addEventListener('mouseup', () => { draggedAttractor = null; });

  document.getElementById('speed').addEventListener('input', (e) => {
    speedMultiplier = parseFloat(e.target.value);
    document.getElementById('speedVal').textContent = speedMultiplier + 'x';
  });
  document.getElementById('force').addEventListener('input', (e) => {
    forceMultiplier = parseFloat(e.target.value);
    document.getElementById('forceVal').textContent = forceMultiplier.toFixed(1);
  });
  document.getElementById('count').addEventListener('input', (e) => {
    maxParticles = parseInt(e.target.value);
    document.getElementById('countVal').textContent = maxParticles;
    while (particles.length < maxParticles) particles.push(new Particle());
    if (particles.length > maxParticles) particles.length = maxParticles;
  });
  document.getElementById('toggleField').addEventListener('click', () => {
    showField = !showField;
  });
  document.getElementById('burstBtn').addEventListener('click', () => {
    for (let i = 0; i < 50; i++) {
      const p = new Particle(width / 2, height / 2);
      p.vx = (Math.random() - 0.5) * 8;
      p.vy = (Math.random() - 0.5) * 8;
      particles.push(p);
    }
    if (particles.length > 600) particles.splice(0, 50);
  });
</script>
</body>
</html>`,
  },
  {
    id: 'agent-thought-tree-visualizer',
    title: 'AgentThought: Dynamic Tree-of-Thought Visualizer',
    slug: 'agent-thought-tree-visualizer',
    summary: 'Interactive branching reasoning tree visualization demonstrating how autonomous LLM agents explore, evaluate, prune, and backtrack through decision paths in real time.',
    category: 'Autonomous Agents',
    tool: 'Lovable',
    modelUsed: 'GPT-4o',
    author: {
      name: 'Julian Vance, PhD',
      role: 'Postdoctoral Fellow',
      affiliation: 'VibeLab / Cognitive Robotics',
      github: 'jvance-robotics',
    },
    sourceType: 'code',
    featured: true,
    stars: 128,
    testedWorking: true,
    createdAt: '2026-02-18T10:15:00Z',
    tags: ['agents', 'tree-of-thought', 'reasoning', 'decision-tree', 'search'],
    paperTitle: 'Empirical Visual Diagnostics for Multi-Turn Agentic Tree Search',
    paperUrl: 'https://arxiv.org/abs/2403.09211',
    promptRecipe: `Build a clean, high-tech Tree-of-Thought visualizer for LLM autonomous agent reasoning in Lovable.
Include an interactive node graph with branches for exploring hypotheses, heuristic reward scores (0.00 to 1.00), prune indicators, and step-by-step playback controls (Next Step, Branch Out, Backtrack, Reset).
When a user clicks any node, show an inspector pane with thought text, confidence metric, and simulated critique.`,
    systemPrompt: `You are a frontend engineer specializing in cognitive AI systems. Produce a zero-dependency HTML file with embedded styling and robust SVG/DOM rendering.`,
    iterationsSummary: `Initial prompt created a static hierarchy; v2 added interactive node generation and real-time path traversal animation.`,
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgentThought</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b0f19; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 320px; background: #111827; border-right: 1px solid #1f2937; display: flex; flex-direction: column; padding: 20px; z-index: 10; box-shadow: 4px 0 20px rgba(0,0,0,0.5); }
  .canvas-area { flex: 1; position: relative; overflow: auto; background: radial-gradient(circle at 50% 50%, #172033 0%, #0b0f19 100%); }
  h1 { font-size: 16px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .badge { background: #1e3a8a; color: #93c5fd; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
  .lead { font-size: 12px; color: #9ca3af; margin-bottom: 20px; line-height: 1.4; }
  .controls-box { background: #1f2937; border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
  .btn { background: #2563eb; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .btn:hover { background: #1d4ed8; }
  .btn-outline { background: transparent; border: 1px solid #374151; color: #cbd5e1; }
  .btn-outline:hover { background: #374151; color: #fff; }
  .inspector { flex: 1; background: #1e293b; border-radius: 8px; padding: 14px; overflow-y: auto; border: 1px solid #334155; }
  .inspector-title { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
  .node-title { font-size: 14px; font-weight: 600; color: #f8fafc; margin-bottom: 6px; }
  .score-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 12px; }
  .score-high { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
  .score-low { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
  .thought-content { font-size: 12px; color: #cbd5e1; line-height: 1.5; background: #0f172a; padding: 10px; border-radius: 6px; font-family: ui-monospace, monospace; }
  svg { width: 100%; height: 100%; min-width: 900px; min-height: 600px; }
  .node-group { cursor: pointer; transition: transform 0.2s; }
  .node-group:hover circle { stroke: #38bdf8; stroke-width: 3px; }
  .node-selected circle { stroke: #f59e0b !important; stroke-width: 4px !important; }
</style>
</head>
<body>
<div class="sidebar">
  <h1>AgentThought <span class="badge">Lovable</span></h1>
  <p class="lead">Interactive simulation of multi-step Tree-of-Thought exploration with pruning & backtracking.</p>
  
  <div class="controls-box">
    <button class="btn" id="nextStepBtn">&#9654; Explore Next Step</button>
    <button class="btn btn-outline" id="branchBtn">&#43; Branch Alternate Path</button>
    <button class="btn btn-outline" id="resetBtn">&#8635; Reset Reasoning Tree</button>
  </div>

  <div class="inspector" id="inspector">
    <div class="inspector-title">Active Node Details</div>
    <div id="inspectorContent">
      <p style="font-size:12px; color:#94a3b8;">Click any node on the tree to inspect the agent's thought trajectory and evaluation scores.</p>
    </div>
  </div>
</div>

<div class="canvas-area">
  <svg id="treeSvg">
    <g id="linksGroup"></g>
    <g id="nodesGroup"></g>
  </svg>
</div>

<script>
  const nodes = [
    { id: 'root', label: 'Goal: Synthesize Compound', depth: 0, x: 110, y: 230, score: 0.95, status: 'active', thought: "Initialize planning search: Target molecule requires chiral condensation with catalyst alpha-9.", critique: "Viable starting condition. Low reaction barrier." },
    { id: 'n1', parent: 'root', label: 'Path A: Direct Heating', depth: 1, x: 320, y: 120, score: 0.42, status: 'pruned', thought: "Apply elevated thermal bath (180°C) over 4 hours.", critique: "High risk of thermal degradation for tertiary ester bonds. Pruned." },
    { id: 'n2', parent: 'root', label: 'Path B: Photoredox', depth: 1, x: 320, y: 310, score: 0.88, status: 'active', thought: "Employ blue LED (450nm) photocatalyst with iridium complex.", critique: "Clean radical generation with 92% enantiomeric excess." },
    { id: 'n3', parent: 'n2', label: 'B1: Continuous Flow', depth: 2, x: 540, y: 240, score: 0.94, status: 'optimal', thought: "Microfluidic flow reactor to avoid localized hot spots and control residence time.", critique: "Optimal scaling parameters verified against literature baseline." },
    { id: 'n4', parent: 'n2', label: 'B2: Batch Reaction', depth: 2, x: 540, y: 380, score: 0.61, status: 'evaluated', thought: "Standard 250ml stirred vessel with immersion well.", critique: "Light penetration decay beyond 2cm depth reduces yield to 48%." }
  ];

  let selectedNode = nodes[3];

  function renderTree() {
    const linksGroup = document.getElementById('linksGroup');
    const nodesGroup = document.getElementById('nodesGroup');
    linksGroup.innerHTML = '';
    nodesGroup.innerHTML = '';

    nodes.forEach(n => {
      if (n.parent) {
        const parent = nodes.find(p => p.id === n.parent);
        if (parent) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const dx = n.x - parent.x;
          const d = 'M ' + parent.x + ' ' + parent.y + ' C ' + (parent.x + dx/2) + ' ' + parent.y + ', ' + (parent.x + dx/2) + ' ' + n.y + ', ' + n.x + ' ' + n.y;
          path.setAttribute('d', d);
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', n.status === 'pruned' ? '#ef4444' : (n.status === 'optimal' ? '#22c55e' : '#3b82f6'));
          path.setAttribute('stroke-width', n.status === 'optimal' ? '3' : '2');
          path.setAttribute('stroke-dasharray', n.status === 'pruned' ? '4,4' : 'none');
          path.setAttribute('opacity', n.status === 'pruned' ? '0.5' : '0.8');
          linksGroup.appendChild(path);
        }
      }
    });

    nodes.forEach(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group' + (selectedNode && selectedNode.id === n.id ? ' node-selected' : ''));
      g.setAttribute('transform', \`translate(\${n.x}, \${n.y})\`);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '22');
      let fill = '#1e293b';
      let stroke = '#64748b';
      if (n.status === 'pruned') { fill = '#450a0a'; stroke = '#ef4444'; }
      if (n.status === 'optimal') { fill = '#052e16'; stroke = '#22c55e'; }
      if (n.status === 'active') { fill = '#172554'; stroke = '#38bdf8'; }

      circle.setAttribute('fill', fill);
      circle.setAttribute('stroke', stroke);
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);

      const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      scoreText.setAttribute('text-anchor', 'middle');
      scoreText.setAttribute('dy', '4');
      scoreText.setAttribute('fill', '#f8fafc');
      scoreText.setAttribute('font-size', '10');
      scoreText.setAttribute('font-weight', 'bold');
      scoreText.textContent = n.score.toFixed(2);
      g.appendChild(scoreText);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', '38');
      label.setAttribute('fill', '#cbd5e1');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-weight', '500');
      label.textContent = n.label;
      g.appendChild(label);

      g.addEventListener('click', () => {
        selectedNode = n;
        renderTree();
        showInspector(n);
      });

      nodesGroup.appendChild(g);
    });
  }

  function showInspector(n) {
    const isHigh = n.score >= 0.7;
    document.getElementById('inspectorContent').innerHTML = \`
      <div class="node-title">\${n.label}</div>
      <div class="score-chip \${isHigh ? 'score-high' : 'score-low'}">
        <span>Reward Heuristic:</span> <strong>\${n.score.toFixed(2)}</strong>
        <span>(\${n.status.toUpperCase()})</span>
      </div>
      <div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">Agent Thought:</div>
      <div class="thought-content">\${n.thought}</div>
      <div style="font-size:11px; color:#94a3b8; margin-top:10px; margin-bottom:6px;">Self-Critique & Verification:</div>
      <div class="thought-content" style="color:#a7f3d0;">\${n.critique}</div>
    \`;
  }

  let stepCounter = 1;
  document.getElementById('nextStepBtn').addEventListener('click', () => {
    const parent = selectedNode || nodes[nodes.length - 1];
    const newId = 'step_' + stepCounter++;
    const depth = (parent.depth || 0) + 1;
    const score = +(Math.random() * 0.4 + 0.6).toFixed(2);
    const newNode = {
      id: newId,
      parent: parent.id,
      label: 'Step ' + stepCounter + ': Heuristic Eval',
      depth: depth,
      x: parent.x + 220,
      y: parent.y + (Math.random() - 0.5) * 140,
      score: score,
      status: score >= 0.85 ? 'optimal' : 'active',
      thought: "Explored sub-branch: Computed convergence gradient delta = " + (Math.random() * 0.05).toFixed(4),
      critique: "Step verified against simulated domain constraints."
    };
    nodes.push(newNode);
    selectedNode = newNode;
    renderTree();
    showInspector(newNode);
  });

  document.getElementById('branchBtn').addEventListener('click', () => {
    const parent = selectedNode || nodes[0];
    const newId = 'alt_' + stepCounter++;
    const score = +(Math.random() * 0.5 + 0.3).toFixed(2);
    const newNode = {
      id: newId,
      parent: parent.id,
      label: 'Alt ' + stepCounter + ': Counter-Hypothesis',
      depth: (parent.depth || 0) + 1,
      x: parent.x + 200,
      y: parent.y + (Math.random() > 0.5 ? 90 : -90),
      score: score,
      status: score < 0.5 ? 'pruned' : 'evaluated',
      thought: "Contrarian exploration branch to avoid local minima.",
      critique: score < 0.5 ? "Degenerate branch detected. Pruned." : "Marginally acceptable frontier."
    };
    nodes.push(newNode);
    selectedNode = newNode;
    renderTree();
    showInspector(newNode);
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    nodes.length = 5;
    selectedNode = nodes[3];
    renderTree();
    showInspector(selectedNode);
  });

  renderTree();
  showInspector(selectedNode);
</script>
</body>
</html>`,
  },
  {
    id: 'prompt-morph-generative-ui',
    title: 'PromptMorph: Dynamic Adaptive Generative UI',
    slug: 'prompt-morph-generative-ui',
    summary: 'A responsive generative UI workspace vibecoded with v0, showing how on-the-fly component synthesis morphs user interfaces based on user intent and cognitive load metrics.',
    category: 'Generative Interfaces',
    tool: 'v0 by Vercel',
    modelUsed: 'Claude 3.5 Sonnet',
    author: {
      name: 'Dr. Sarah Lin',
      role: 'Principal Investigator',
      affiliation: 'VibeLab / Stanford HCI Collaborator',
      github: 'slin-lab',
    },
    sourceType: 'code',
    featured: true,
    stars: 115,
    testedWorking: true,
    createdAt: '2026-02-25T18:40:00Z',
    tags: ['generative-ui', 'adaptive', 'v0', 'ui-synthesis', 'human-centered'],
    paperTitle: 'Generative Interfaces for Non-Deterministic Human-AI Workflows',
    paperUrl: 'https://arxiv.org/abs/2404.11029',
    promptRecipe: `Create an interactive generative UI playground in v0 by Vercel.
The user can select different cognitive states: "Deep Focus (Minimalist)", "Analytical Audit (Dense Data)", "Creative Brainstorm (Spatial Cards)", and "Executive Summary (Key Metrics)".
The UI components on screen should smoothly morph their typography, densities, layout, and visual widgets between these modes.
Include live parameter controls for ambiguity tolerance, AI autonomy slider, and widget customization.`,
    systemPrompt: `Build a modern responsive web app in clean HTML/CSS/JS with zero external CDNs required.`,
    iterationsSummary: `Added dynamic CSS transitions between density states and interactive mock charts.`,
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PromptMorph</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; min-height: 100vh; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .title-group h1 { font-size: 20px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
  .sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  .mode-selector { display: flex; background: #1e293b; padding: 4px; border-radius: 10px; border: 1px solid #334155; gap: 4px; }
  .mode-btn { background: transparent; border: none; color: #94a3b8; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .mode-btn.active { background: #0284c7; color: #ffffff; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 20px; }
  .card { background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
  .card-title { font-size: 13px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; display: flex; justify-content: space-between; }
  .stat { font-size: 32px; font-weight: 800; color: #38bdf8; }
  .stat-label { font-size: 12px; color: #64748b; margin-top: 2px; }
  .bar-container { background: #0f172a; border-radius: 8px; height: 10px; overflow: hidden; margin-top: 12px; }
  .bar-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); width: 68%; }
  /* Morphing states */
  body.mode-minimal .card { background: #111827; border-color: #1f2937; padding: 16px; }
  body.mode-minimal .grid { grid-template-columns: 1fr; max-width: 650px; margin: 20px auto; }
  body.mode-dense .grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
  body.mode-dense .card { padding: 12px; font-size: 11px; }
  body.mode-dense .stat { font-size: 20px; }
  body.mode-creative { background: #18182b; }
  body.mode-creative .card { border-radius: 20px; border-color: #7c3aed; background: rgba(30, 27, 75, 0.7); backdrop-filter: blur(8px); transform: rotate(-0.5deg); }
  body.mode-creative .card:nth-child(2) { transform: rotate(0.8deg); }
  .slider-box { display: flex; align-items: center; gap: 12px; background: #1e293b; padding: 10px 16px; border-radius: 8px; font-size: 12px; }
  .slider-box input { accent-color: #38bdf8; }
</style>
</head>
<body>
<div class="header">
  <div class="title-group">
    <h1>PromptMorph Generative Shell <span style="font-size:11px; background:#0369a1; color:#e0f2fe; padding:2px 8px; border-radius:999px;">v0.dev</span></h1>
    <div class="sub">Dynamic UI morphing driven by cognitive load telemetry. Click modes to morph.</div>
  </div>
  <div class="mode-selector">
    <button class="mode-btn active" onclick="setMode('standard')">Standard</button>
    <button class="mode-btn" onclick="setMode('minimal')">Deep Focus</button>
    <button class="mode-btn" onclick="setMode('dense')">Audit (Dense)</button>
    <button class="mode-btn" onclick="setMode('creative')">Spatial Idea</button>
  </div>
</div>

<div class="slider-box" style="margin-bottom: 20px;">
  <span>AI Autonomy Level:</span>
  <input type="range" id="autonomy" min="1" max="100" value="75" oninput="document.getElementById('autoVal').textContent = this.value + '%'">
  <strong id="autoVal" style="color:#38bdf8;">75%</strong>
  <span style="margin-left: auto; color:#94a3b8;">Synthesizing layout in <strong>14ms</strong></span>
</div>

<div class="grid">
  <div class="card">
    <div class="card-title"><span>Inference Throughput</span><span>Active</span></div>
    <div class="stat">1,420 <span style="font-size:14px; font-weight:normal; color:#94a3b8;">tok/sec</span></div>
    <div class="stat-label">&uarr; 18.4% above lab baseline</div>
    <div class="bar-container"><div class="bar-fill" style="width: 82%;"></div></div>
  </div>
  <div class="card">
    <div class="card-title"><span>Semantic Drift</span><span>Nominal</span></div>
    <div class="stat">0.038 <span style="font-size:14px; font-weight:normal; color:#94a3b8;">&Delta; MSE</span></div>
    <div class="stat-label">Vector stability confirmed across 4 runs</div>
    <div class="bar-container"><div class="bar-fill" style="width: 24%; background:#10b981;"></div></div>
  </div>
  <div class="card">
    <div class="card-title"><span>User Cognitive Load</span><span>Calculated</span></div>
    <div class="stat">42 <span style="font-size:14px; font-weight:normal; color:#94a3b8;">NASA-TLX</span></div>
    <div class="stat-label">Optimal task flow engagement zone</div>
    <div class="bar-container"><div class="bar-fill" style="width: 42%; background:#f59e0b;"></div></div>
  </div>
  <div class="card">
    <div class="card-title"><span>Active Agent Threads</span><span>Synced</span></div>
    <div class="stat">8 / 8</div>
    <div class="stat-label">Co-reasoning quorum achieved</div>
    <div class="bar-container"><div class="bar-fill" style="width: 100%; background:#8b5cf6;"></div></div>
  </div>
</div>

<script>
  function setMode(mode) {
    document.body.className = '';
    if (mode !== 'standard') {
      document.body.classList.add('mode-' + mode);
    }
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.toLowerCase().includes(mode.substring(0, 3))) {
        btn.classList.add('active');
      }
    });
  }
</script>
</body>
</html>`,
  },
  {
    id: 'neurograph-signal-explorer',
    title: 'NeuroGraph: Simulated EEG & Spike Streamer',
    slug: 'neurograph-signal-explorer',
    summary: 'A simulated high-frequency bio-signal and brain-computer interface stream with Fourier spectrum filtering, bandpass controls, and spike anomaly detection.',
    category: 'Computational Science',
    tool: 'Bolt.new',
    modelUsed: 'Claude 3.5 Sonnet',
    author: {
      name: 'Dr. Tariq Al-Mansoor',
      role: 'Research Scientist, Neural Interfaces',
      affiliation: 'VibeLab / NeuroTech',
      github: 'tariq-neuro',
    },
    sourceType: 'code',
    featured: false,
    stars: 87,
    testedWorking: true,
    createdAt: '2026-03-01T11:00:00Z',
    tags: ['eeg', 'signal-processing', 'bci', 'dsp', 'neuroscience'],
    paperTitle: 'Realtime Spectral Deconvolution in Low-Power Neural Implants',
    promptRecipe: `Generate a full-screen interactive EEG & neural spike streaming canvas in Bolt.new.
Simulate 4 distinct channels: Alpha (8-12Hz), Beta (13-30Hz), Theta (4-7Hz), and Gamma (30-80Hz).
Add sliders for signal noise amplitude, frequency drift, and a button to inject a synthetic motor-imagery evoked spike.
Include a live oscilloscope grid display with dynamic cursor measurement.`,
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NeuroGraph</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050811; color: #38bdf8; font-family: monospace; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
  header { background: #0c1222; border-bottom: 1px solid #1e293b; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
  h1 { font-size: 14px; font-weight: bold; letter-spacing: 0.1em; color: #38bdf8; }
  .controls { display: flex; gap: 12px; align-items: center; }
  button { background: #1e293b; color: #38bdf8; border: 1px solid #38bdf8; padding: 6px 14px; font-family: monospace; font-size: 11px; cursor: pointer; border-radius: 4px; }
  button:hover { background: #38bdf8; color: #050811; }
  canvas { flex: 1; width: 100%; display: block; }
</style>
</head>
<body>
<header>
  <h1>NEUROGRAPH // 4-CH SPECTRAL STREAM [BOLT.NEW]</h1>
  <div class="controls">
    <label>Noise: <input type="range" id="noise" min="0" max="10" value="3"></label>
    <button id="spikeBtn">Inject Motor Spike</button>
    <button id="freezeBtn">Freeze Stream</button>
  </div>
</header>
<canvas id="c"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight - 50; }
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  let noiseLevel = 3;
  let spikePulse = 0;
  let frozen = false;
  const history = Array.from({length: 4}, () => []);

  const channels = [
    { name: 'CH1: Alpha (10Hz)', freq: 10, amp: 35, color: '#38bdf8' },
    { name: 'CH2: Beta (22Hz)', freq: 22, amp: 20, color: '#a855f7' },
    { name: 'CH3: Theta (6Hz)', freq: 6, amp: 45, color: '#22c55e' },
    { name: 'CH4: Gamma (45Hz)', freq: 45, amp: 15, color: '#f59e0b' }
  ];

  function loop() {
    if (!frozen) {
      t += 0.05;
      if (spikePulse > 0) spikePulse *= 0.94;
      if (spikePulse < 0.01) spikePulse = 0;

      channels.forEach((ch, idx) => {
        const noise = (Math.random() - 0.5) * noiseLevel * 6;
        const spike = spikePulse * Math.sin(t * 15) * 80;
        const val = Math.sin(t * ch.freq * 0.4) * ch.amp + Math.cos(t * 1.8) * 10 + noise + spike;
        history[idx].push(val);
        if (history[idx].length > w) history[idx].shift();
      });
    }

    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    const chHeight = h / 4;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * chHeight); ctx.lineTo(w, i * chHeight); ctx.stroke();
    }

    // Render channels
    channels.forEach((ch, idx) => {
      const centerY = idx * chHeight + chHeight / 2;
      ctx.fillStyle = ch.color;
      ctx.font = '11px monospace';
      ctx.fillText(ch.name, 16, centerY - chHeight / 2 + 18);

      ctx.strokeStyle = ch.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const data = history[idx];
      for (let x = 0; x < data.length; x++) {
        const y = centerY + data[x];
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.getElementById('spikeBtn').addEventListener('click', () => { spikePulse = 1.5; });
  document.getElementById('freezeBtn').addEventListener('click', (e) => {
    frozen = !frozen;
    e.target.textContent = frozen ? 'Resume Stream' : 'Freeze Stream';
  });
  document.getElementById('noise').addEventListener('input', (e) => {
    noiseLevel = parseFloat(e.target.value);
  });
</script>
</body>
</html>`,
  },
  {
    id: 'cognitive-canvas-spatial-notes',
    title: 'CognitiveCanvas: Infinite Spatial Ideation Mesh',
    slug: 'cognitive-canvas-spatial-notes',
    summary: 'A fast, fluid spatial ideation canvas vibecoded in Cursor with dynamic connecting links, thought clustering, and markdown note blocks.',
    category: 'Cognitive & Thinking Tools',
    tool: 'Cursor',
    modelUsed: 'Claude 3.5 Sonnet',
    author: {
      name: 'Kai Robertson',
      role: 'Graduate Researcher',
      affiliation: 'VibeLab / Knowledge Tools',
      github: 'kairobertson',
    },
    sourceType: 'code',
    featured: false,
    stars: 76,
    testedWorking: true,
    createdAt: '2026-03-02T16:00:00Z',
    tags: ['spatial-canvas', 'knowledge-graph', 'notes', 'cursor', 'ideation'],
    promptRecipe: `Build an interactive infinite 2D spatial canvas with drag-and-drop research note cards.
Include dynamic bezier curves connecting related concepts, ability to double-click to spawn new note cards, and a tag filter bar.`,
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CognitiveCanvas</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0e17; color: #f8fafc; font-family: -apple-system, sans-serif; overflow: hidden; height: 100vh; user-select: none; }
  #svg-layer { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .card { position: absolute; width: 220px; background: #151d2f; border: 1px solid #2d3b55; border-radius: 8px; padding: 12px; cursor: move; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .card:hover { border-color: #38bdf8; }
  .card-head { font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px; }
  .card-body { font-size: 12px; color: #cbd5e1; line-height: 1.4; }
  .hint { position: absolute; top: 16px; left: 16px; background: rgba(15,23,42,0.8); padding: 8px 14px; border-radius: 6px; font-size: 12px; color: #94a3b8; border: 1px solid #1e293b; }
</style>
</head>
<body>
<div class="hint">CognitiveCanvas &bull; Drag cards &bull; Double-click background to spawn note</div>
<svg id="svg-layer"></svg>
<div id="cards"></div>
<script>
  const cardsData = [
    { id: '1', title: 'Hypothesis A', text: 'Vibecoding reduces prototype turnaround time by 6.4x in early ideation.', x: 80, y: 120 },
    { id: '2', title: 'Empirical Evidence', text: 'Observed in 24 student researcher trials with Claude and Lovable.', x: 380, y: 180 },
    { id: '3', title: 'Open Question', text: 'Does prompt scaffolding limit exploratory architectural divergence?', x: 260, y: 380 }
  ];
  const links = [{ from: '1', to: '2' }, { from: '2', to: '3' }];

  const container = document.getElementById('cards');
  const svg = document.getElementById('svg-layer');

  function render() {
    container.innerHTML = '';
    cardsData.forEach(c => {
      const el = document.createElement('div');
      el.className = 'card';
      el.id = 'c_' + c.id;
      el.style.left = c.x + 'px';
      el.style.top = c.y + 'px';
      el.innerHTML = \`<div class="card-head">\${c.title}</div><div class="card-body">\${c.text}</div>\`;
      
      let isDragging = false;
      let startX, startY;
      el.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - c.x;
        startY = e.clientY - c.y;
      });
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        c.x = e.clientX - startX;
        c.y = e.clientY - startY;
        el.style.left = c.x + 'px';
        el.style.top = c.y + 'px';
        renderLinks();
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      container.appendChild(el);
    });
    renderLinks();
  }

  function renderLinks() {
    svg.innerHTML = '';
    links.forEach(l => {
      const c1 = cardsData.find(c => c.id === l.from);
      const c2 = cardsData.find(c => c.id === l.to);
      if (!c1 || !c2) return;
      const x1 = c1.x + 110, y1 = c1.y + 40;
      const x2 = c2.x + 110, y2 = c2.y + 40;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const dx = (x2 - x1) / 2;
      path.setAttribute('d', \`M \${x1} \${y1} C \${x1 + dx} \${y1}, \${x2 - dx} \${y2}, \${x2} \${y2}\`);
      path.setAttribute('stroke', '#38bdf8');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-dasharray', '5,5');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.6');
      svg.appendChild(path);
    });
  }

  window.addEventListener('dblclick', (e) => {
    if (e.target.closest('.card')) return;
    const newCard = {
      id: String(Date.now()),
      title: 'Note ' + (cardsData.length + 1),
      text: 'Interactive thought node generated at (' + e.clientX + ', ' + e.clientY + ')',
      x: e.clientX - 100,
      y: e.clientY - 40
    };
    cardsData.push(newCard);
    links.push({ from: cardsData[cardsData.length - 2].id, to: newCard.id });
    render();
  });

  render();
</script>
</body>
</html>`,
  },
  {
    id: 'synapse-3d-neural-orb',
    title: 'Synapse3D: Interactive Neural Topology Globe',
    slug: 'synapse-3d-neural-orb',
    summary: 'A 3D spatial neural network sphere with rotatable mouse-trackball, synaptic transmission pulses, and excitation threshold triggers.',
    category: 'Creative & 3D Media',
    tool: 'Custom Prompt',
    modelUsed: 'Gemini 2.0 Flash',
    author: {
      name: 'Maya Chen',
      role: 'PhD Candidate',
      affiliation: 'VibeLab',
      github: 'mayachen-ai',
    },
    sourceType: 'code',
    featured: false,
    stars: 94,
    testedWorking: true,
    createdAt: '2026-03-03T14:30:00Z',
    tags: ['3d', 'neural-net', 'canvas-3d', 'synapses', 'interactive'],
    promptRecipe: `Create a 3D rotating spherical brain neural network in pure HTML5 Canvas with zero dependencies.
Draw nodes across a sphere using 3D perspective projection (X, Y, Z coordinates).
Rotate the sphere smoothly based on mouse drag. Synaptic impulses should travel along lines connecting neighboring nodes.`,
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Synapse3D</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #030712; color: #38bdf8; overflow: hidden; height: 100vh; font-family: monospace; }
  canvas { display: block; width: 100%; height: 100%; cursor: grab; }
  canvas:active { cursor: grabbing; }
  .banner { position: absolute; top: 16px; left: 16px; pointer-events: none; background: rgba(3, 7, 18, 0.7); padding: 10px 16px; border-radius: 8px; border: 1px solid #1f2937; }
</style>
</head>
<body>
<div class="banner">
  <strong>SYNAPSE 3D // NEURAL SPHERE</strong><br>
  <span style="color:#94a3b8; font-size:11px;">Drag mouse to rotate 3D sphere &bull; Click to stimulate synapses</span>
</div>
<canvas id="c"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const numNodes = 120;
  const radius = 220;
  const nodes = [];

  for (let i = 0; i < numNodes; i++) {
    const phi = Math.acos(-1 + (2 * i) / numNodes);
    const theta = Math.sqrt(numNodes * Math.PI) * phi;
    nodes.push({
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
      pulse: 0
    });
  }

  let rotX = 0.2;
  let rotY = 0.3;
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;

  window.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    // excite random node
    nodes[Math.floor(Math.random() * nodes.length)].pulse = 1;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  function loop() {
    if (!isDragging) {
      rotY += 0.004;
      rotX += 0.001;
    }
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    const projected = nodes.map(n => {
      if (n.pulse > 0) n.pulse *= 0.96;
      // rotate Y
      let x1 = n.x * cosY - n.z * sinY;
      let z1 = n.z * cosY + n.x * sinY;
      // rotate X
      let y2 = n.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + n.y * sinX;

      const fov = 400;
      const scale = fov / (fov + z2);
      return {
        x: w / 2 + x1 * scale,
        y: h / 2 + y2 * scale,
        scale: scale,
        z: z2,
        pulse: n.pulse
      };
    });

    // Draw connecting edges
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 65) {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    projected.sort((a, b) => b.z - a.z);
    projected.forEach(p => {
      const alpha = Math.max(0.15, (p.z + radius) / (radius * 2));
      ctx.fillStyle = p.pulse > 0.1 ? '#f43f5e' : '#38bdf8';
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (3.5 + p.pulse * 6) * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
</script>
</body>
</html>`,
  },
];

export const LAB_PUBLICATIONS: LabPublication[] = [
  {
    id: 'pub-chi-2025-latent',
    title: 'Steering Continuous Latent Manifolds via Direct Vector Field Manipulation',
    authors: ['Maya Chen', 'Sarah Lin', 'Julian Vance'],
    venue: 'ACM Conference on Human Factors in Computing Systems (CHI 2025)',
    year: 2025,
    abstract: 'We introduce LatentFlow, a dynamic vector-field steering framework enabling rapid exploration of high-dimensional generative latent spaces using vibecoded interactive prototypes.',
    paperUrl: 'https://arxiv.org/abs/2405.01948',
    linkedProjectId: 'latent-flow-vector-field',
    tags: ['Human-AI Interaction', 'Latent Space', 'CHI'],
  },
  {
    id: 'pub-neurips-2024-tree',
    title: 'Empirical Visual Diagnostics for Multi-Turn Agentic Tree Search',
    authors: ['Julian Vance', 'Tariq Al-Mansoor', 'Sarah Lin'],
    venue: 'NeurIPS 2024 Workshop on Agentic AI Systems',
    year: 2024,
    abstract: 'This paper documents AgentThought, a visual exploration diagnostic tool vibecoded in Lovable for diagnosing multi-step LLM hallucination and branching heuristics.',
    paperUrl: 'https://arxiv.org/abs/2403.09211',
    linkedProjectId: 'agent-thought-tree-visualizer',
    tags: ['Autonomous Agents', 'Reasoning Trees', 'NeurIPS'],
  },
  {
    id: 'pub-uist-2024-genui',
    title: 'Generative Interfaces for Non-Deterministic Human-AI Workflows',
    authors: ['Sarah Lin', 'Kai Robertson', 'Maya Chen'],
    venue: 'ACM Symposium on User Interface Software and Technology (UIST 2024)',
    year: 2024,
    abstract: 'Investigating adaptive UI synthesis where components morph in response to estimated user cognitive load, prototyped rapidly via v0 and client-side web sandboxes.',
    paperUrl: 'https://arxiv.org/abs/2404.11029',
    linkedProjectId: 'prompt-morph-generative-ui',
    tags: ['Generative Interfaces', 'UIST'],
  },
];

export const LAB_MEMBERS: LabMember[] = [
  {
    id: 'm-slin',
    name: 'Dr. Sarah Lin',
    role: 'Principal Investigator & Lab Director',
    bio: 'Associate Professor studying human-AI co-creation, adaptive generative interfaces, and high-velocity prototyping workflows.',
    github: 'slin-lab',
    email: 'slin@vibelab.org',
    contributedProjectIds: ['prompt-morph-generative-ui'],
  },
  {
    id: 'm-mchen',
    name: 'Maya Chen',
    role: 'PhD Candidate (HCI & Visual Computing)',
    bio: 'Focusing on direct manipulation interfaces for continuous neural embeddings and creative interactive AI tools.',
    github: 'mayachen-ai',
    email: 'mchen@vibelab.org',
    contributedProjectIds: ['latent-flow-vector-field', 'synapse-3d-neural-orb'],
  },
  {
    id: 'm-jvance',
    name: 'Julian Vance, PhD',
    role: 'Postdoctoral Fellow (Autonomous Systems)',
    bio: 'Investigating cognitive architectures, agentic search trees, and transparent reasoning diagnostics for autonomous decision systems.',
    github: 'jvance-robotics',
    contributedProjectIds: ['agent-thought-tree-visualizer'],
  },
  {
    id: 'm-talmansoor',
    name: 'Dr. Tariq Al-Mansoor',
    role: 'Research Scientist (Neural & Bio-Signals)',
    bio: 'Bridging brain-computer interface DSP algorithms with web-native visualization sandboxes.',
    github: 'tariq-neuro',
    contributedProjectIds: ['neurograph-signal-explorer'],
  },
  {
    id: 'm-krobertson',
    name: 'Kai Robertson',
    role: 'Graduate Student Researcher',
    bio: 'Exploring spatial thinking media, associative memory graphs, and vibecoded interactive science notebooks.',
    github: 'kairobertson',
    contributedProjectIds: ['cognitive-canvas-spatial-notes'],
  },
];
