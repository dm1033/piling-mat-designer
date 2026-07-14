#!/bin/sh
# Resolve the SKILL.md path for the last30days skill in the Claude plugin cache.
#
# Two cache layouts ship in the wild:
#   nested: {version}/skills/last30days/SKILL.md
#   flat:   {version}/SKILL.md
# This picks the latest cached version (semver-aware via sort -V) and resolves
# to whichever layout actually exists. Both variables stay empty when the
# skill is not cached.
#
# Usage: . scripts/resolve-skill-cache.sh   (source to use the variables)
#        scripts/resolve-skill-cache.sh     (run to print the resolved path)

CLAUDE_CACHE_LATEST=$(find "$HOME/.claude/plugins/cache/last30days-skill/last30days" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort -V | tail -1)
CLAUDE_CACHE_SKILL_MD=""
if [ -n "$CLAUDE_CACHE_LATEST" ]; then
  if [ -f "$CLAUDE_CACHE_LATEST/skills/last30days/SKILL.md" ]; then
    CLAUDE_CACHE_SKILL_MD="$CLAUDE_CACHE_LATEST/skills/last30days/SKILL.md"
  elif [ -f "$CLAUDE_CACHE_LATEST/SKILL.md" ]; then
    CLAUDE_CACHE_SKILL_MD="$CLAUDE_CACHE_LATEST/SKILL.md"
  fi
fi
echo "CLAUDE_CACHE_SKILL_MD=$CLAUDE_CACHE_SKILL_MD"
