import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectVibecodingTool,
  validateProjectInput,
  filterAndSortProjects,
  generateGitHubSubmissionMarkdown,
  serializeProjectsToJson,
  parseProjectsFromJson,
} from './projectHelpers';
import { VibeProject, ProjectFilterState } from '../types/project';

test('detectVibecodingTool correctly identifies major vibe platforms', () => {
  assert.equal(detectVibecodingTool('https://lovable.dev/projects/1234'), 'Lovable');
  assert.equal(detectVibecodingTool('https://lovable.app/p/demo'), 'Lovable');
  assert.equal(detectVibecodingTool('https://claude.site/artifacts/xyz-789'), 'Claude Artifacts');
  assert.equal(detectVibecodingTool('https://v0.dev/chat/b/abcdef'), 'v0 by Vercel');
  assert.equal(detectVibecodingTool('https://bolt.new/~/sb1-test'), 'Bolt.new');
  assert.equal(detectVibecodingTool('https://replit.com/@user/demo-app'), 'Replit');
  assert.equal(detectVibecodingTool('https://cursor.com/share/abcdef'), 'Cursor');
  assert.equal(detectVibecodingTool('https://my-lab-experiment.org/canvas'), 'Custom Prompt');
});

test('validateProjectInput requires mandatory metadata and valid sources', () => {
  // Empty project should fail
  const emptyRes = validateProjectInput({});
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.errors.length >= 4);

  // Missing code in code sourceType
  const missingCodeRes = validateProjectInput({
    title: 'Neural Playground',
    summary: 'A cool explorer',
    category: 'Human-AI Interaction',
    tool: 'Claude Artifacts',
    author: { name: 'Dr. Jane Doe', role: 'PI' },
    sourceType: 'code',
    rawHtml: '',
  });
  assert.equal(missingCodeRes.valid, false);
  assert.ok(missingCodeRes.errors.some((e) => e.includes('Executable HTML/JS code is required')));

  // Valid project
  const validRes = validateProjectInput({
    title: 'Neural Playground',
    summary: 'A cool explorer',
    category: 'Human-AI Interaction',
    tool: 'Claude Artifacts',
    author: { name: 'Dr. Jane Doe', role: 'PI' },
    sourceType: 'code',
    rawHtml: '<h1>Interactive Demo</h1>',
  });
  assert.equal(validRes.valid, true);
  assert.equal(validRes.errors.length, 0);

  // Invalid URL in embed_url sourceType
  const badUrlRes = validateProjectInput({
    title: 'Agent Sim',
    summary: 'Agent test',
    category: 'Autonomous Agents',
    tool: 'Lovable',
    author: { name: 'Bob', role: 'Researcher' },
    sourceType: 'embed_url',
    embedUrl: 'not-a-valid-url',
  });
  assert.equal(badUrlRes.valid, false);
});

test('filterAndSortProjects accurately matches queries, categories, and tools', () => {
  const dummyProjects: VibeProject[] = [
    {
      id: 'p1',
      title: 'Latent Space Navigator',
      slug: 'latent-space-navigator',
      summary: 'High dimensional PCA visualizer',
      category: 'Human-AI Interaction',
      tool: 'Claude Artifacts',
      author: { name: 'Alice Researcher', role: 'PhD Student' },
      sourceType: 'code',
      rawHtml: '<div>1</div>',
      promptRecipe: 'Build a vector field with particles',
      tags: ['embeddings', 'visualization'],
      featured: true,
      stars: 42,
      createdAt: '2026-01-10T00:00:00.000Z',
    },
    {
      id: 'p2',
      title: 'Multi-Agent Debate Arena',
      slug: 'multi-agent-debate',
      summary: 'Simulated consensus engine',
      category: 'Autonomous Agents',
      tool: 'Lovable',
      author: { name: 'Bob Engineer', role: 'Research Fellow' },
      sourceType: 'code',
      rawHtml: '<div>2</div>',
      promptRecipe: 'Create a turn-based debate simulator',
      tags: ['agents', 'reasoning'],
      featured: false,
      stars: 18,
      createdAt: '2026-02-15T00:00:00.000Z',
    },
  ];

  const defaultFilters: ProjectFilterState = {
    searchQuery: '',
    category: 'All',
    tool: 'All',
    sourceType: 'All',
    sortBy: 'featured',
  };

  // Check category filter
  const catFilter = filterAndSortProjects(dummyProjects, {
    ...defaultFilters,
    category: 'Autonomous Agents',
  });
  assert.equal(catFilter.length, 1);
  assert.equal(catFilter[0].id, 'p2');

  // Check search query in tags/prompt
  const queryFilter = filterAndSortProjects(dummyProjects, {
    ...defaultFilters,
    searchQuery: 'vector field',
  });
  assert.equal(queryFilter.length, 1);
  assert.equal(queryFilter[0].id, 'p1');

  // Check tool filter
  const toolFilter = filterAndSortProjects(dummyProjects, {
    ...defaultFilters,
    tool: 'Lovable',
  });
  assert.equal(toolFilter.length, 1);
  assert.equal(toolFilter[0].id, 'p2');
});

test('serialize and parse JSON preserves project fidelity for GitHub Pages storage', () => {
  const sample: VibeProject[] = [
    {
      id: 'demo-1',
      title: 'Vibe Project One',
      slug: 'vibe-project-one',
      summary: 'Demo summary',
      category: 'Generative Interfaces',
      tool: 'v0 by Vercel',
      author: { name: 'Charlie', role: 'Staff Scientist' },
      sourceType: 'code',
      rawHtml: '<p>Interactive</p>',
      promptRecipe: 'Create a sleek dashboard',
      tags: ['ui', 'generative'],
      featured: true,
      stars: 10,
      createdAt: '2026-03-01T00:00:00.000Z',
    },
  ];

  const json = serializeProjectsToJson(sample);
  assert.ok(json.includes('Vibe Project One'));
  assert.ok(json.includes('v0 by Vercel'));

  const parsed = parseProjectsFromJson(json);
  assert.equal(parsed.success, true);
  assert.ok(parsed.projects);
  assert.equal(parsed.projects.length, 1);
  assert.equal(parsed.projects[0].title, 'Vibe Project One');
});

test('generateGitHubSubmissionMarkdown generates formatted markdown with vibe recipe', () => {
  const p: VibeProject = {
    id: 'test-gh',
    title: 'Synthetic Memory Graph',
    slug: 'synthetic-memory-graph',
    summary: 'Exploring associative memory graphs',
    category: 'Cognitive & Thinking Tools',
    tool: 'Claude Artifacts',
    modelUsed: 'Claude 3.7 Sonnet',
    author: { name: 'Elena', role: 'Postdoc', github: 'elena-ai' },
    sourceType: 'code',
    rawHtml: '<div>Test</div>',
    promptRecipe: 'Simulate Hopfield associative network memory recall in Canvas',
    tags: ['memory', 'graphs', 'ai'],
    createdAt: '2026-03-05T00:00:00.000Z',
  };

  const md = generateGitHubSubmissionMarkdown(p);
  assert.ok(md.includes('Synthetic Memory Graph'));
  assert.ok(md.includes('Claude 3.7 Sonnet'));
  assert.ok(md.includes('Hopfield associative network memory recall'));
  assert.ok(md.includes('@elena-ai'));
  assert.ok(md.includes('vibecoded_catalog.json'));
});
