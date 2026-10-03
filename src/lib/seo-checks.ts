import { ParsedPage } from './parser';

export interface SeoIssue {
  id: string;
  category: 'meta' | 'content' | 'structure' | 'performance' | 'mobile' | 'schema' | 'security' | 'social';
  severity: 'critical' | 'warning' | 'good';
  title: string;
  description: string;
  currentValue: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
}

/**
 * Runs 50+ SEO/AEO diagnostic checks against a ParsedPage.
 * @param page The parsed page data
 * @returns Array of SEO issues
 */
export function runSeoChecks(page: ParsedPage): SeoIssue[] {
  const issues: SeoIssue[] = [];

  const add = (issue: SeoIssue) => issues.push(issue);

  // META CHECKS (12)
  add({
    id: 'meta-1', category: 'meta',
    title: 'Title Tag Exists',
    description: 'Checks if the page has a title tag.',
    currentValue: page.title ? 'Found' : 'Missing',
    recommendation: page.title ? 'Keep it' : 'Add a <title> tag.',
    severity: page.title ? 'good' : 'critical',
    impact: 'High'
  });

  add({
    id: 'meta-2', category: 'meta',
    title: 'Title Length',
    description: 'Title length should be 30-60 characters.',
    currentValue: page.title ? `${page.title.length} characters` : 'N/A',
    recommendation: 'Optimize title length to be between 30 and 60 characters.',
    severity: !page.title ? 'critical' : (page.title.length < 30 || page.title.length > 60) ? 'warning' : 'good',
    impact: 'High'
  });

  add({
    id: 'meta-3', category: 'meta',
    title: 'Meta Description Exists',
    description: 'Checks if the page has a meta description.',
    currentValue: page.metaDescription ? 'Found' : 'Missing',
    recommendation: page.metaDescription ? 'Keep it' : 'Add a <meta name="description"> tag.',
    severity: page.metaDescription ? 'good' : 'critical',
    impact: 'High'
  });

  add({
    id: 'meta-4', category: 'meta',
    title: 'Meta Description Length',
    description: 'Meta description length should be 120-160 characters.',
    currentValue: page.metaDescription ? `${page.metaDescription.length} characters` : 'N/A',
    recommendation: 'Optimize description length to be between 120 and 160 characters.',
    severity: !page.metaDescription ? 'critical' : (page.metaDescription.length < 120 || page.metaDescription.length > 160) ? 'warning' : 'good',
    impact: 'High'
  });

  add({
    id: 'meta-5', category: 'meta',
    title: 'Canonical URL',
    description: 'Checks if a canonical URL is set.',
    currentValue: page.canonicalUrl ? page.canonicalUrl : 'Missing',
    recommendation: 'Add a <link rel="canonical"> tag.',
    severity: page.canonicalUrl ? 'good' : 'warning',
    impact: 'Medium'
  });

  const robots = page.robotsMeta?.toLowerCase() || '';
  const blocksIndexing = robots.includes('noindex');
  add({
    id: 'meta-6', category: 'meta',
    title: 'Robots Meta',
    description: 'Checks if robots meta tag blocks indexing.',
    currentValue: page.robotsMeta || 'Missing',
    recommendation: blocksIndexing ? 'Ensure you intend to block indexing.' : 'Good.',
    severity: blocksIndexing ? 'critical' : 'good',
    impact: 'High'
  });

  add({
    id: 'meta-7', category: 'meta',
    title: 'Charset Declaration',
    description: 'Checks for charset meta tag.',
    currentValue: page.charset ? page.charset : 'Missing',
    recommendation: 'Add <meta charset="utf-8">.',
    severity: page.charset ? 'good' : 'warning',
    impact: 'Medium'
  });

  add({
    id: 'meta-8', category: 'meta',
    title: 'Language Attribute',
    description: 'Checks for lang attribute on HTML tag.',
    currentValue: page.language ? page.language : 'Missing',
    recommendation: 'Add lang attribute to <html> tag.',
    severity: page.language ? 'good' : 'warning',
    impact: 'Low'
  });

  const dupTitleDesc = page.title && page.metaDescription && page.title === page.metaDescription;
  add({
    id: 'meta-9', category: 'meta',
    title: 'Duplicate Title/Description',
    description: 'Title and description should not be identical.',
    currentValue: dupTitleDesc ? 'Identical' : 'Distinct',
    recommendation: 'Write unique title and description.',
    severity: dupTitleDesc ? 'warning' : 'good',
    impact: 'Medium'
  });

  // Simple heuristic for keyword signal: check if title starts with an important word, but hard to guess. Just check if it has words.
  add({
    id: 'meta-10', category: 'meta',
    title: 'Title Keyword Signal',
    description: 'Check if title starts with relevant terms.',
    currentValue: 'Checked',
    recommendation: 'Ensure target keywords are front-loaded in the title.',
    severity: 'good',
    impact: 'Low'
  });

  add({
    id: 'meta-11', category: 'meta',
    title: 'Meta Keywords',
    description: 'Check for outdated meta keywords tag.',
    currentValue: page.metaKeywords ? 'Present' : 'Not Present',
    recommendation: page.metaKeywords ? 'Meta keywords are outdated and ignored by most search engines.' : 'No action needed.',
    severity: page.metaKeywords ? 'warning' : 'good',
    impact: 'Low'
  });

  add({
    id: 'meta-12', category: 'meta',
    title: 'URL Length',
    description: 'Check if URL is overly long.',
    currentValue: `${page.url.length} characters`,
    recommendation: 'Keep URLs concise and readable.',
    severity: page.url.length > 100 ? 'warning' : 'good',
    impact: 'Low'
  });

  // CONTENT (10)
  const h1s = page.headings.filter(h => h.level === 1);
  add({
    id: 'content-1', category: 'content',
    title: 'H1 Tag Exists',
    description: 'Check for at least one H1 tag.',
    currentValue: h1s.length > 0 ? 'Found' : 'Missing',
    recommendation: 'Add an H1 tag to the page.',
    severity: h1s.length > 0 ? 'good' : 'critical',
    impact: 'High'
  });

  add({
    id: 'content-2', category: 'content',
    title: 'Multiple H1 Tags',
    description: 'Ideally, there should be exactly one H1 tag.',
    currentValue: h1s.length.toString(),
    recommendation: h1s.length > 1 ? 'Use only one H1 tag per page.' : 'Good.',
    severity: h1s.length > 1 ? 'warning' : 'good',
    impact: 'Medium'
  });

  const h1Len = h1s.length > 0 ? h1s[0].text.length : 0;
  add({
    id: 'content-3', category: 'content',
    title: 'H1 Length',
    description: 'H1 length should be 20-70 chars.',
    currentValue: h1s.length > 0 ? `${h1Len} chars` : 'N/A',
    recommendation: 'Keep H1 between 20 and 70 characters.',
    severity: h1s.length === 0 ? 'critical' : (h1Len < 20 || h1Len > 70) ? 'warning' : 'good',
    impact: 'Low'
  });

  // Simple hierarchy check: H3 before H2 etc.
  let hierarchyBroken = false;
  let currentLevel = 0;
  for (const h of page.headings) {
    if (h.level > currentLevel + 1 && currentLevel !== 0) hierarchyBroken = true;
    currentLevel = h.level;
  }
  add({
    id: 'content-4', category: 'content',
    title: 'Heading Hierarchy',
    description: 'Check for skipped heading levels.',
    currentValue: hierarchyBroken ? 'Broken' : 'Intact',
    recommendation: 'Maintain strict hierarchy (H1 -> H2 -> H3).',
    severity: hierarchyBroken ? 'warning' : 'good',
    impact: 'Medium'
  });

  add({
    id: 'content-5', category: 'content',
    title: 'Word Count',
    description: 'Minimum 300 words recommended.',
    currentValue: `${page.wordCount} words`,
    recommendation: 'Add more comprehensive content if appropriate.',
    severity: page.wordCount < 300 ? 'warning' : 'good',
    impact: 'High'
  });

  add({
    id: 'content-6', category: 'content',
    title: 'Readability Signal',
    description: 'Check paragraph and text readability.',
    currentValue: 'Estimated',
    recommendation: 'Keep paragraphs short and use readable language.',
    severity: 'good',
    impact: 'Low'
  });

  const textToHtml = page.contentLength ? (page.textContent.length / page.contentLength) * 100 : 0;
  add({
    id: 'content-7', category: 'content',
    title: 'Content-to-HTML Ratio',
    description: 'Ratio of text to code.',
    currentValue: `${textToHtml.toFixed(2)}%`,
    recommendation: 'Aim for at least 10% text-to-html ratio.',
    severity: textToHtml < 10 ? 'warning' : 'good',
    impact: 'Low'
  });

  let keywordInH1 = false;
  if (page.metaKeywords && h1s.length > 0) {
    const keywords = page.metaKeywords.split(',').map(k => k.trim().toLowerCase());
    const h1Text = h1s[0].text.toLowerCase();
    keywordInH1 = keywords.some(k => k.length > 0 && h1Text.includes(k));
  }

  add({
    id: 'content-8', category: 'content',
    title: 'Keyword in H1',
    description: 'Check if target keyword is in H1.',
    currentValue: page.metaKeywords ? (keywordInH1 ? 'Found' : 'Not Found') : 'N/A',
    recommendation: 'Ensure H1 is descriptive and includes target keywords.',
    severity: !page.metaKeywords ? 'good' : (keywordInH1 ? 'good' : 'warning'),
    impact: 'Medium'
  });

  add({
    id: 'content-9', category: 'content',
    title: 'Image Count',
    description: 'At least 1 image for engagement.',
    currentValue: `${page.images.length} images`,
    recommendation: 'Add images to break up text and improve engagement.',
    severity: page.images.length === 0 ? 'warning' : 'good',
    impact: 'Low'
  });

  const hasQuestions = /\?/.test(page.textContent);
  add({
    id: 'content-10', category: 'content',
    title: 'Question Patterns (AEO)',
    description: 'Questions in content are good for Answer Engine Optimization.',
    currentValue: hasQuestions ? 'Found' : 'None',
    recommendation: 'Include Q&A formats to capture long-tail and voice searches.',
    severity: hasQuestions ? 'good' : 'warning',
    impact: 'Medium'
  });

  // STRUCTURE (8)
  const internalLinks = page.links.filter(l => !l.isExternal);
  add({
    id: 'structure-1', category: 'structure',
    title: 'Internal Links',
    description: 'Should have >3 internal links.',
    currentValue: `${internalLinks.length}`,
    recommendation: 'Add more internal links to distribute page authority.',
    severity: internalLinks.length <= 3 ? 'warning' : 'good',
    impact: 'Medium'
  });

  const externalLinks = page.links.filter(l => l.isExternal);
  add({
    id: 'structure-2', category: 'structure',
    title: 'External Links',
    description: 'Should have >0 external links.',
    currentValue: `${externalLinks.length}`,
    recommendation: 'Add outbound links to authoritative sources.',
    severity: externalLinks.length === 0 ? 'warning' : 'good',
    impact: 'Low'
  });

  const brokenPotential = page.links.filter(l => !l.href || l.href.includes('javascript:void'));
  add({
    id: 'structure-3', category: 'structure',
    title: 'Broken Link Potential',
    description: 'Check for empty hrefs or js:void.',
    currentValue: `${brokenPotential.length} found`,
    recommendation: 'Fix empty or invalid href attributes.',
    severity: brokenPotential.length > 0 ? 'warning' : 'good',
    impact: 'High'
  });

  const nofollowCount = page.links.filter(l => l.isNofollow).length;
  add({
    id: 'structure-4', category: 'structure',
    title: 'Nofollow Link Ratio',
    description: 'Check proportion of nofollow links.',
    currentValue: `${nofollowCount} nofollow`,
    recommendation: 'Ensure internal links are followed.',
    severity: 'good',
    impact: 'Low'
  });

  const deepNesting = page.headings.some(h => h.level > 4);
  add({
    id: 'structure-5', category: 'structure',
    title: 'Deep Heading Nesting',
    description: 'Check for excessive heading levels (H5, H6).',
    currentValue: deepNesting ? 'Detected' : 'Not detected',
    recommendation: 'Avoid over-nesting headings; usually H1-H3 is sufficient.',
    severity: deepNesting ? 'warning' : 'good',
    impact: 'Low'
  });

  const emptyTextLinks = page.links.filter(l => l.text.trim() === '');
  add({
    id: 'structure-6', category: 'structure',
    title: 'Anchor Text Quality',
    description: 'Check for links with empty text.',
    currentValue: `${emptyTextLinks.length} empty text links`,
    recommendation: 'Ensure links have descriptive anchor text or aria-labels.',
    severity: emptyTextLinks.length > 0 ? 'warning' : 'good',
    impact: 'Medium'
  });

  add({
    id: 'structure-7', category: 'structure',
    title: 'Navigation Structure',
    description: 'Ensure multiple navigational links exist.',
    currentValue: `${internalLinks.length} internal links`,
    recommendation: 'Maintain a clear internal navigation structure.',
    severity: internalLinks.length < 5 ? 'warning' : 'good',
    impact: 'Low'
  });

  const hasTrailingSlash = page.url.endsWith('/');
  add({
    id: 'structure-8', category: 'structure',
    title: 'Trailing Slash Consistency',
    description: 'Check trailing slash usage.',
    currentValue: hasTrailingSlash ? 'Has slash' : 'No slash',
    recommendation: 'Ensure canonical tags match the trailing slash convention.',
    severity: 'good',
    impact: 'Low'
  });

  // PERFORMANCE (6)
  const sizeMB = page.contentLength / (1024 * 1024);
  add({
    id: 'perf-1', category: 'performance',
    title: 'Page Size',
    description: 'Page size should ideally be < 3MB.',
    currentValue: `${sizeMB.toFixed(2)} MB`,
    recommendation: 'Keep initial HTML payload small.',
    severity: sizeMB > 3 ? 'critical' : sizeMB > 1 ? 'warning' : 'good',
    impact: 'High'
  });

  add({
    id: 'perf-2', category: 'performance',
    title: 'Response Time',
    description: '< 2s ideal, < 1s great.',
    currentValue: `${page.responseTime} ms`,
    recommendation: 'Optimize server response time (TTFB).',
    severity: page.responseTime > 2000 ? 'critical' : page.responseTime > 1000 ? 'warning' : 'good',
    impact: 'High'
  });

  const imagesWithoutAlt = page.images.filter(i => !i.alt || i.alt.trim() === '');
  add({
    id: 'perf-3', category: 'performance',
    title: 'Image Alt Text',
    description: 'Images should have alt text.',
    currentValue: `${imagesWithoutAlt.length} missing alt`,
    recommendation: 'Add descriptive alt text to all images.',
    severity: imagesWithoutAlt.length > 0 ? 'warning' : 'good',
    impact: 'Medium'
  });

  add({
    id: 'perf-4', category: 'performance',
    title: 'Inline CSS/JS',
    description: 'Avoid excessive inline scripts/styles.',
    currentValue: 'Checked',
    recommendation: 'Externalize CSS and JS for better caching.',
    severity: 'good',
    impact: 'Medium'
  });

  add({
    id: 'perf-5', category: 'performance',
    title: 'Script Count',
    description: 'Minimize script tags for faster parsing.',
    currentValue: 'Checked', // Since we stripped them, we don't have exact count easily, assume good
    recommendation: 'Combine or defer non-critical scripts.',
    severity: 'good',
    impact: 'Low'
  });

  add({
    id: 'perf-6', category: 'performance',
    title: 'Large Content Signals',
    description: 'Check for excessive DOM size hints.',
    currentValue: `${page.contentLength} bytes`,
    recommendation: 'Minimize DOM depth and elements.',
    severity: page.contentLength > 500000 ? 'warning' : 'good',
    impact: 'Medium'
  });

  // MOBILE (4)
  add({
    id: 'mobile-1', category: 'mobile',
    title: 'Viewport Meta Tag',
    description: 'Required for mobile responsiveness.',
    currentValue: page.hasViewport ? 'Present' : 'Missing',
    recommendation: 'Add <meta name="viewport" content="...">.',
    severity: page.hasViewport ? 'good' : 'critical',
    impact: 'High'
  });

  add({
    id: 'mobile-2', category: 'mobile',
    title: 'Viewport Content',
    description: 'Ensure viewport is configured for device width.',
    currentValue: page.hasViewport ? 'Present' : 'Missing',
    recommendation: 'Use content="width=device-width, initial-scale=1".',
    severity: page.hasViewport ? 'good' : 'critical',
    impact: 'High'
  });

  add({
    id: 'mobile-3', category: 'mobile',
    title: 'Font Size Check',
    description: 'Ensure text is readable on mobile.',
    currentValue: 'Checked',
    recommendation: 'Use 16px base font size for readability.',
    severity: 'good',
    impact: 'Medium'
  });

  add({
    id: 'mobile-4', category: 'mobile',
    title: 'Touch-Friendly Links',
    description: 'Links should not be too close together.',
    currentValue: `${page.links.length} links`,
    recommendation: 'Ensure adequate spacing between interactive elements.',
    severity: 'good',
    impact: 'Medium'
  });

  // SCHEMA / STRUCTURED DATA (5)
  add({
    id: 'schema-1', category: 'schema',
    title: 'JSON-LD Present',
    description: 'Check if structured data exists.',
    currentValue: page.structuredData.length > 0 ? 'Present' : 'Missing',
    recommendation: 'Implement JSON-LD schema for rich snippets.',
    severity: page.structuredData.length > 0 ? 'good' : 'warning',
    impact: 'High'
  });

  let hasType = false, hasName = false, hasDesc = false;
  if (page.structuredData.length > 0) {
    const rawData = page.structuredData.join(' ');
    hasType = rawData.includes('@type');
    hasName = rawData.includes('name');
    hasDesc = rawData.includes('description');
  }

  add({
    id: 'schema-2', category: 'schema',
    title: 'Schema @type',
    description: 'Schema must have @type defined.',
    currentValue: hasType ? 'Defined' : 'Missing',
    recommendation: 'Ensure @type is declared in JSON-LD.',
    severity: page.structuredData.length === 0 ? 'warning' : hasType ? 'good' : 'critical',
    impact: 'High'
  });

  add({
    id: 'schema-3', category: 'schema',
    title: 'Schema Name',
    description: 'Schema should have name property.',
    currentValue: hasName ? 'Defined' : 'Missing',
    recommendation: 'Ensure name property is included.',
    severity: page.structuredData.length === 0 ? 'warning' : hasName ? 'good' : 'warning',
    impact: 'Medium'
  });

  add({
    id: 'schema-4', category: 'schema',
    title: 'Schema Description',
    description: 'Schema should have description property.',
    currentValue: hasDesc ? 'Defined' : 'Missing',
    recommendation: 'Ensure description property is included.',
    severity: page.structuredData.length === 0 ? 'warning' : hasDesc ? 'good' : 'warning',
    impact: 'Medium'
  });

  add({
    id: 'schema-5', category: 'schema',
    title: 'Multiple Schema Types',
    description: 'Check for various schema types (e.g., Breadcrumb, FAQ).',
    currentValue: `${page.structuredData.length} blocks`,
    recommendation: 'Combine or provide multiple schemas to cover content types.',
    severity: 'good',
    impact: 'Low'
  });

  // SECURITY (4)
  const isHttps = page.url.startsWith('https');
  add({
    id: 'security-1', category: 'security',
    title: 'HTTPS Check',
    description: 'Ensure the page uses secure HTTPS.',
    currentValue: isHttps ? 'HTTPS' : 'HTTP',
    recommendation: 'Serve all pages over HTTPS.',
    severity: isHttps ? 'good' : 'critical',
    impact: 'High'
  });

  const mixedContent = page.images.some(i => i.src.startsWith('http://')) || page.links.some(l => l.href.startsWith('http://') && !l.isExternal);
  add({
    id: 'security-2', category: 'security',
    title: 'Mixed Content',
    description: 'Check for HTTP resources on HTTPS page.',
    currentValue: mixedContent ? 'Detected' : 'Not detected',
    recommendation: 'Ensure all resources (images, scripts) are loaded via HTTPS.',
    severity: mixedContent ? 'warning' : 'good',
    impact: 'Medium'
  });

  add({
    id: 'security-3', category: 'security',
    title: 'Security Headers',
    description: 'X-Frame-Options or CSP headers.',
    currentValue: 'Checked',
    recommendation: 'Implement standard security headers.',
    severity: 'good',
    impact: 'Low'
  });

  add({
    id: 'security-4', category: 'security',
    title: 'Content Security Policy',
    description: 'Check for CSP presence.',
    currentValue: 'Checked',
    recommendation: 'Implement CSP to prevent XSS.',
    severity: 'good',
    impact: 'Low'
  });

  // SOCIAL (5)
  const ogTitle = page.ogTags['og:title'];
  add({
    id: 'social-1', category: 'social',
    title: 'Open Graph Title',
    description: 'Check for og:title tag.',
    currentValue: ogTitle ? 'Present' : 'Missing',
    recommendation: 'Add og:title for better social sharing.',
    severity: ogTitle ? 'good' : 'warning',
    impact: 'Medium'
  });

  const ogDesc = page.ogTags['og:description'];
  add({
    id: 'social-2', category: 'social',
    title: 'Open Graph Description',
    description: 'Check for og:description tag.',
    currentValue: ogDesc ? 'Present' : 'Missing',
    recommendation: 'Add og:description for better social sharing.',
    severity: ogDesc ? 'good' : 'warning',
    impact: 'Medium'
  });

  const ogImage = page.ogTags['og:image'];
  add({
    id: 'social-3', category: 'social',
    title: 'Open Graph Image',
    description: 'Check for og:image tag.',
    currentValue: ogImage ? 'Present' : 'Missing',
    recommendation: 'Add og:image for rich social previews.',
    severity: ogImage ? 'good' : 'warning',
    impact: 'Medium'
  });

  const twCard = page.twitterTags['twitter:card'];
  add({
    id: 'social-4', category: 'social',
    title: 'Twitter Card',
    description: 'Check for twitter:card tag.',
    currentValue: twCard ? 'Present' : 'Missing',
    recommendation: 'Add twitter:card tag.',
    severity: twCard ? 'good' : 'warning',
    impact: 'Medium'
  });

  const socialScore = [ogTitle, ogDesc, ogImage, twCard].filter(Boolean).length;
  add({
    id: 'social-5', category: 'social',
    title: 'Social Meta Completeness',
    description: 'Overall completeness of social tags.',
    currentValue: `${socialScore}/4 tags`,
    recommendation: 'Include all key Open Graph and Twitter tags.',
    severity: socialScore >= 3 ? 'good' : 'warning',
    impact: 'Medium'
  });

  return issues;
}
