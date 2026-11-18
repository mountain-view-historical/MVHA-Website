#!/usr/bin/env node
/* ==========================================================================
   MVHA site builder
   --------------------------------------------------------------------------
   Wraps each content fragment in tools/content/ with the shared header,
   navigation and footer, and writes finished .html files to the site root.

   Run it with:   node tools/build.js

   You only need to run this if you have edited the shared layout below, or a
   file in tools/content/. Day-to-day content (events, photos, timeline,
   board members) lives in /data as JSON and needs no rebuild at all.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(__dirname, 'content');

/* A test copy of the site should never turn up in Google above the real one.
   Build it with:  node tools/build.js --test-site   */
const TEST_SITE = process.argv.includes('--test-site');

/* Asset versions
   --------------------------------------------------------------------------
   A stylesheet keeps its address from one release to the next, so a browser
   that already has a copy will go on using it -- and a visitor sees new markup
   styled by old CSS. That is exactly what happened when the tabbed view first
   went up: the page had tabs, the cached stylesheet had never heard of them,
   and they rendered as bare buttons.

   Appending a short hash of the file's own contents gives it a new address
   whenever, and only whenever, it actually changes. */
function assetVersion(rel) {
  try {
    const buf = fs.readFileSync(path.join(ROOT, rel));
    return require('crypto').createHash('sha1').update(buf).digest('hex').slice(0, 8);
  } catch { return ''; }
}
const CSS_V = assetVersion('assets/css/site.css');
const JS_V = assetVersion('assets/js/site.js');


const SITE = {
  name: 'Mountain View Historical Association',
  url: 'https://www.mountainviewhistorical.org',
  logo: '/assets/images/MVHA-Logo-300x300.jpg',
  defaultImage: '/assets/images/Mountain-View-Station.png'
};

/* Social-media previews need a full web address, not "/assets/...". */
function absoluteUrl(u) {
  return /^\//.test(u) ? SITE.url + u : u;
}

/* ---- Navigation: edit here and every page updates on the next build ---- */

const NAV = [
  { label: 'About', href: 'about.html', children: [
    { label: 'About Us', href: 'about.html' },
    { label: 'Our History', href: 'our-history.html' },
    { label: 'History Center', href: 'history-center.html' }
  ]},
  { label: 'Photos', href: 'archive.html' },
  { label: 'Archives', href: 'archives.html', children: [
    { label: 'City Directories', href: 'directories.html' },
    { label: 'Collection Finding Aids', href: 'collections.html' },
    { label: 'City Timeline', href: 'timeline.html' },
    { label: 'Video Gallery', href: 'videos.html' },
    { label: 'Useful Links', href: 'links.html' }
  ]},
  { label: 'Books &amp; Articles', href: 'books-articles.html', children: [
    { label: 'History of Mountain View', href: 'history.html' },
    // Every article with a "menu title" is listed here, newest first.
    // Set in the admin panel; see Articles below.
    { articles: true }
  ]},
  { label: 'Events', href: 'events.html' },
  { label: 'Newsletters', href: 'newsletters.html' },
  { label: 'Get Involved', href: 'join.html', children: [
    { label: 'Membership', href: 'membership.html' },
    { label: 'Volunteer', href: 'volunteer.html' },
    { label: 'Donate', href: 'donate.html' }
  ]},
  { label: 'Contact', href: 'contact.html' }
];

const SOCIAL = [
  ['Facebook', 'https://www.facebook.com/MVHistory/'],
  ['X', 'https://x.com/MtnViewHistory/'],
  ['YouTube', 'https://www.youtube.com/channel/UCAFiwAd-1vbl7DSoFTzEbZQ'],
  ['LinkedIn', 'https://www.linkedin.com/company/mountain-view-pioneer-&amp;-historical-assn/']
];

/* ---- Layout pieces ---- */

/* Filled in from the articles before any page is built. */
let menuArticles = [];

function navHtml() {
  return NAV.map(item => {
    if (!item.children) {
      return `        <li><a href="${item.href}">${item.label}</a></li>`;
    }
    const subs = item.children
      .flatMap(c => c.articles ? menuArticles : [c])
      .map(c => `            <a href="${c.href}">${c.label}</a>`)
      .join('\n');
    return `        <li class="has-sub"><a href="${item.href}">${item.label}</a>\n` +
           `          <div class="subnav">\n${subs}\n          </div>\n        </li>`;
  }).join('\n');
}

function socialHtml(cls) {
  return SOCIAL.map(([label, href]) =>
    `      <a href="${href}" target="_blank" rel="noopener">${label}</a>`).join('\n');
}

function header() {
  return `<a class="skip-link" href="#main">Skip to content</a>

<div class="topbar">
  <div class="wrap">
    <nav class="topbar-social" aria-label="Social media">
${socialHtml()}
    </nav>
    <div class="topbar-actions">
      <a href="mailto:info@mountainviewhistorical.org">info@mountainviewhistorical.org</a>
      <a href="donate.html"><strong>Donate</strong></a>
    </div>
  </div>
</div>

<header class="masthead">
  <div class="wrap">
    <a class="brand" href="index.html">
      <img src="${SITE.logo}" alt="">
      <span class="brand-text">
        <span class="brand-name">Mountain View Historical Association</span>
        <span class="brand-sub">Founded 1954</span>
      </span>
    </a>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-label">Menu</span>
    </button>

    <nav class="nav" id="site-nav" aria-label="Main navigation">
      <ul>
${navHtml()}
      </ul>
      <form class="nav-search" data-search-form role="search">
        <label class="visually-hidden" for="q-header">Search the site</label>
        <input type="search" id="q-header" placeholder="Search&hellip;">
        <button type="submit">Go</button>
      </form>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">

      <div>
        <h3>Mountain View Historical Association</h3>
        <p>Founded in 1954, the MVHA is a non-profit, volunteer-run organization dedicated to preserving and sharing the rich history of Mountain View, California.</p>
        <p>MVHA is a registered 501(c)(3). EIN 94-6115407.</p>
        <div class="footer-social">
${socialHtml()}
        </div>
      </div>

      <div>
        <h3>Explore</h3>
        <ul>
          <li><a href="archive.html">Photos</a></li>
          <li><a href="directories.html">City Directories</a></li>
          <li><a href="archives.html">Archives</a></li>
          <li><a href="books-articles.html">Books &amp; Articles</a></li>
          <li><a href="history.html">History of Mountain View</a></li>
          <li><a href="timeline.html">City Timeline</a></li>
        </ul>
      </div>

      <div>
        <h3>Take part</h3>
        <ul>
          <li><a href="events.html">Events</a></li>
          <li><a href="membership.html">Membership</a></li>
          <li><a href="volunteer.html">Volunteer</a></li>
          <li><a href="donate.html">Donate</a></li>
          <li><a href="newsletters.html">Newsletters</a></li>
          <li><a href="links.html">Useful Links</a></li>
        </ul>
      </div>

      <div>
        <h3>Contact</h3>
        <p>P.O. Box 252<br>Mountain View, CA 94042</p>
        <p>
          <a href="mailto:info@mountainviewhistorical.org">info@mountainviewhistorical.org</a><br>
          <a href="tel:+16509036890">(650) 903-6890</a>
        </p>
        <p><a href="contact.html">Full contact details</a></p>
      </div>

    </div>
    <div class="footer-bottom">
      <p>&copy; <span data-year>2026</span> Mountain View Historical Association</p>
      <p><a href="search.html">Search this site</a></p>
    </div>
  </div>
</footer>`;
}

