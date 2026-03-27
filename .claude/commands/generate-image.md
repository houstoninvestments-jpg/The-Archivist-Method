# Generate Image

Generate an AI image using the Google Gemini API and save it to `public/images/generated/`.

## Usage

```
/generate-image <prompt>
```

## Instructions

Run the following command from the project root, passing the user's prompt (everything after `/generate-image`) as a single quoted argument:

```bash
node scripts/generate-image.js "$ARGUMENTS"
```

After the command completes, report the saved file path shown in the output. If an error occurs, show the full error message so the user can debug it (e.g. missing API key, API quota exceeded).

**Requirements:**
- `GEMINI_API_KEY` must be set in `.env` at the project root.
- Node 18 or later (uses native `fetch` and top-level `await`).
- Output lands in `public/images/generated/<timestamp>.png`.
