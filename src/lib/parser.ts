export interface ParsedPage {
  url: string;
  title: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  headings: { level: number; text: string }[];
  images: { src: string; alt: string | null }[];
  links: { href: string; text: string; isExternal: boolean; rel: string | null; isNofollow: boolean }[];
  structuredData: string[];
  wordCount: number;
  textContent: string;
  hasViewport: boolean;
  charset: string | null;
  language: string | null;
  hreflangTags: { lang: string; href: string }[];
  hasFavicon: boolean;
  responseTime: number;
  contentLength: number;
  statusCode: number;
  httpHeaders: Record<string, string>;
}

/**
 * Parses HTML to extract SEO/AEO/GEO elements using only regex and string methods.
 * @param html The raw HTML string
 * @param url The page URL
 * @param statusCode The HTTP status code
 * @param responseTime The response time in ms
 * @returns ParsedPage object containing all extracted data
 */
export function parseHtml(html: string, url: string, statusCode: number, responseTime: number): ParsedPage {
  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch {
    // Ignore invalid URL
  }

  const result: ParsedPage = {
    url,
    title: null,
    metaDescription: null,
    metaKeywords: null,
    canonicalUrl: null,
    robotsMeta: null,
    ogTags: {},
    twitterTags: {},
    headings: [],
    images: [],
    links: [],
    structuredData: [],
    wordCount: 0,
    textContent: '',
    hasViewport: false,
    charset: null,
    language: null,
    hreflangTags: [],
    hasFavicon: false,
    responseTime,
    contentLength: html.length,
    statusCode,
    httpHeaders: {}
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // Meta Tags
  const metaRegex = /<meta\s+([^>]+)>/gi;
  let metaMatch;
  while ((metaMatch = metaRegex.exec(html)) !== null) {
    const attrs = metaMatch[1];
    const nameMatch = attrs.match(/(?:name|property)=["']([^"']+)["']/i);
    const contentMatch = attrs.match(/content=["']([^"']*)["']/i);
    const charsetMatch = attrs.match(/charset=["']([^"']+)["']/i);

    if (charsetMatch) {
      result.charset = charsetMatch[1];
    }

    if (nameMatch && contentMatch) {
      const name = nameMatch[1].toLowerCase();
      const content = contentMatch[1];

      if (name === 'description') result.metaDescription = content;
      else if (name === 'keywords') result.metaKeywords = content;
      else if (name === 'robots') result.robotsMeta = content;
      else if (name === 'viewport') result.hasViewport = true;
      else if (nameMatch[1].startsWith('og:')) {
        result.ogTags[nameMatch[1]] = content;
      }
      else if (nameMatch[1].startsWith('twitter:')) {
        result.twitterTags[nameMatch[1]] = content;
      }
    }
  }

  // HTML tag language
  const htmlTagMatch = html.match(/<html[^>]*>/i);
  if (htmlTagMatch) {
    const langMatch = htmlTagMatch[0].match(/lang=["']([^"']+)["']/i);
    if (langMatch) result.language = langMatch[1];
  }

  // Links (href, rel) - canonical, favicon, hreflang
  const linkTagRegex = /<link\s+([^>]+)>/gi;
  let linkTagMatch;
  while ((linkTagMatch = linkTagRegex.exec(html)) !== null) {
    const attrs = linkTagMatch[1];
    const relMatch = attrs.match(/rel=["']([^"']+)["']/i);
    const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
    const hreflangMatch = attrs.match(/hreflang=["']([^"']+)["']/i);

    if (relMatch && hrefMatch) {
      const rel = relMatch[1].toLowerCase();
      const href = hrefMatch[1];

      if (rel === 'canonical') result.canonicalUrl = href;
      else if (rel.includes('icon')) result.hasFavicon = true;
      else if (rel === 'alternate' && hreflangMatch) {
        result.hreflangTags.push({ lang: hreflangMatch[1], href });
      }
    }
  }

  // Headings
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(html)) !== null) {
    const level = parseInt(headingMatch[1], 10);
    const text = headingMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) {
      result.headings.push({ level, text });
    }
  }

  // Images
  const imgRegex = /<img\s+([^>]+)>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const attrs = imgMatch[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
    if (srcMatch) {
      result.images.push({
        src: srcMatch[1],
        alt: altMatch ? altMatch[1] : null
      });
    }
  }

  // Anchor Links
  const anchorRegex = /<a\s+([^>]+)>([\s\S]*?)<\/a>/gi;
  let anchorMatch;
  while ((anchorMatch = anchorRegex.exec(html)) !== null) {
    const attrs = anchorMatch[1];
    const text = anchorMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
    const relMatch = attrs.match(/rel=["']([^"']+)["']/i);
    
    if (hrefMatch) {
      const href = hrefMatch[1];
      const rel = relMatch ? relMatch[1] : null;
      let isExternal = false;
      
      try {
        if (href.startsWith('http')) {
          const linkHost = new URL(href).hostname;
          if (hostname && linkHost !== hostname && !linkHost.endsWith('.' + hostname)) {
            isExternal = true;
          }
        }
      } catch {
        // invalid URL
      }
      
      const isNofollow = rel ? rel.toLowerCase().includes('nofollow') : false;
      
      result.links.push({
        href,
        text,
        isExternal,
        rel,
        isNofollow
      });
    }
  }

  // JSON-LD Structured Data
  const jsonLdRegex = /<script\s+(?:[^>]*\s+)?type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonMatch;
  while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
    result.structuredData.push(jsonMatch[1].trim());
  }

  // Text Content & Word Count
  let textContent = html;
  textContent = textContent.replace(/<(script|style|noscript|svg|iframe)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  textContent = textContent.replace(/<!--[\s\S]*?-->/g, " ");
  textContent = textContent.replace(/<[^>]+>/g, " ");
  textContent = textContent
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&\w+;/g, " ");
  textContent = textContent.replace(/\s+/g, " ").trim();

  result.wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  result.textContent = textContent.length > 15000 
    ? textContent.slice(0, 15000) + "\n\n[...content truncated for analysis...]"
    : textContent;

  return result;
}