/* Pages that sit in a subfolder — articles/castro-legacy.html and the like —
   need every relative link lifted by one level. Rather than thread a prefix
   through every piece of markup above, the finished page is rewritten once:
   any href or src that is genuinely relative gets the prefix, and anything
   absolute, external, a mailto/tel, or a bare #anchor is left alone. */
function applyPrefix(html, prefix) {
  if (!prefix) return html;
  return html.replace(/\b(href|src)="([^"]*)"/g, (whole, attr, value) => {
    if (/^([a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(value)) return whole;
    return `${attr}="${prefix}${value}"`;
  });
}

function layout(meta, body) {
  const title = meta.title === 'Home'
    ? SITE.name
    : `${meta.title} &mdash; ${SITE.name}`;
  const canonicalPath = meta.url !== undefined
    ? meta.url
    : (meta.slug === 'index' ? '' : meta.slug + '.html');
  return applyPrefix(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${SITE.url}/${canonicalPath}">
<meta property="og:title" content="${meta.title === 'Home' ? SITE.name : meta.title + ' — ' + SITE.name}">
<meta property="og:description" content="${meta.description}">
<meta property="og:type" content="${meta.slug === 'index' ? 'website' : 'article'}">
<meta property="og:image" content="${absoluteUrl(meta.image || SITE.defaultImage)}">
<meta name="twitter:card" content="summary_large_image">
${TEST_SITE ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<link rel="icon" href="${SITE.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css?v=${CSS_V}">
</head>
<body>

${header()}

<main id="main">
${body.trim()}
</main>

${footer()}

<script src="assets/js/site.js?v=${JS_V}"></script>
</body>
</html>
`, meta.prefix || '');
}

/* ==========================================================================
   Markdown and front matter
   --------------------------------------------------------------------------
   Articles are Markdown files with a block of settings at the top (front
   matter), written by hand or by the admin panel. The reader and renderer
   below turn them into HTML here, at build time, so that search engines and
   people without JavaScript see the whole article.

   (Until November 2026 there was also a News & Stories section built the
   same way. It was removed: events go on the Events page, longer pieces are
   Articles, and Association news is in the newsletter.)
   ========================================================================== */

/** Read the YAML front matter the admin panel writes.
    Deliberately a subset, with no npm dependency: mappings, lists (of plain
    values or of small mappings), quoted and unquoted text that may wrap onto
    several lines, and | or > blocks. true and false become booleans; every
    other value stays as text, so a date such as 2026-09-14 is never turned
    into a number or a date object. */
function parseYaml(src) {
  const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
  let i = 0;

  const indentOf = l => l.match(/^ */)[0].length;
  const isBlank = l => /^\s*(#.*)?$/.test(l);
  const KEY = /^([^\s#'"\-?:,\[\]{}][^:]*?|"[^"]*"|'[^']*')\s*:(?:[ \t]+(.*?))?\s*$/;

  function nextContent() {
    let j = i;
    while (j < lines.length && isBlank(lines[j])) j++;
    return j;
  }

  function unquoteKey(k) {
    if (/^"/.test(k)) return unescapeDouble(k.slice(1, -1));
    if (/^'/.test(k)) return k.slice(1, -1).replace(/''/g, "'");
    return k;
  }

  function unescapeDouble(s) {
    return s.replace(/\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|.)/g, (_, e) => {
      switch (e[0]) {
        case 'n': return '\n';
        case 't': return '\t';
        case 'r': return '\r';
        case '0': return '\0';
        case 'b': return '\b';
        case 'e': return '\x1b';
        case 'a': return '\x07';
        case 'v': return '\v';
        case 'f': return '\f';
        case 'N': return '\u0085';
        case '_': return ' ';
        case 'L': return ' ';
        case 'P': return ' ';
        case 'x': case 'u': case 'U': return String.fromCodePoint(parseInt(e.slice(1), 16));
        default: return e; // \" \\ \/ and escaped space or tab
      }
    });
  }

  /** Line folding shared by quoted and plain text that runs onto more lines:
      one line break becomes a space, each blank line becomes a line break. */
  function fold(parts) {
    let out = parts[0];
    let blanks = 0;
    for (let k = 1; k < parts.length; k++) {
      const p = parts[k];
      if (p === '') { blanks++; continue; }
      out += blanks ? '\n'.repeat(blanks) : ' ';
      out += p;
      blanks = 0;
    }
    return out + (blanks ? '\n'.repeat(blanks) : '');
  }

  function scalar(text) {
    if (text === 'true' || text === 'True' || text === 'TRUE') return true;
    if (text === 'false' || text === 'False' || text === 'FALSE') return false;
    if (text === '~' || text === 'null' || text === 'Null' || text === 'NULL' || text === '') return '';
    return text;
  }

  /** A quoted value, which may continue over several lines. `first` is what
      follows the opening quote on its own line. */
  function quoted(first, q) {
    const raw = [first];
    // Find the closing quote, which may be on a later line.
    const closes = s => {
      if (q === "'") {
        for (let k = 0; k < s.length; k++) {
          if (s[k] === "'") { if (s[k + 1] === "'") { k++; continue; } return k; }
        }
      } else {
        for (let k = 0; k < s.length; k++) {
          if (s[k] === '\\') { k++; continue; }
          if (s[k] === '"') return k;
        }
      }
      return -1;
    };
    let end = closes(first);
    while (end === -1 && i < lines.length) {
      raw.push(lines[i++]);
      end = closes(raw[raw.length - 1]);
    }
    raw[raw.length - 1] = raw[raw.length - 1].slice(0, Math.max(end, 0));

    if (raw.length === 1) {
      return q === "'" ? raw[0].replace(/''/g, "'") : unescapeDouble(raw[0]);
    }
    // Trim the white space that line folding ignores, but an escaped line
    // break (a backslash at the very end of a line) joins without a space.
    const parts = [];
    let joinNext = false;
    raw.forEach((line, k) => {
      let s = k === 0 ? line.replace(/[ \t]+$/, '') : line.trim();
      if (k > 0 && k < raw.length - 1 && s === '') { parts.push(''); return; }
      if (k === raw.length - 1) s = line.replace(/^[ \t]+/, '');
      if (joinNext) { parts[parts.length - 1] += s; joinNext = false; }
      else parts.push(s);
      if (q === '"' && k < raw.length - 1 && /(^|[^\\])(\\\\)*\\$/.test(line.replace(/[ \t]+$/, ''))) {
        // escaped line break
        parts[parts.length - 1] = parts[parts.length - 1].replace(/\\$/, '');
        joinNext = true;
        // keep trailing spaces that were before the backslash
        if (k === 0) parts[parts.length - 1] = line.replace(/\\[ \t]*$/, '');
      }
    });
    const folded = fold(parts);
    return q === "'" ? folded.replace(/''/g, "'") : unescapeDouble(folded);
  }

  /** A | or > block. */
  function block(header, parentIndent) {
    const literal = header[0] === '|';
    const chomp = /-/.test(header) ? 'strip' : /\+/.test(header) ? 'keep' : 'clip';
    const explicit = header.match(/[1-9]/);
    const collected = [];
    let contentIndent = explicit ? parentIndent + Number(explicit[0]) : -1;
    while (i < lines.length) {
      const line = lines[i];
      if (/^\s*$/.test(line)) { collected.push(''); i++; continue; }
      const ind = indentOf(line);
      if (contentIndent === -1) {
        if (ind <= parentIndent) break;
        contentIndent = ind;
      }
      if (ind < contentIndent) break;
      collected.push(line.slice(contentIndent));
      i++;
    }
    // Trailing blank lines belong to the chomping rule, not the content.
    let trailing = 0;
    while (collected.length && collected[collected.length - 1] === '') { collected.pop(); trailing++; }
    let text;
    if (literal) {
      text = collected.join('\n');
    } else {
      text = '';
      let prevMore = false;
      collected.forEach((l, k) => {
        const more = /^[ \t]/.test(l);
        if (k === 0) { text = l; prevMore = more; return; }
        const prev = collected[k - 1];
        if (l === '') { text += '\n'; return; }
        if (prev === '') {
          // the blank lines already added their breaks; folding adds nothing
          // unless either side is more indented
          if (more || prevMore) text += '\n';
          text += l;
        } else if (more || prevMore) {
          text += '\n' + l;
        } else {
          text += ' ' + l;
        }
        prevMore = more;
      });
    }
    if (!collected.length) return chomp === 'keep' ? '\n'.repeat(trailing) : '';
    if (chomp === 'strip') return text;
    if (chomp === 'clip') return text + '\n';
    return text + '\n' + '\n'.repeat(trailing);
  }

  /** Whatever follows "key:" or "- " on a line. */
  function value(rest, parentIndent) {
    if (rest === undefined || rest === '' || /^#/.test(rest)) {
      const j = nextContent();
      if (j < lines.length) {
        const ind = indentOf(lines[j]);
        const body = lines[j].slice(ind);
        if (/^-( |$)/.test(body) && ind >= parentIndent) { i = j; return seq(ind); }
        if (ind > parentIndent) { i = j; return map(ind); }
      }
      return '';
    }
    if (/^[|>]/.test(rest)) return block(rest, parentIndent);
    if (rest[0] === '"' || rest[0] === "'") {
      return quoted(rest.slice(1), rest[0]);
    }
    if (rest === '[]') return [];
    if (rest === '{}') return {};
    if (/^\[.*\]$/.test(rest)) {
      return rest.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
        .map(s => /^(['"]).*\1$/.test(s) ? (s[0] === '"' ? unescapeDouble(s.slice(1, -1)) : s.slice(1, -1).replace(/''/g, "'")) : scalar(s));
    }
    // Plain text, possibly continued on more-indented lines.
    const parts = [rest.replace(/\s+#.*$/, '')];
    while (i < lines.length) {
      const line = lines[i];
      if (/^\s*$/.test(line)) {
        const j = nextContent();
        if (j < lines.length && indentOf(lines[j]) > parentIndent) {
          for (let k = i; k < j; k++) parts.push('');
          i = j;
          continue;
        }
        break;
      }
      if (indentOf(line) <= parentIndent) break;
      if (/^\s*#/.test(line)) break;
      parts.push(line.trim().replace(/\s+#.*$/, ''));
      i++;
    }
    return parts.length === 1 ? scalar(parts[0]) : fold(parts);
  }

  function map(indent) {
    const obj = {};
    while (i < lines.length) {
      const line = lines[i];
      if (isBlank(line)) { i++; continue; }
      const ind = indentOf(line);
      if (ind < indent) break;
      const m = line.slice(ind).match(KEY);
      if (ind > indent || !m) { i++; continue; }
      i++;
      obj[unquoteKey(m[1])] = value(m[2], ind);
    }
    return obj;
  }

  function seq(indent) {
    const arr = [];
    while (i < lines.length) {
      const line = lines[i];
      if (isBlank(line)) { i++; continue; }
      const ind = indentOf(line);
      if (ind !== indent || !/^-( |$)/.test(line.slice(ind))) break;
      const content = line.slice(ind + 1).replace(/^ +/, '');
      const contentIndent = ind + (line.slice(ind).length - content.length);
      if (content === '' ) { i++; arr.push(value('', ind)); continue; }
      if (KEY.test(content)) {
        // A mapping that starts on the dash line.
        lines[i] = ' '.repeat(contentIndent) + content;
        arr.push(map(contentIndent));
        continue;
      }
      i++;
      arr.push(value(content, ind));
    }
    return arr;
  }

  return map(0);
}

/** Split a leading --- YAML block off a file. */
function frontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  return { meta: parseYaml(m[1]), body: raw.slice(m[0].length) };
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Inline Markdown: code, images, links, bold, italic. */
function inline(text) {
  const codes = [];
  // \uE000 is a private-use character: it cannot occur in real copy, so the
  // placeholder can never collide with the text around it.
  let out = String(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return '\uE000' + (codes.length - 1) + '\uE000';
  });

  out = escapeHtml(out)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
      (_, alt, src, title) =>
        `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ''} loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const external = /^https?:\/\//i.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return out.replace(/\uE000(\d+)\uE000/g, (_, i) => `<code>${escapeHtml(codes[i])}</code>`);
}

/* A paragraph that holds nothing but pictures becomes a figure, and the
   picture's title -- the text in quotes after its address, which the admin
   panel's picture button calls "Title" -- becomes the caption underneath:

       ![The Castro family adobe](assets/images/adobe.jpg "The adobe, circa 1850.")

   Two or more pictures in the same paragraph (one line after another, with no
   blank line between) are set side by side. Returns '' for anything else. */
const PICTURE = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'))?\s*\)/g;

function figures(text) {
  const found = [...String(text).matchAll(PICTURE)];
  if (!found.length || text.replace(PICTURE, '').trim()) return '';
  const one = m => {
    const caption = (m[3] !== undefined ? m[3] : m[4] || '').replace(/\\(.)/g, '$1').trim();
    return `<figure><img src="${escapeHtml(m[2])}" alt="${escapeHtml(m[1])}" loading="lazy">` +
      (caption ? `<figcaption>${inline(caption)}</figcaption>` : '') + '</figure>';
  };
  if (found.length === 1) return one(found[0]);
  return '<div class="grid grid-2 figure-row">\n' + found.map(one).join('\n') + '\n</div>';
}

/**
 * A deliberately small Markdown renderer: headings, paragraphs, lists,
 * blockquotes, rules, images and links. That is everything the admin panel's
 * editor can produce. Anything that already looks like HTML is passed
 * straight through, so a post can drop in an embed when it needs to.
 */
function markdown(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];       // lines of the paragraph being collected
  let quote = [];      // lines of the blockquote being collected
  let list = null;     // 'ul' | 'ol' | null
  let items = [];      // text of each item in the open list

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(' ');
    out.push(figures(text) || '<p>' + inline(text) + '</p>');
    para = [];
  };
  /* A blockquote may run to several paragraphs (an empty "> " line between
     them). If its last paragraph starts with a dash -- "— Councilman Harry
     True, 1959" -- that line is who said it, and is set as a <cite>. */
  const flushQuote = () => {
    if (!quote.length) return;
    const paras = [];
    let cur = [];
    quote.forEach(l => {
      if (!l.trim()) { if (cur.length) paras.push(cur.join(' ')); cur = []; }
      else cur.push(l.trim());
    });
    if (cur.length) paras.push(cur.join(' '));
    let cite = '';
    const last = paras[paras.length - 1] || '';
    const who = last.match(/^(?:—|―|--)\s*(.+)$/);
    if (who && paras.length > 1) { cite = `<cite>${inline(who[1])}</cite>`; paras.pop(); }
    out.push('<blockquote>' + paras.map(t => '<p>' + inline(t) + '</p>').join('') + cite + '</blockquote>');
    quote = [];
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list}>`);
    items.forEach(t => out.push('<li>' + inline(t) + '</li>'));
    out.push(`</${list}>`);
    list = null;
    items = [];
  };
  const flushAll = () => { flushPara(); flushQuote(); flushList(); };

  const isBlock = line =>
    /^\s*<(\/?)(div|section|figure|iframe|table|ul|ol|dl|p|h[1-6]|blockquote|img|video|audio|picture|aside|details|script)\b/i.test(line);
  let inHtml = false;  // inside a block of raw HTML, which runs to the next blank line

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) { flushAll(); inHtml = false; continue; }

    /* Raw HTML — left exactly as written, from the line that opens it to the
       next blank line, as in standard Markdown. That lets a figure, a map or
       a box be written over several lines without the lines inside it being
       wrapped in paragraphs. */
    if (inHtml) { out.push(line); continue; }
    if (isBlock(line)) { flushAll(); out.push(line); inHtml = true; continue; }

    if (/^(---|\*\*\*|___)\s*$/.test(line)) { flushAll(); out.push('<hr>'); continue; }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushAll();
      // A post already carries its title as the <h1>, so ## is the top level here.
      out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
      continue;
    }

    const quoted = line.match(/^>\s?(.*)$/);
    if (quoted) { flushPara(); flushList(); quote.push(quoted[1]); continue; }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushPara(); flushQuote();
      const want = bullet ? 'ul' : 'ol';
      if (list !== want) flushList();
      list = want;
      items.push((bullet || numbered)[1]);
      continue;
    }

    // A plain line directly under a list item belongs to that item — Markdown
    // calls this lazy continuation, and it is what happens whenever somebody
    // writes a bullet long enough to wrap.
    if (list && items.length) { items[items.length - 1] += ' ' + line.trim(); continue; }
    if (quote.length) { quote.push(line.trim()); continue; }

    para.push(line.trim());
  }

  flushAll();
  return out.join('\n');
}

function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

/** Plain text of a post, for the search index and for a fallback summary. */
function plainText(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/* ==========================================================================
   Articles
   --------------------------------------------------------------------------
   Longer pieces -- research, local history, profiles -- that stay useful for
   years, unlike news. Each is one Markdown file in tools/content/articles/,
   written by hand or in the admin panel under "Articles":

       ---
       title: The Castro Family Legacy
       subtitle: The line under the title at the top of the page.
       author: Who wrote it (optional)
       credits: Photographs by ... (optional)
       date: 2024-10-15            (optional; the newest is listed first)
       summary: One or two sentences for the list of articles and for Google.
       image: assets/images/...    (for the list and for link previews)
       menu_title: Castro Family Legacy   (optional; puts it in the menu)
       note_title: What comes next        (optional box at the end)
       note_text: ...
       related:                           (optional "Related materials")
         - label: The 1876 map
           url: https://archive.org/details/...
           note: One line about it.
       ---

       The article, in Markdown.

   Built into:

     articles/<slug>.html   one real page per article
     data/articles.json     what site search reads
     the cards on books-articles.html (where it says <!-- ARTICLE-CARDS -->)
     the Books & Articles menu (articles that have a menu title)

   A related item that points at an Internet Archive item, at a photograph on
   our own Photos page, or at a picture, shows a thumbnail. A PDF, a video and
   a newsletter are labelled as such, so a reader knows what they are opening.
   ========================================================================== */

const ARTICLES_SRC = path.join(CONTENT, 'articles');
const ARTICLES_DIR = path.join(ROOT, 'articles');

/* An address saved by the admin panel as /assets/... is made relative, so it
   works from the articles/ folder and in a test copy kept in a subfolder. */
function localHref(href) {
  return String(href || '').trim().replace(/^\/(assets\/)/, '$1');
}

function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  return isNaN(d) ? iso : d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });
}

function readJson(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); } catch { return null; }
}

function readArticles() {
  if (!fs.existsSync(ARTICLES_SRC)) return [];
  return fs.readdirSync(ARTICLES_SRC)
    .filter(f => /\.md$/i.test(f))
    .map(file => {
      const raw = fs.readFileSync(path.join(ARTICLES_SRC, file), 'utf8');
      const { meta, body } = frontMatter(raw);
      const slug = slugify(meta.slug || path.basename(file, path.extname(file)));
      const html = markdown(body);
      const text = plainText(html);
      const str = k => (typeof meta[k] === 'string' ? meta[k].trim() : '');
      return {
        slug,
        file,
        title: str('title') || slug,
        subtitle: str('subtitle'),
        author: str('author'),
        credits: str('credits'),
        date: str('date').slice(0, 10),
        image: localHref(str('image')),
        menuTitle: str('menu_title'),
        noteTitle: str('note_title'),
        noteText: str('note_text'),
        related: Array.isArray(meta.related) ? meta.related : [],
        draft: meta.draft === true,
        summary: str('summary') || (text.slice(0, 180) + (text.length > 180 ? '…' : '')),
        html,
        text
      };
    })
    .filter(a => {
      if (a.draft) { console.log(`  --  articles: ${a.file} is a draft, not published`); return false; }
      return true;
    })
    // Newest first; articles with no date follow, in order of title.
    .sort((a, b) => {
      if (a.date && b.date) return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      if (a.date || b.date) return a.date ? -1 : 1;
      const key = t => t.replace(/^(the|a|an)\s+/i, '');
      return key(a.title).localeCompare(key(b.title));
    });
}

/** Work out what a related item is, and whether it has a picture to show. */
function relatedItem(r, lookup) {
  if (!r || typeof r !== 'object') return null;
  const href = localHref(r.file || r.url);
  const label = String(r.label || '').trim();
  if (!href) return null;

  let kind = 'Web page';
  let thumb = '';
  let title = label;
  const ia = href.match(/^https?:\/\/(?:www\.)?archive\.org\/details\/([^/?#]+)/i);
  const own = href.match(/(?:^|\/)archive\.html\?photo=([^&#]+)/);

  if (ia) {
    const photo = lookup.ia.get(ia[1]);
    kind = photo ? 'Photograph' : 'Internet Archive';
    thumb = 'https://archive.org/services/img/' + ia[1];
    if (!title && photo) title = photo.title;
  } else if (own) {
    const photo = lookup.own.get(decodeURIComponent(own[1])) || lookup.ia.get(decodeURIComponent(own[1]));
    kind = 'Photograph';
    if (photo) {
      thumb = photo.src ? localHref(photo.src) : 'https://archive.org/services/img/' + photo.id;
      if (!title) title = photo.title;
    }
  } else if (/\.pdf($|[?#])/i.test(href)) {
    kind = /(^|\/)assets\/newsletters\//.test(href) ? 'Newsletter' : 'Document (PDF)';
  } else if (/\.(jpe?g|png|gif|webp)($|[?#])/i.test(href)) {
    kind = 'Picture';
    thumb = href;
  } else if (/\.(mp3|m4a|wav|ogg)($|[?#])/i.test(href)) {
    kind = 'Recording';
  } else if (/^https?:\/\/patents\.google\.com\//i.test(href)) {
    kind = 'Patent';
  } else if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i.test(href)) {
    kind = 'Video';
  } else if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    kind = 'On this website';
  }

  return {
    href, kind, thumb,
    title: title || href,
    note: String(r.note || '').trim(),
    external: /^https?:\/\//i.test(href) || /\.pdf($|[?#])/i.test(href)
  };
}

function relatedHtml(article, lookup) {
  const items = article.related.map(r => relatedItem(r, lookup)).filter(Boolean);
  if (!items.length) return '';
  const cards = items.map(it => {
    const target = it.external ? ' target="_blank" rel="noopener"' : '';
    return `      <a class="card card-link related-item" href="${escapeHtml(it.href)}"${target}>
