---
title: scrapegraphai  
icon: 🕷️
category: scraping
description: ScrapeGraphAI - LLM-powered web scraping with multiple graph types and LLM backends
activate_on:
---

# ScrapeGraphAI (Scrapegraph-ai)

LLM-powered web scraping that turns websites into structured data.

## Installation Status
- ✓ Installed at: `~/.venv-tools/`
- ✓ Version: 1.76.0
- ✓ Python Package: `scrapegraphai`

## Activation

This tool requires either:
1. **Local LLM** (Ollama): `ollama run llama2` (free, runs locally, slow)
2. **Cloud LLM API Key**: OpenAI, Groq, Gemini, Azure, etc. (fast, requires credits)
3. **Managed API** (ScrapeGraphAI Cloud): `SGAI_API_KEY` (premium, fully managed)

## Quick Start

### With Local Ollama (Free, No Keys)
```bash
source ~/.venv-tools/bin/activate

# Install Ollama from https://ollama.ai, then:
ollama run llama2

# In another terminal:
python3 << 'PYTHON'
from scrapegraphai.graphs import SmartScraperGraph
config = {
    "llm": {
        "model": "ollama/llama2",
        "model_tokens": 4096,
    },
    "headless": True,
}
graph = SmartScraperGraph(
    prompt="Extract the title and description",
    source="https://example.com",
    config=config
)
result = graph.run()
print(result)
PYTHON
```

### With OpenAI API Key
```bash
export OPENAI_API_KEY="sk-..."
python3 << 'PYTHON'
from scrapegraphai.graphs import SmartScraperGraph
config = {
    "llm": {
        "api_key": "${OPENAI_API_KEY}",
        "model": "openai/gpt-4o-mini",
    },
    "headless": True,
}
graph = SmartScraperGraph(
    prompt="Extract title and main content",
    source="https://example.com",
    config=config
)
result = graph.run()
print(result)
PYTHON
```

### With ScrapeGraphAI Managed API (Premium)
```bash
export SGAI_API_KEY="sgai_..."  # Get from https://scrapegraphai.com
python3 << 'PYTHON'
from scrapegraph_py import ScrapegraphAPIClient

client = ScrapegraphAPIClient(api_key="${SGAI_API_KEY}")
result = client.smartscraper(
    website_url="https://example.com",
    user_prompt="Extract title and description"
)
print(result)
PYTHON
```

## Available Graph Types

| Graph | Use Case | Example |
|-------|----------|---------|
| **SmartScraperGraph** | Single page, LLM extraction | Extract product info from a page |
| **SearchGraph** | Multi-page search results | Search Google results, then extract |
| **SpeechGraph** | Page + audio generation | Scrape + generate podcast episode |
| **ScriptCreatorGraph** | Generate Python scraper | Auto-create reusable script |
| **SmartScraperMultiGraph** | Multi-page batch | Scrape 100 product pages |

## LLM Provider Configuration

### Groq (Fast, Free with limits)
```bash
export GROQ_API_KEY="gsk_..."  # Free key from https://console.groq.com
# Then use: "model": "groq/mixtral-8x7b-32768"
```

### Azure OpenAI
```bash
export AZURE_API_KEY="..."
export AZURE_ENDPOINT="https://...openai.azure.com/"
# Then use: "model": "azure/deployment-name"
```

### Gemini
```bash
export GOOGLE_API_KEY="..."
# Then use: "model": "gemini/gemini-pro"
```

## Environment Setup

Add to `~/.bashrc` or `.env`:
```bash
# Choose ONE of these:
export OPENAI_API_KEY="sk-..."         # OpenAI
export GROQ_API_KEY="gsk-..."           # Groq (free)
export AZURE_API_KEY="..."              # Azure
export GOOGLE_API_KEY="..."             # Gemini
export SGAI_API_KEY="sgai_..."          # ScrapeGraphAI managed API
```

## Configuration File
- Location: `~/.venv-tools/lib/python3.11/site-packages/scrapegraphai/`
- Settings: LLM model, tokens, headless mode, timeout, proxy

## Testing
```bash
source ~/.venv-tools/bin/activate
python3 -c "from scrapegraphai.graphs import SmartScraperGraph; print('✓ ScrapegraphAI ready')"
```

## Limitations
- Browser (Playwright) setup needed for JS-heavy sites — pre-installed but may need manual browser download
- Local Ollama models are slow (~30s per page)
- Cloud APIs require valid credentials and active subscription/credits
- Some websites block automated scraping; Managed API includes proxy/anti-bot
