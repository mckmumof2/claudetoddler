---
title: agent-reach
icon: 🌐
category: scraping
description: Agent Reach - Multi-platform data collection tool for social media, web, YouTube, Reddit, and more
activate_on: 
---

# Agent Reach

Agent Reach provides multi-platform data collection capabilities.

## Installation Status
- ✓ Installed at: `~/.venv-tools/`
- ✓ Version: 1.5.0
- ✓ CLI: `agent-reach`

## Quick Commands

### Health Check
```bash
source ~/.venv-tools/bin/activate
agent-reach doctor
```

### Core Platforms (Zero-Config)
- **Web Scraping**: `curl -s "https://r.jina.ai/{URL}"`  
- **YouTube**: `yt-dlp --dump-json {URL}`
- **Bilibili**: `bili search "query"`
- **GitHub**: `gh search repos "query"`
- **RSS/Feeds**: `feedparser`

### Optional Platforms (Cookie/Config Required)
- **Twitter/X**: Set `TWITTER_AUTH_TOKEN` and `TWITTER_CT0` environment variables
- **Reddit**: Uses `rdt-cli` or `opencli` (requires login)
- **TikTok/Instagram/Facebook**: Via `opencli` (desktop + Chrome)
- **小红书 (XHS)**: Via `opencli` or `xiaohongshu-mcp`
- **小宇宙 Podcast**: `transcribe.sh` (needs free Groq API key)
- **Xueqiu (Stocks)**: Via Cookie-Editor browser export

## Environment Setup

```bash
# Activate the virtual environment
source ~/.venv-tools/bin/activate

# Run doctor to check all channels
agent-reach doctor

# For platforms that need cookies, use Cookie-Editor browser extension:
# 1. Install: https://chromewebstore.google.com/detail/cookie-editor/...
# 2. Login to platform in Chrome
# 3. Click extension → Export → Header String
# 4. Save to config or env variable
```

## Usage Examples

```bash
# Search web via Jina
curl -s "https://r.jina.ai/https://example.com" | jq .

# YouTube metadata
yt-dlp --dump-json "https://www.youtube.com/watch?v=..."

# Bilibili search
source ~/.venv-tools/bin/activate
bili search "query" --type video

# GitHub search  
gh search repos "language:python stars:>1000"

# Check all platform status
agent-reach watch
```

## Manual Setup Steps

These platforms need user configuration before use:
- **Twitter/X**: Cookie via `agent-reach configure twitter-cookies`
- **Xueqiu**: Browser login via `agent-reach configure --from-browser chrome --platform xueqiu`
- **小宇宙 Podcast**: Free Groq API key via `agent-reach configure groq-key`
- **小红书**: Cookie via `agent-reach configure xhs-cookies` or browser extension

## Configuration Files
- Config: `~/.agent-reach/config.json`
- Tools: `~/.agent-reach/tools/`
- Tool repos auto-clone to `~/.agent-reach/tools/{platform}/`

## Supported Channels
✓ Web (Jina Reader), YouTube, GitHub, RSS, V2EX
⚠️ Twitter, Reddit, TikTok, Instagram, Facebook (require cookies/login)
⚠️ 小红书, 小宇宙, 雪球, B站 (require setup)
