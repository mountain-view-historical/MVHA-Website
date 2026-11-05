#!/usr/bin/env python3
"""
Turn David Salinero's finding-aid spreadsheets into data the website can use.
-----------------------------------------------------------------------------
A finding aid is the inventory of one donated collection: what it is, who gave
it, where it is shelved, and a box-by-box list of what is inside. The History
Center volunteers write them in Excel, one spreadsheet per collection, using
the template in David's Google Drive folder ("MVHA-findingaids-storage").

The spreadsheets are the master copy. This script only reads them. It writes
one file:

    data/finding-aids.json

which the build (tools/build.js) turns into a page per collection, and which
the Collection Guides page and site search read in the browser.

HOW TO UPDATE THE WEBSITE AFTER DAVID CHANGES A FINDING AID
  1. Download the folder from Google Drive (right-click it -> Download).
  2. Copy the *_findingaid.xlsx files into tools/finding-aids/source/,
     replacing the old ones.
  3. Commit and push in GitHub Desktop.
  GitHub then runs this script by itself (.github/workflows/finding-aids.yml)
  and commits the result. Nobody needs a Terminal.

  To run it on a computer instead:   python3 tools/finding-aids/build_finding_aids.py
  It needs the "openpyxl" package (pip install openpyxl).

WHAT IT SKIPS, AND WHY
  * Any spreadsheet that does not have the two template tabs, "Collection
    description" and "Box contents". That leaves out the box-label template
    and the storage-room map, which live in the same Drive folder.
  * David's worked example, "aaSample Family Archives".
  * Completely blank rows.
"""

import datetime
import json
import re
import sys
from pathlib import Path

try:
    import openpyxl
except ImportError:
    sys.exit("This script needs openpyxl.  Install it with:  pip install openpyxl")

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).resolve().parent / "source"
OUT = ROOT / "data" / "finding-aids.json"

DESCRIPTION_TAB = "Collection description"
CONTENTS_TAB = "Box contents"

# The template's first tab pairs a label with an XML tag (column B) and a
# value (column C). The tags never change, so they are what we look up by --
# a volunteer can reword a label or move a row without breaking anything.
FIELDS = {
    "<unittitle>": "title",
    "<origination>": "creator",
    "<unitdate>": "dates",
    "<geogname>": "place",
    "<abstract>": "significance",
    "<physdesc>": "extent",
    "<scopecontent>": "scope",
    "<index>": "subjects",
    "<custodhist>": "owner",
    "<acqinfo>": "donor",
    "<unitid>": "accession",
    "<originalsloc>": "location",
    "<accessrestrict>": "access",
    "<languageset>": "language",
    "<author>": "archivist",
    "<eventdatetime>": "created",
    "<repository>": "repository",
    "<recordid>": "number",
}

# Columns on the "Box contents" tab, found by their heading.
COLUMNS = {
    "Description": "d",
    "Dates": "dates",
    "Box": "box",
    "Container": "container",
    "Condition": "condition",
    "Donor": "donor",
    "Accession Date": "accessioned",
}

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

OWNERS = {"MVHA": "Mountain View Historical Association",
          "MVPL": "Mountain View Public Library"}


def tidy(value):
    """A cell as clean text. Spreadsheets hold numbers and dates as well as
    words, and volunteers' typing carries stray spaces and blank lines."""
    if value is None:
        return ""
    if isinstance(value, datetime.datetime):
        value = value.date()
    if isinstance(value, datetime.date):
        return f"{MONTHS[value.month - 1]} {value.day}, {value.year}"
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    if isinstance(value, int):
        return compact_date(str(value))
    text = str(value).replace("\r\n", "\n").replace("\r", "\n")
    lines = [re.sub(r"[ \t ]+", " ", line).strip() for line in text.split("\n")]
    return "\n".join(line for line in lines if line)


def compact_date(digits):
    """The template asks for dates as YYYYMMDD, so 19740824 means 24 August
    1974 and 197408 means August 1974. Anything else is left as typed."""
    m = re.fullmatch(r"(1[789]\d\d|20\d\d)(0[1-9]|1[0-2])(\d\d)?", digits)
    if not m:
        return digits
    year, month, day = int(m.group(1)), int(m.group(2)), m.group(3)
    if day is None:
        return f"{MONTHS[month - 1]} {year}"
    try:
        datetime.date(year, month, int(day))
    except ValueError:
        return digits
    return f"{MONTHS[month - 1]} {int(day)}, {year}"