${it.thumb ? `        <div class="card-media"><img src="${escapeHtml(it.thumb)}" alt="" loading="lazy"></div>\n` : ''}        <div class="card-body">
          <p class="eyebrow">${escapeHtml(it.kind)}</p>
          <h3>${escapeHtml(it.title)}</h3>
${it.note ? `          <p>${inline(it.note)}</p>\n` : ''}        </div>
      </a>`;
  }).join('\n');
  return `
<section class="section section--tint" id="related">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Go further</p>
      <h2>Related materials</h2>
    </div>
    <div class="grid grid-3">
${cards}
    </div>
<!-- BACK -->  </div>
</section>
`;
}

function articlePage(a, lookup) {
  /* Who wrote it and when sits at the top of the article itself, not in the
     shaded heading band above, where it was easy to miss. */
  const details = [
    a.date ? `<time datetime="${a.date}">${prettyDate(a.date)}</time>` : '',
    a.credits ? escapeHtml(a.credits) : ''
  ].filter(Boolean).join(' &middot; ');
  const byline = a.author || details
    ? `      <div class="article-byline">
${a.author ? `        <p class="article-author">By ${escapeHtml(a.author)}</p>\n` : ''}${details ? `        <p class="article-details">${details}</p>\n` : ''}      </div>\n`
    : '';

  // The opening paragraph is set a little larger, as the old pages did by hand.
  const body = a.html.replace(/^<p>/, '<p class="lede">');

  const note = a.noteTitle || a.noteText
    ? `
      <div class="callout">
