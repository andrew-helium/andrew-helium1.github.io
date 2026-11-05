import { VibeProject, VibecodingTool, ProjectFilterState } from '../types/project';

/**
 * Automatically infers the vibecoding tool from a pasted URL or code snippet.
 */
export function detectVibecodingTool(urlOrSnippet: string): VibecodingTool {
  const lower = urlOrSnippet.toLowerCase();

  if (lower.includes('lovable.dev') || lower.includes('lovable.app') || lower.includes('gptengineer')) {
    return 'Lovable';
  }
  if (lower.includes('claude.site') || lower.includes('claude.ai') || lower.includes('anthropic.com')) {
    return 'Claude Artifacts';
  }
  if (lower.includes('v0.dev') || lower.includes('v0.app') || lower.includes('vercel.app')) {
    return 'v0 by Vercel';
  }
  if (lower.includes('bolt.new') || lower.includes('stackblitz.com') || lower.includes('webcontainer')) {
    return 'Bolt.new';
  }
  if (lower.includes('replit.com') || lower.includes('replit.app')) {
    return 'Replit';
  }
  if (lower.includes('cursor.sh') || lower.includes('cursor.com')) {
    return 'Cursor';
  }

  return 'Custom Prompt';
}

/**
 * Validates a project before saving or exporting.
 */
export function validateProjectInput(input: Partial<VibeProject>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push('Title is required.');
  } else if (input.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters.');
  }

  if (!input.summary || input.summary.trim().length === 0) {
    errors.push('Summary or description is required.');
  }

  if (!input.category) {
    errors.push('Research category is required.');
  }

  if (!input.tool) {
    errors.push('Vibecoding tool is required.');
  }

  if (!input.author || !input.author.name || input.author.name.trim().length === 0) {
    errors.push('Author name is required.');
  }

  if (input.sourceType === 'code') {
    if (!input.rawHtml || input.rawHtml.trim().length === 0) {
      errors.push('Executable HTML/JS code is required when source type is "code".');
    }
  } else if (input.sourceType === 'embed_url') {
    if (!input.embedUrl || input.embedUrl.trim().length === 0) {
      errors.push('A valid prototype URL is required when source type is "embed_url".');
    } else {
      try {
        new URL(input.embedUrl);
      } catch {
        errors.push('The prototype URL must be a valid HTTP or HTTPS URL.');
      }
    }
  } else {
    errors.push('Source type must be either "code" or "embed_url".');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Filter and sort a list of vibecoded projects.
 */
export function filterAndSortProjects(
  projects: VibeProject[],
  filters: ProjectFilterState
): VibeProject[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    // Search query match
    if (query) {
      const matchTitle = project.title.toLowerCase().includes(query);
      const matchSummary = project.summary.toLowerCase().includes(query);
      const matchAuthor = project.author.name.toLowerCase().includes(query);
      const matchTags = project.tags.some((t) => t.toLowerCase().includes(query));
      const matchPrompt = project.promptRecipe.toLowerCase().includes(query);
      const matchModel = project.modelUsed ? project.modelUsed.toLowerCase().includes(query) : false;

      if (!matchTitle && !matchSummary && !matchAuthor && !matchTags && !matchPrompt && !matchModel) {
        return false;
      }
    }

    // Category filter
    if (filters.category !== 'All' && project.category !== filters.category) {
      return false;
    }

    // Tool filter
    if (filters.tool !== 'All' && project.tool !== filters.tool) {
      return false;
    }

    // Specific tag filter
    if (filters.tag && !project.tags.includes(filters.tag)) {
      return false;
    }

    // Source type filter
    if (filters.sourceType !== 'All' && project.sourceType !== filters.sourceType) {
      return false;
    }

    return true;
  });

  // Sorting
  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'featured':
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return (b.stars || 0) - (a.stars || 0);
      case 'stars':
        return (b.stars || 0) - (a.stars || 0);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
}

/**
 * Generates copyable Markdown for submitting a project to the research lab's GitHub repository
 * as an Issue or Pull Request.
 */
