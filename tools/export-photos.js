#!/usr/bin/env node
/* ==========================================================================
   MVHA photograph export
   --------------------------------------------------------------------------
   Gathers every picture the website still loads from the old WordPress
   server, downloads a copy, writes a catalogue of everything we know about
   each one, and puts the lot in a single .zip.

   Run it with:   node tools/export-photos.js
   Or double-click Launchers/Export Photographs.command

   Why it exists: the thirteen hundred photographs on the Photographs page
   live at the Internet Archive and are safe. These are the others — the
   Association's own pictures and the ones used inside pages — which exist
   nowhere but on the old WordPress server. If that server is switched off
   they are gone. This makes a copy with its descriptions attached, which is
   also the shape you would need to upload them to the Internet Archive.

   It writes into photo-export/ and leaves it there; nothing is published,
   and the folder is kept out of the repository and off the live site.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CATALOGUE_ONLY = process.argv.includes('--catalogue');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'photo-export');
const WP = 'https://www.mountainviewhistorical.org/wp-content/uploads/';

const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));

/* ---- 1. What is at the Internet Archive already ---- */

const ia = read('photos-ia.json');
const iaTitles = new Set((ia.photos || []).map(p => norm(p.title)));

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/* ---- 2. What we hold ourselves ---- */

const photos = read('photos.json').photos || [];
const slides = read('slider.json').slides || [];

const items = new Map();   // url -> record

/* A picture can turn up more than once — catalogued as a photograph, and
   again as it is used inside a page. The first description wins: what the
   catalogue says about a photograph is better than the alt text written for
   one page, and a photograph does not stop being one because a page uses it.
   Only blanks are filled in, and the list of pages always accumulates. */
function add(url, rec) {
  const at = items.get(url);
  if (!at) { items.set(url, rec); return rec; }
  for (const [k, v] of Object.entries(rec)) {
    if (k === 'usedOn') continue;
    if (v && !at[k]) at[k] = v;
  }
  return at;
}

for (const p of photos) {
  if (!p.src.startsWith(WP)) continue;
  add(p.src, {
    url: p.src,
    kind: 'Photograph',
    id: p.id,
    title: p.title,
    date: p.date,
    decade: p.decade,
    topic: p.topic,
    caption: p.caption,
    credit: p.credit || '',
    usedOn: ['Photographs page (data/photos.json)']
  });
}

for (const s of slides) {
  if (!s.src.startsWith(WP)) continue;
  const rec = add(s.src, {
    url: s.src,
    kind: 'Photograph',
    id: '',
    title: s.title,
    date: s.date,
    decade: '',
    topic: '',
    caption: '',
    credit: '',
    usedOn: []
  });
  rec.usedOn.push('Home page slider (data/slider.json)');
  if (!rec.title) rec.title = s.title;
}

/* ---- 3. Pictures used inside pages: banners, flyers, illustrations ---- */

const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))
  .concat(fs.existsSync(path.join(ROOT, 'news'))
    ? fs.readdirSync(path.join(ROOT, 'news')).filter(f => f.endsWith('.html')).map(f => 'news/' + f)
    : []);

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const re = /<img[^>]+src="(https:\/\/www\.mountainviewhistorical\.org\/wp-content\/uploads\/[^"]+)"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    const alt = (m[0].match(/alt="([^"]*)"/) || [, ''])[1];
    const rec = add(url, {
      url, kind: 'Page picture', id: '', title: alt || '', date: '', decade: '',
      topic: '', caption: '', credit: '', usedOn: []
    });
    if (!rec.usedOn.includes(page)) rec.usedOn.push(page);
    if (!rec.title && alt) rec.title = alt;
  }
  // the logo and social preview images are referenced outside <img> too
  const re2 = /(?:content|href)="(https:\/\/www\.mountainviewhistorical\.org\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|gif|webp))"/gi;
  while ((m = re2.exec(html))) {
    const url = m[1];
    const r2 = add(url, {
      url, kind: 'Page picture', id: '', title: '', date: '', decade: '',
      topic: '', caption: '', credit: '', usedOn: []
    });
    if (!r2.usedOn.includes(page)) r2.usedOn.push(page);
  }
}

