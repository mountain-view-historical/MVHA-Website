#!/bin/bash
# ==========================================================================
# Export the photographs that exist nowhere else
# --------------------------------------------------------------------------
# Downloads every picture the website still loads from the old WordPress
# server, writes a catalogue of what we know about each one, and puts the lot
# in mvha-photographs.zip in the project folder.
#
# The thirteen hundred photographs at the Internet Archive are not included —
# they are already safe there. These are the others.
#
# Safe to run more than once: anything already downloaded is kept.
# ==========================================================================

cd "$(dirname "$0")/.." || exit 1

[ -t 1 ] && clear
echo
echo "  ────────────────────────────────────────────────────────────"
echo "   Export the photographs"
echo "  ────────────────────────────────────────────────────────────"
echo

. "$(dirname "$0")/find-node.sh"

if [ -z "$NODE" ]; then
  echo "  Node.js was not found on this Mac, so this cannot run."
  echo
  echo "  Download the LTS version from nodejs.org, install it, then run"
  echo "  this again."
  echo
  echo "  Press any key to close this window."
  read -r -n 1
  exit 1
fi

echo "  Using Node $("$NODE" --version)"
echo "  This downloads about sixty pictures, so give it a minute."

"$NODE" tools/export-photos.js

echo "  Everything is in the photo-export folder, and zipped up as"
echo "  mvha-photographs.zip beside index.html."
echo
echo "  Press any key to close this window."
read -r -n 1