${a.noteTitle ? `        <h3>${escapeHtml(a.noteTitle)}</h3>\n` : ''}${markdown(a.noteText)}
      </div>`
    : '';

  const back = '    <p class="post-back"><a class="btn btn--ghost" href="books-articles.html#articles">&larr; All articles</a></p>\n';
  const related = relatedHtml(a, lookup);

  return `
<section class="pagehead">
  <div class="wrap">
    <p class="breadcrumb"><a href="index.html">Home</a><span>&rsaquo;</span><a href="books-articles.html">Books &amp; Articles</a><span>&rsaquo;</span>${escapeHtml(a.title)}</p>
    <h1>${escapeHtml(a.title)}</h1>
${a.subtitle ? `    <p>${inline(a.subtitle)}</p>\n` : ''}  </div>
</section>

<section class="section">
  <div class="wrap">
    <article class="prose article-body">
${byline}${body}${note}
    </article>
${related ? '' : back}  </div>
</section>
${related.replace('<!-- BACK -->', back)}`;
}

function articleCardsHtml(articles) {
  return articles.map(a => {
    const byline = [a.author ? 'By ' + escapeHtml(a.author) : '', a.date ? prettyDate(a.date) : '']
      .filter(Boolean).join(' &middot; ');
    return `      <a class="card card-link" href="articles/${a.slug}.html">