export function generateGitHubSubmissionMarkdown(project: VibeProject): string {
  return `### Vibecoded Research Prototype Submission

**Title:** ${project.title}
**Category:** ${project.category}
**Vibecoding Tool:** ${project.tool} ${project.modelUsed ? `(${project.modelUsed})` : ''}
**Author:** ${project.author.name} (${project.author.role}${project.author.affiliation ? ` - ${project.author.affiliation}` : ''})
${project.author.github ? `**GitHub:** @${project.author.github}\n` : ''}
${project.paperTitle ? `**Related Paper:** [${project.paperTitle}](${project.paperUrl || '#'})\n` : ''}

#### Summary
${project.summary}

#### Tags
${project.tags.map((t) => `\`#${t}\``).join(' ')}

#### The Vibe Recipe (Original Prompt)
\`\`\`text
${project.promptRecipe}
\`\`\`

${project.systemPrompt ? `#### System Prompt / Vibe Configuration\n\`\`\`text\n${project.systemPrompt}\n\`\`\`\n` : ''}

#### Implementation Details
- **Source Type:** ${project.sourceType}
${project.embedUrl ? `- **Live Preview URL:** ${project.embedUrl}` : ''}
${project.rawHtml ? `- **Code Payload:** (Executable HTML bundle included below)` : ''}

<details>
<summary>Click to view JSON payload for <code>vibecoded_catalog.json</code></summary>

\`\`\`json
${JSON.stringify(project, null, 2)}
\`\`\`
</details>
`;
}

/**
 * Serializes projects to JSON formatted for committing to GitHub Pages repository.
 */
export function serializeProjectsToJson(projects: VibeProject[]): string {
  return JSON.stringify(
    {
      catalogVersion: '1.0.0',
      lastExported: new Date().toISOString(),
      projectCount: projects.length,
      projects,
    },
    null,
    2
  );
}

/**
 * Parses and validates an imported catalog JSON string.
 */
export function parseProjectsFromJson(jsonStr: string): { success: boolean; projects?: VibeProject[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    let candidateList: unknown = null;

    if (Array.isArray(parsed)) {
      candidateList = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).projects)) {
      candidateList = (parsed as Record<string, unknown>).projects;
    } else {
      return { success: false, error: 'JSON must be an array of projects or an object containing a "projects" array.' };
    }

    const validated: VibeProject[] = [];
    for (const item of candidateList as unknown[]) {
      if (!item || typeof item !== 'object') continue;
      const p = item as Partial<VibeProject>;
      if (!p.id || !p.title || (!p.rawHtml && !p.embedUrl)) {
        continue;
      }
      validated.push({
        id: String(p.id),
        title: String(p.title),
        slug: p.slug ? String(p.slug) : String(p.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: p.summary ? String(p.summary) : '',
        category: (p.category as any) || 'Human-AI Interaction',
        tool: (p.tool as any) || 'Custom Prompt',
        modelUsed: p.modelUsed ? String(p.modelUsed) : undefined,
        author: {
          name: p.author?.name ? String(p.author.name) : 'Anonymous Researcher',
          role: p.author?.role ? String(p.author.role) : 'Contributor',
          github: p.author?.github ? String(p.author.github) : undefined,
        },
        sourceType: p.sourceType === 'embed_url' ? 'embed_url' : 'code',
        rawHtml: p.rawHtml ? String(p.rawHtml) : undefined,
        embedUrl: p.embedUrl ? String(p.embedUrl) : undefined,
        promptRecipe: p.promptRecipe ? String(p.promptRecipe) : 'Prompt not recorded',
        tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
        paperTitle: p.paperTitle ? String(p.paperTitle) : undefined,
        paperUrl: p.paperUrl ? String(p.paperUrl) : undefined,
        featured: Boolean(p.featured),
        stars: typeof p.stars === 'number' ? p.stars : 0,
        testedWorking: p.testedWorking !== false,
        createdAt: p.createdAt ? String(p.createdAt) : new Date().toISOString(),
      });
    }

    if (validated.length === 0) {
      return { success: false, error: 'No valid vibecoded projects found in the provided JSON file.' };
    }

    return { success: true, projects: validated };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Invalid JSON syntax.' };
  }
}
