#!/bin/sh
# Minimal husky helper to source in hooks. This file is created to allow
# existing hook scripts to run when husky install isn't available.

husky_skip_hook() {
  [ -n "${HUSKY_SKIP_HOOKS}" ] && return 0 || return 1
}

# locate git root
git_rev_parse() {
  git rev-parse --show-toplevel 2>/dev/null || echo ""
}

ROOT_DIR=$(git_rev_parse)

if [ -z "$ROOT_DIR" ]; then
  # Not a git repo — allow scripts to run but warn
  :
fi

export HUSKY=1