${a.image ? `        <div class="card-media"><img src="${escapeHtml(a.image)}" alt="" loading="lazy"></div>\n` : ''}        <div class="card-body">
${byline ? `          <p class="eyebrow">${byline}</p>\n` : ''}          <h3>${escapeHtml(a.title)}</h3>
          <p>${escapeHtml(a.summary)}</p>
          <span class="more">Read on &rarr;</span>
        </div>
      </a>`;
  }).join('\n');
}

/* The cover of the newest newsletter that has one, for the Books & Articles
   page. Adding an issue in the admin panel rebuilds the site, so this keeps
   itself up to date. */
function latestNewsletterCoverHtml() {
  const data = readJson('data/newsletters.json');
  const issue = ((data && data.issues) || [])
    .filter(i => i.cover)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0];
  if (!issue) return '<img src="assets/images/MVHA-Logo-300x300.jpg" alt="">';
  return `<img src="${escapeHtml(localHref(issue.cover))}" alt="Cover of The Mountain ReView, ${escapeHtml(issue.title || '')}" loading="lazy">`;
}

/* ==========================================================================
   Collection finding aids
   --------------------------------------------------------------------------
   The History Center volunteers inventory each donated collection in a
   spreadsheet. tools/finding-aids/build_finding_aids.py reads those into
   data/finding-aids.json; this turns that file into:

     collections/<slug>.html   one real page per collection, box by box
     the list of collections on collections.html (where the page says
     <!-- COLLECTION-LIST -->), so it is there without JavaScript too

   The search box on collections.html reads the same JSON in the browser.
   ========================================================================== */

const COLLECTIONS_DIR = path.join(ROOT, 'collections');

function readCollections() {
  const file = path.join(ROOT, 'data', 'finding-aids.json');
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).collections || [];
  } catch (e) {
    console.error(`  !  data/finding-aids.json could not be read (${e.message}) — no collection pages built`);
    return [];
  }
}

/** Volunteers break a long description over several lines in one cell. */
function cellText(s) {
  return escapeHtml(s || '').replace(/\n/g, '<br>');
}

/** "18 boxes · 1960–2010" — the one line that sums a collection up. */
function collectionSummaryLine(c) {
  return [c.extent, c.dates && c.dates.toLowerCase() !== 'various' ? c.dates : '']
    .filter(Boolean).map(escapeHtml).join(' &middot; ');
}

/** "Box 9" -> box-9, "shelf 4" -> box-shelf-4. site.js makes the same link. */
function boxId(label) {
  const s = slugify(label);
  return /^box-/.test(s) ? s : 'box-' + s;
}

function collectionListHtml(collections) {
  if (!collections.length) {
    return '<p>The collection finding aids are being prepared. Please check back soon.</p>';
  }
  const rows = collections.map(c => `      <tr>
        <td class="fa-col-title"><a href="collections/${c.slug}.html">${escapeHtml(c.title)}</a>${c.significance ? `<span class="fa-col-note">${escapeHtml(c.significance)}</span>` : ''}</td>
        <td class="fa-col-extent">${collectionSummaryLine(c)}</td>
        <td class="fa-col-loc">${escapeHtml(c.location || '')}</td>
      </tr>`).join('\n');
  return `<div class="dir-table fa-list">
    <table>
      <thead><tr><th>Collection</th><th>Size and dates</th><th>Where it is kept</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </div>`;
}

function collectionPage(c) {
  const facts = [
    ['Significance', c.significance],
    ['Scope and contents', c.scope],
    ['Subjects', c.subjects],
    ['Creator', c.creator],
    ['Dates', c.dates],
    ['Place', c.place],
    ['Extent', c.extent],
    ['Language', c.language]
  ].filter(([, v]) => v);

  const held = [
    ['Where it is kept', c.location ? `<strong>${escapeHtml(c.location)}</strong>` : 'Ask the librarian'],
    ['Owned by', escapeHtml(c.ownerName || c.owner || '')],
    ['Given by', escapeHtml(c.donor || '')],
    ['Accession number', escapeHtml(c.accession || '')],
    ['Restrictions on access', escapeHtml(c.access || '')]
  ].filter(([, v]) => v);

  const dl = pairs => '<dl class="fa-facts">\n' + pairs.map(([k, v]) =>
    `      <dt>${k}</dt><dd>${v}</dd>`).join('\n') + '\n    </dl>';

  // Columns that nobody filled in for this collection are left out, so a
  // small family archive is not drawn as a table of empty boxes.
  const all = c.boxes.flatMap(b => b.items);
  const has = key => all.some(i => i[key]);
  const cols = [
    ['d', 'Description'], ['dates', 'Dates'], ['container', 'Container'],
    ['condition', 'Condition'], ['donor', 'Donor'], ['accessioned', 'Accessioned']
  ].filter(([key]) => key === 'd' || has(key));

  const boxes = c.boxes.map(b => `    <h3 id="${boxId(b.box)}" class="fa-box">${escapeHtml(b.box)} <span>${b.items.length} item${b.items.length === 1 ? '' : 's'}</span></h3>
    <div class="dir-table fa-items">
      <table>
        <thead><tr>${cols.map(([k, label]) => `<th class="fa-${k}">${label}</th>`).join('')}</tr></thead>
        <tbody>
