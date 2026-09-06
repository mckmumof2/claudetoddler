---
title: scrapling
icon: 🕸️
category: scraping
description: Scrapling - Adaptive web scraping framework with parser learning and anti-bot bypass
activate_on:
---

# Scrapling

Adaptive web scraping framework that handles everything from simple requests to full-scale crawls.

## Installation Status
- ✓ Installed at: `~/.venv-tools/`
- ✓ Version: 0.4.15
- ✓ Python Package: `scrapling`
- ✓ MCP Server: Registered in `.claude/settings.json`

## Quick Start

### Basic Fetch
```bash
source ~/.venv-tools/bin/activate
python3 << 'PYTHON'
from scrapling.fetchers import Fetcher

# Simple HTTP request
response = Fetcher.fetch('https://example.com')
print(response.text[:500])

# Extract with CSS selectors
title = response.css('title::text').get()
links = response.css('a::attr(href)').getall()
print(f"Title: {title}, Links: {links}")
PYTHON
```

### Adaptive Parsing (Learns from Changes)
```python
from scrapling.fetchers import Fetcher

response = Fetcher.fetch('https://example.com')

# First fetch — extract products with auto_save=True
products = response.css('.product', auto_save=True)

# Later, if site structure changes, pass adaptive=True
products = response.css('.product', adaptive=True)  # Finds them anyway!
```

### Stealth Fetching (Bypass Anti-Bot)
```python
from scrapling.fetchers import StealthyFetcher

StealthyFetcher.adaptive = True
response = StealthyFetcher.fetch(
    'https://example.com',
    headless=True,
    network_idle=True
)
products = response.css('.product')
```

### Full Spider Crawls
```python
from scrapling.spiders import Spider, Response

class MySpider(Spider):
    name = "demo"
    start_urls = ["https://example.com/"]
    
    async def parse(self, response: Response):
        # Yield data
        for item in response.css('.product'):
            yield {
                "title": item.css('h2::text').get(),
                "price": item.css('.price::text').get(),
            }
        
        # Follow links
        for link in response.css('a.next::attr(href)').getall():
            yield response.follow(link, self.parse)

MySpider().start()  # Start crawl with stats & pause/resume
```

## Fetcher Types

| Fetcher | Use | Speed | Anti-Bot |
|---------|-----|-------|----------|
| **Fetcher** | Simple HTTP | ⚡⚡⚡ Fast | ❌ None |
| **AsyncFetcher** | Concurrent requests | ⚡⚡⚡ Fast | ❌ None |
| **StealthyFetcher** | Browser (stealth) | ⚡ Slow | ✓ Cloudflare, etc |
| **DynamicFetcher** | Heavy JS rendering | 🐌 Very slow | ✓ Full JS |

## Selection Methods

```python
response.css('selector')           # CSS selectors
response.xpath('//div')            # XPath
response.regex(r'pattern')         # Regex matching
response.jmespath('key.subkey')    # JSON Path

# With modifiers
response.css('title::text').get()  # First match, text only
response.css('.item').getall()     # All matches
response.css('.price::attr(data-val)')  # Attribute extraction
```

## Spider Features

- **Pause/Resume**: Crawl stops cleanly, resumes from checkpoint
- **Proxy Rotation**: Automatic rotation with backoff
- **Concurrent**: Multi-session parallel crawls
- **Adaptive Speed**: Auto-throttle based on server response
- **Real-time Stats**: Live crawl progress & performance

## Environment Configuration

Set in `~/.bashrc` or `.env`:
```bash
# Proxy rotation (optional)
export SCRAPLING_PROXY_FILE="/path/to/proxies.txt"

# Headless browser options
export SCRAPLING_HEADLESS=true
export SCRAPLING_TIMEOUT=30
```

## Configuration & Proxy
- Proxy file format: One proxy per line (http://host:port, socks5://...)
- Builtin proxy rotation automatically backs off on blocking
- Local caching preserves extracted data across runs

## Testing
```bash
source ~/.venv-tools/bin/activate
python3 << 'PYTHON'
from scrapling import __version__
from scrapling.fetchers import Fetcher
print(f"✓ Scrapling {__version__} ready")

# Quick test
response = Fetcher.fetch('https://example.com')
print(f"✓ Fetched {len(response.text)} bytes from example.com")
PYTHON
```

## When to Use Each Tool

- **Scrapling**: Fast crawls, learning parsers, proxy rotation, paused crawls
- **Agent Reach**: Multi-platform data collection (social media, YouTube, etc.)
- **ScrapeGraphAI**: LLM-powered extraction (complex structures, dynamic extraction)