def dates_in(text):
    """'20260203, 20261027' -> 'Feb 3, 2026, Oct 27, 2026'."""
    return re.sub(r"\b\d{6,8}\b", lambda m: compact_date(m.group(0)), text)


def box_label(raw):
    """'box 4 ', 'Box 4' and a bare '4' are all Box 4."""
    text = tidy(raw)
    if not text:
        return ""
    if re.fullmatch(r"\d+", text):
        return f"Box {text}"
    return text[0].upper() + text[1:]


def slugify(text):
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:70]


def read_workbook(path):
    wb = openpyxl.load_workbook(path, data_only=True, read_only=True)
    if DESCRIPTION_TAB not in wb.sheetnames or CONTENTS_TAB not in wb.sheetnames:
        return None, "not a finding aid (no Collection description / Box contents tabs)"

    meta = {}
    for row in wb[DESCRIPTION_TAB].iter_rows(values_only=True):
        if len(row) >= 3 and row[1] in FIELDS:
            meta[FIELDS[row[1]]] = tidy(row[2])

    title = meta.get("title", "")
    if not title:
        return None, "has no Title"
    if title.lower().startswith("aasample"):
        return None, "David's worked example"

    rows = wb[CONTENTS_TAB].iter_rows(values_only=True)
    heading = [tidy(h) for h in next(rows, [])]
    where = {COLUMNS[h]: i for i, h in enumerate(heading) if h in COLUMNS}
    if "d" not in where:
        return None, "Box contents tab has no Description column"

    boxes = []          # in the order the volunteers listed them
    by_label = {}
    last = ""
    for row in rows:
        item = {}
        for key, i in where.items():
            if i < len(row):
                value = row[i]
                item[key] = box_label(value) if key == "box" else tidy(value)
        if not any(item.values()):
            continue
        if not item.get("d"):
            item["d"] = "(no description)"
        # A row with the box left blank almost always belongs with the row
        # above it -- the second of two canes, the rest of a folder.
        label = item.pop("box", "") or last or "Other items"
        last = label
        key = label.lower()
        if key not in by_label:
            by_label[key] = {"box": label, "items": []}
            boxes.append(by_label[key])
        by_label[key]["items"].append({k: v for k, v in item.items() if v})

    meta = {k: v for k, v in meta.items() if v}
    # "Kinchen-Notes finding aid" -> "Kinchen-Notes": every page here is one.
    meta["title"] = re.sub(r"\s*finding aid\s*$", "", title, flags=re.I).strip() or title
    if "created" in meta:
        meta["created"] = dates_in(meta["created"])
    if meta.get("owner") in OWNERS:
        meta["ownerName"] = OWNERS[meta["owner"]]
    if meta.get("access", "").lower() == "none":
        meta["access"] = "None"
    meta["source"] = path.name
    meta["boxes"] = boxes
    meta["count"] = sum(len(b["items"]) for b in boxes)
    return meta, None


def main():
    files = sorted(SOURCE.glob("*.xlsx"))
    if not files:
        sys.exit(f"No spreadsheets found in {SOURCE}")

    collections, used = [], set()
    for path in files:
        if path.name.startswith("~$"):        # Excel's lock file while open
            continue
        try:
            record, why = read_workbook(path)
        except Exception as e:                # one bad file must not stop the rest
            print(f"  !  {path.name}: could not be read ({e})")
            continue
        if not record:
            print(f"  --  {path.name}: skipped, {why}")
            continue
        slug = base = slugify(record["title"]) or slugify(path.stem)
        n = 2
        while slug in used:
            slug = f"{base}-{n}"
            n += 1
        used.add(slug)
        record = {"slug": slug, **record}
        collections.append(record)
        print(f"  ok  {path.name}: {record['title']} ({record['count']} items)")

    collections.sort(key=lambda c: c["title"].lower())
    OUT.write_text(json.dumps({
        "_comment": "GENERATED by tools/finding-aids/build_finding_aids.py from the "
                    "spreadsheets in tools/finding-aids/source/. Do not edit by hand: "
                    "change the spreadsheet instead.",
        "collections": collections,
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    items = sum(c["count"] for c in collections)
    print(f"\nWrote {OUT.relative_to(ROOT)}: {len(collections)} collections, {items} items.")


if __name__ == "__main__":
    main()