${b.items.map(i => `          <tr>${cols.map(([k]) => `<td class="fa-${k}">${cellText(i[k])}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
    </div>`).join('\n\n');

  const jump = c.boxes.length > 3
    ? `<p class="fa-jump">Go to: ${c.boxes.map(b => `<a href="#${boxId(b.box)}">${escapeHtml(b.box)}</a>`).join(' ')}</p>`
    : '';

  const prepared = [c.archivist ? 'Prepared by ' + escapeHtml(c.archivist) : '',
    c.created ? escapeHtml(c.created) : ''].filter(Boolean).join(', ');

  return `
<section class="pagehead">
  <div class="wrap">
    <p class="breadcrumb"><a href="index.html">Home</a><span>&rsaquo;</span><a href="archives.html">Archives</a><span>&rsaquo;</span><a href="collections.html">Collection Finding Aids</a><span>&rsaquo;</span>${escapeHtml(c.title)}</p>
    <h1>${escapeHtml(c.title)}</h1>
    <p>${collectionSummaryLine(c) || 'A collection held at the Mountain View History Center.'}</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="fa-head">
      <div>
        <h2>About this collection</h2>
    ${dl(facts)}
      </div>
      <div class="callout fa-visit">
        <h3>Seeing it in person</h3>
        <p>This collection is kept at the Mountain View Public Library and is not on open shelves. Ask the librarian at the <a href="history-center.html">History Center</a> to bring it out, and give them the location and box number below &mdash; it saves them a search.</p>
    ${dl(held)}
      </div>
    </div>

    <h2 class="fa-contents-head">What is in it</h2>
    <p class="fa-count">${c.count} item${c.count === 1 ? '' : 's'} in ${c.boxes.length} ${c.boxes.length === 1 ? 'box or group' : 'boxes or groups'}, listed as the volunteers found them.</p>
    ${jump}

${boxes}

    ${prepared ? `<p class="fa-prepared">${prepared}.</p>` : ''}
    <p class="post-back"><a class="btn btn--ghost" href="collections.html">&larr; All collection finding aids</a></p>
  </div>
</section>
`;
}

/* ---- Build ---- */

const collections = readCollections();
const articles = readArticles();
menuArticles = articles.filter(a => a.menuTitle)
  .map(a => ({ label: escapeHtml(a.menuTitle), href: 'articles/' + a.slug + '.html' }));

const files = fs.readdirSync(CONTENT).filter(f => f.endsWith('.html')).sort();
const slugs = [];
let built = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(CONTENT, file), 'utf8');
  const match = raw.match(/^<!--META\s*([\s\S]*?)-->/);
  if (!match) {
    console.error(`  !  ${file} has no <!--META ... --> block, skipped`);
    continue;
  }
  const meta = JSON.parse(match[1]);
  meta.slug = path.basename(file, '.html');
  const body = raw.slice(match[0].length)
    .replace('<!-- COLLECTION-LIST -->', () => collectionListHtml(collections))
    .replace('<!-- ARTICLE-CARDS -->', () => articleCardsHtml(articles))
    .replace('<!-- LATEST-NEWSLETTER-COVER -->', () => latestNewsletterCoverHtml());
  fs.writeFileSync(path.join(ROOT, meta.slug + '.html'), layout(meta, body));
  console.log(`  ok  ${meta.slug}.html`);
  if (meta.slug !== '404') slugs.push(meta.slug);
  built++;
}

/* ---- Articles: one page each, plus the index site search reads ---- */

if (articles.length) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  // An article deleted in the admin panel loses its page too.
  const wanted = new Set(articles.map(a => a.slug + '.html'));
  for (const stale of fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.html'))) {
    if (!wanted.has(stale)) {
      fs.unlinkSync(path.join(ARTICLES_DIR, stale));
      console.log(`  --  removed articles/${stale} (article no longer exists)`);
    }
  }

  const ia = readJson('data/photos-ia.json');
  const own = readJson('data/photos.json');
  const lookup = {
    ia: new Map(((ia && ia.photos) || []).map(p => [p.id, p])),
    own: new Map(((own && own.photos) || []).map(p => [p.id, p]))
  };

  for (const a of articles) {
    fs.writeFileSync(path.join(ARTICLES_DIR, a.slug + '.html'), layout({
      title: escapeHtml(a.title),
      description: escapeHtml(a.summary),
      image: a.image ? '/' + a.image.replace(/^\//, '') : '',
      slug: a.slug,
      url: 'articles/' + a.slug + '.html',
      prefix: '../'
    }, articlePage(a, lookup)));
    console.log(`  ok  articles/${a.slug}.html`);
    built++;
  }
}

fs.writeFileSync(path.join(ROOT, 'data', 'articles.json'), JSON.stringify({
  _comment: 'GENERATED by tools/build.js from tools/content/articles/*.md. Do not edit by hand — your changes will be overwritten on the next build.',
  articles: articles.map(a => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    author: a.author,
    summary: a.summary,
    url: 'articles/' + a.slug + '.html',
    text: a.text
  }))
}, null, 2) + '\n');
console.log(`  ok  data/articles.json (${articles.length} article${articles.length === 1 ? '' : 's'})`);

/* ---- Collection finding aids: one page per collection ---- */

if (collections.length) {
  fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });

  // A collection dropped from the spreadsheets loses its page too.
  const wanted = new Set(collections.map(c => c.slug + '.html'));
  for (const stale of fs.readdirSync(COLLECTIONS_DIR).filter(f => f.endsWith('.html'))) {
    if (!wanted.has(stale)) {
      fs.unlinkSync(path.join(COLLECTIONS_DIR, stale));
      console.log(`  --  removed collections/${stale} (no longer in the finding aids)`);
    }
  }

  for (const c of collections) {
    const description = (c.significance || c.scope || `What is in the ${c.title}, box by box.`)
      + (c.location ? ` Kept at the Mountain View History Center: ${c.location}.` : '');
    fs.writeFileSync(path.join(COLLECTIONS_DIR, c.slug + '.html'), layout({
      title: c.title,
      description: escapeHtml(description),
      slug: c.slug,
      url: 'collections/' + c.slug + '.html',
      prefix: '../'
    }, collectionPage(c)));
    built++;
  }
  console.log(`  ok  collections/ (${collections.length} finding aid${collections.length === 1 ? '' : 's'})`);
}

/* ---- sitemap.xml + robots.txt ---- */

const today = new Date().toISOString().slice(0, 10);

/* ---- .htaccess ----
   The production version redirects every old WordPress address to its new
   page. Those redirects are wrong in a subfolder — /mvhistory/donate/ would
   be sent to /donate.html at the top of the domain — so a test build gets a
   simpler file without them. */

const HTACCESS_COMMON = `${TEST_SITE ? `
# ---- Keep this copy out of search results ----
#
# Sends "do not index" with every file, including the JSON data files that
# have no page of their own to carry a meta tag. Visitors never see this and
# nothing about the site behaves differently — it only speaks to crawlers.

<IfModule mod_headers.c>
  Header set X-Robots-Tag "noindex, nofollow"
</IfModule>
` : ''}
# ---- Friendly error page ----

ErrorDocument 404 ${TEST_SITE ? '/mvhistory/404.html' : '/404.html'}

# ---- Compression ----

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

# ---- Caching ----

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css                "access plus 1 month"
  ExpiresByType application/javascript  "access plus 1 month"
  ExpiresByType image/jpeg              "access plus 1 year"
  ExpiresByType image/png               "access plus 1 year"
  ExpiresByType image/webp              "access plus 1 year"
  ExpiresByType image/svg+xml           "access plus 1 year"
  # JSON changes whenever the site is updated, so keep this short.
  ExpiresByType application/json        "access plus 1 hour"
  ExpiresByType text/html               "access plus 1 hour"
</IfModule>

# ---- Basic security headers ----

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
`;

/* Pages that were moved into articles/ when the Articles section was added,
   November 2026. Their old addresses keep working. _redirects has the same
   list for Cloudflare. */
const MOVED_TO_ARTICLES = ['castro-legacy', 'landmarks', 'oldest-resident', 'eagle-monument'];

const OLD_URLS = [
  ['about-the-association', 'about'], ['our-history', 'our-history'],
  ['mountain-view-history-center', 'history-center'], ['history', 'history'],
  ['mountain-view-history-timeline', 'timeline'],
  ['castro-city-rengstorff-park', 'articles/castro-legacy'],
  ['historical-buildings-in-mountain-view-ca', 'articles/landmarks'],
  ['mvhs-eagle-monument', 'articles/eagle-monument'], ['useful_links', 'links'],
  ['video-gallery', 'videos'], ['events', 'events'],
  ['oldest-living-resident', 'articles/oldest-resident'], ['get-involved', 'join'],
  ['donate', 'donate'], ['memberships', 'membership'], ['volunteer', 'volunteer'],
  ['newsletters', 'newsletters'], ['archived-newsletters', 'newsletters'],
  ['contact-us', 'contact']
];

fs.writeFileSync(path.join(ROOT, '.htaccess'),
  TEST_SITE
    ? `# ==========================================================================
# Apache settings for the TEST copy of the site.
#
# This build is meant to sit in a subfolder, for example
# example.com/mvhistory/, so it deliberately leaves out the redirects from
# the old WordPress addresses — those only make sense once the site is at
# the top of mountainviewhistorical.org.
#
# Rebuilt automatically. Run "node tools/build.js" to get the production one.
# ==========================================================================

DirectoryIndex index.html
${HTACCESS_COMMON}`
    : `# ==========================================================================
# Apache settings for the MVHA site.
#
# Only needed on a traditional Apache host (GoDaddy, cPanel, shared hosting).
# Netlify and Cloudflare Pages read _redirects instead and ignore this file.
#
# Rebuilt automatically by tools/build.js — edit that, not this.
# ==========================================================================

DirectoryIndex index.html

# ---- Redirects from the old WordPress addresses ----

RewriteEngine On

${OLD_URLS.map(([from, to]) =>
  `RedirectMatch 301 ^/${from}/?$ /${to}.html`).join('\n')}
RedirectMatch 301 ^/events/page/.*$ /events.html
RedirectMatch 301 ^/eventbrite-event/.*$ /events.html

# News & Stories was removed in November 2026.
RedirectMatch 301 ^/news(\\.html)?$ /books-articles.html
RedirectMatch 301 ^/news/.*$ /books-articles.html

# The four articles that sat at the top of the site before November 2026.
${MOVED_TO_ARTICLES.map(slug =>
  `RedirectMatch 301 ^/${slug}(\\.html)?$ /articles/${slug}.html`).join('\n')}
${HTACCESS_COMMON}`);
console.log(`  ok  .htaccess${TEST_SITE ? ' (test site: no old-URL redirects)' : ''}`);

if (TEST_SITE) {
  // Deliberately NOT "Disallow: /". Blocking crawlers would stop them reading
  // the "do not index" instruction on each page, and a blocked page that is
  // linked from somewhere else can still end up listed in Google as a bare
  // URL. Letting them in to read the no-index is what actually keeps it out.
  fs.writeFileSync(path.join(ROOT, 'robots.txt'),
    '# Test copy of the site.\n' +
    '#\n' +
    '# Crawlers are allowed in on purpose: every page and every file carries a\n' +
    '# "noindex" instruction, and a crawler has to be able to read it. Blocking\n' +
    '# them here would be self-defeating.\n' +
    '#\n' +
    '# Visitors are unaffected — anyone with the address sees the full site.\n' +
    'User-agent: *\nAllow: /\n');
  console.log('  ok  robots.txt (test site: crawlers allowed in to read the no-index)');

  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) fs.unlinkSync(sitemapPath);
} else {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map(s => `  <url>
    <loc>${SITE.url}/${s === 'index' ? '' : s + '.html'}</loc>
    <lastmod>${today}</lastmod>
    <priority>${s === 'index' ? '1.0' : '0.7'}</priority>
  </url>`).concat(articles.map(a => `  <url>
    <loc>${SITE.url}/articles/${a.slug}.html</loc>
    <lastmod>${a.date || today}</lastmod>
    <priority>0.7</priority>
  </url>`)).concat(collections.map(c => `  <url>
    <loc>${SITE.url}/collections/${c.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.5</priority>
  </url>`)).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
  console.log('  ok  sitemap.xml');

  fs.writeFileSync(path.join(ROOT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\n` +
    `# The editing panel is for volunteers, not for search engines.\n` +
    `Disallow: /admin/\n\n` +
    `Sitemap: ${SITE.url}/sitemap.xml\n`);
  console.log('  ok  robots.txt');
}

console.log(`\nBuilt ${built} page${built === 1 ? '' : 's'}${TEST_SITE ? ' as a TEST SITE (noindex)' : ''}.`);
if (TEST_SITE) {
  console.log('Run "node tools/build.js" without --test-site before publishing for real.');
}