const all = [...items.values()];
all.forEach(r => {
  r.file = decodeURIComponent(r.url.split('/').pop());
  r.maybeAtIA = r.title && iaTitles.has(norm(r.title)) ? 'possible match by title' : '';
  r.notOurs = /not[-_ ]?mvha/i.test(r.file) || /wx4\.org|image source/i.test(r.credit || '');
  // A photograph credited to a named person is that person's, unless they
  // signed it over. That is not something the website can know.
  r.credited = !r.notOurs && /photo by|courtesy of/i.test(r.credit || '');
});

all.sort((a, b) => (a.kind + a.title).localeCompare(b.kind + b.title));

/* ---- 4. Download ---- */

fs.mkdirSync(path.join(OUT, 'photographs'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'page-pictures'), { recursive: true });

async function main() {
  let got = 0, failed = [];

  if (CATALOGUE_ONLY) {
    console.log(`\nWriting the catalogue for ${all.length} pictures. No downloading.\n`);
  } else {
    console.log(`\nDownloading ${all.length} pictures from the old WordPress server...\n`);
  }

  for (const r of CATALOGUE_ONLY ? [] : all) {
    const folder = r.kind === 'Photograph' ? 'photographs' : 'page-pictures';
    const dest = path.join(OUT, folder, r.file);
    r.folder = folder;
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log('  have  ' + r.file);
      got++;
      continue;
    }
    try {
      const res = await fetch(r.url);
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      r.bytes = buf.length;
      console.log('  ok    ' + r.file + '  (' + Math.round(buf.length / 1024) + ' KB)');
      got++;
    } catch (e) {
      console.log('  FAIL  ' + r.file + ' — ' + e.message);
      failed.push(r.file);
    }
  }

  /* ---- 5. The catalogue ---- */

  const csv = ['File,Kind,Title,Date,Decade,Topic,Caption,Credit,Possibly already at the Internet Archive,Used on']
    .concat(all.map(r => [
      r.file, r.kind, r.title, r.date, r.decade, r.topic, r.caption, r.credit,
      r.maybeAtIA, r.usedOn.join('; ')
    ].map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(',')));
  fs.writeFileSync(path.join(OUT, 'catalogue.csv'), csv.join('\n') + '\n');

  all.forEach(r => { r.folder = r.kind === 'Photograph' ? 'photographs' : 'page-pictures'; });
  fs.writeFileSync(path.join(OUT, 'README.md'), readme(all, failed));

  if (CATALOGUE_ONLY) {
    console.log('  Written photo-export/README.md and photo-export/catalogue.csv.');
    console.log('  Double-click Launchers/Export Photographs.command to fetch the pictures.\n');
    return;
  }

  /* ---- 6. Zip it ---- */

  const zip = path.join(ROOT, 'mvha-photographs.zip');
  try {
    if (fs.existsSync(zip)) fs.unlinkSync(zip);
    execFileSync('zip', ['-r', '-q', zip, 'photo-export'], { cwd: ROOT });
    const mb = (fs.statSync(zip).size / 1024 / 1024).toFixed(1);
    console.log(`\n  Made mvha-photographs.zip (${mb} MB) in the project folder.`);
  } catch (e) {
    console.log('\n  Could not make the .zip (' + e.message + ').');
    console.log('  The pictures and the catalogue are in the photo-export folder.');
  }

  console.log(`\n  ${got} of ${all.length} pictures downloaded.`);
  if (failed.length) console.log('  Could not fetch: ' + failed.join(', '));
  console.log('');
}

function where(r) {
  const list = r.usedOn.filter(u => !u.includes('data/'));
  const data = r.usedOn.filter(u => u.includes('data/'));
  const pages = list.length > 5 ? `${list.length} pages across the site` : list.join(', ');
  return [data.join(', '), pages].filter(Boolean).join(', ');
}

