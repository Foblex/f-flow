# Answer Pack Specification

The generator must produce exactly three drafts in JSON format:

```json
{
  "source": {
    "type": "github_issue|github_discussion|website",
    "repo": "Foblex/f-flow",
    "url": "https://github.com/Foblex/f-flow/issues/258",
    "number": 258,
    "author": "username",
    "title": "..."
  },
  "drafts": [
    {"id": "A", "tone": "short", "description": "Short engineering answer", "text": "markdown...", "citations": []},
    {"id": "B", "tone": "technical", "description": "Detailed technical answer", "text": "markdown...", "citations": []},
    {"id": "C", "tone": "clarify", "description": "Ask for missing info / repro", "text": "markdown...", "citations": []}
  ],
  "confidence": 0.0,
  "missing_context": ["Angular version","@foblex/flow version","minimal reproduction"]
}
```

- The response must be **valid JSON only** without extra text.
- Include citations to code or docs URLs when available.
- If confidence is low, produce a clarifying draft with questions.