function readme(all, failed) {
  const photographs = all.filter(r => r.kind === 'Photograph');
  const others = all.filter(r => r.kind !== 'Photograph');
  const flagged = all.filter(r => r.notOurs);
  const credited = all.filter(r => r.credited);
  const maybe = all.filter(r => r.maybeAtIA);

  const row = r => `### ${r.title || r.file}

- **File**: \`${r.folder}/${r.file}\`
${r.date ? `- **Date**: ${r.date}\n` : ''}${r.topic ? `- **Topic**: ${r.topic}\n` : ''}${r.caption ? `- **Description**: ${r.caption}\n` : ''}${r.credit ? `- **Credit**: ${r.credit}\n` : ''}${r.maybeAtIA ? `- **Note**: a photograph with this title is already in the Internet Archive listing — check before uploading.\n` : ''}- **Used on**: ${where(r)}
- **Was at**: ${r.url}
`;

  return `# Mountain View Historical Association — photographs held nowhere else

Made by \`tools/export-photos.js\` on ${new Date().toISOString().slice(0, 10)}.

## What this is

The Association's photographs fall into two groups.

**The large group is safe.** About thirteen hundred photographs were digitised
through California Revealed and are held permanently at the Internet Archive,
in two collections — the City of Mountain View Public Library's, and the
Association's own. The website does not store copies of those: it shows the
Internet Archive's thumbnail and links to the item. They are catalogued in
\`data/photos-ia.json\`.

**This package is the other group.** ${all.length} pictures that the website
loads from the old WordPress server at mountainviewhistorical.org and that are
*not* in the Internet Archive listing. If that server is ever switched off,
these are the ones that disappear.

They are of two sorts:

- **${photographs.length} photographs** (in \`photographs/\`) — the Association's own
  pictures, shown on the Photographs page and in the band across the top of
  the home page.
- **${others.length} pictures used inside pages** (in \`page-pictures/\`) — event
  flyers, article illustrations, the logo and similar.

\`catalogue.csv\` lists everything in one table, which is the easier form if
you are filling in an upload form or a spreadsheet.

## Before uploading any of these to the Internet Archive

A few things are worth checking first, because none of them can be settled
from the website's own files:

1. **Who owns each photograph.** The website records where a picture is used,
   not where it came from, so for most of these the answer simply is not
   written down anywhere. The Association can only give away rights it holds,
   and the Internet Archive upload form asks.

${flagged.length ? `2. **Marked as somebody else's.** Do not upload these without asking the
   owner first:\n\n${flagged.map(r => `   - **${r.title || r.file}** — ${r.credit || 'the file name says it is not an MVHA photograph'}`).join('\n')}\n` : '2. Nothing here is marked as belonging to somebody else, but that is not the\n   same as having checked.\n'}
${credited.length ? `3. **Credited to a named photographer.** A photograph belongs to whoever took
   it unless they have signed it over, so these need a word with the
   photographer — usually a short email is enough:\n\n${credited.map(r => `   - **${r.title || r.file}** — ${r.credit}`).join('\n')}\n` : ''}
${credited.length ? '4' : '3'}. **${maybe.length ? `${maybe.length} share a title with something already in the Internet
   Archive listing` : 'No title here matches anything already in the Internet Archive listing'}**${maybe.length ? `, so they may be copies of something already there:

${maybe.map(r => `   - ${r.title}`).join('\n')}` : '.'}

The Association already has its own Internet Archive collection
(\`mountain-view-historical-association\`), so anything uploaded can go there
rather than into the general pool.
${failed.length ? `\n## Not downloaded\n\nThese could not be fetched and are missing from this package:\n\n${failed.map(f => `- ${f}`).join('\n')}\n` : ''}
---

# The photographs

${photographs.map(row).join('\n')}
---

# Pictures used inside pages

${others.map(row).join('\n')}`;
}

main();
