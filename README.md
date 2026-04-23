# अर्थ ArthaBot – Hindi Ambiguity Resolver

> **End-to-End NLP Web Application** | Ambiguity Detection for Hindi & Hinglish  
> *Text Analytics and Natural Language Processing Course Project*

---

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## What is ArthaBot?

ArthaBot is a React-based NLP web application that detects and explains **all 8 types of linguistic ambiguity** in Hindi and Hinglish sentences using the **Google Gemini 2.5 Flash API**. Enter any Hindi or Hinglish sentence and ArthaBot will identify exactly which ambiguity types are present, explain each one in detail, list all possible meanings, and tell you the most likely interpretation.

---

## Demo

> Enter a Hindi or Hinglish sentence → get instant ambiguity analysis with color-coded type cards, severity badges, and all possible interpretations explained.

**Try these example sentences:**
- `वो आम खाता है` – Lexical ambiguity
- `राम और श्याम की बहन आई` – Syntactic ambiguity
- `कल मैं नहीं आऊंगा` – Scope ambiguity
- `Usne apni car mein unhe choda` – Pragmatic ambiguity
- `मैंने उसे देखा जब वो बाजार में था` – Referential ambiguity

---

## Ambiguity Types Covered

| # | Type | Level | Hindi Example |
|---|------|-------|---------------|
| 1 | **Lexical Ambiguity** | Word | *आम* = mango OR common/ordinary |
| 2 | **Syntactic Ambiguity** | Structure | *राम और श्याम की बहन* – one sister or two? |
| 3 | **Semantic Ambiguity** | Meaning | *उसकी आँखें बोलती हैं* – literal or figurative? |
| 4 | **Pragmatic Ambiguity** | Intent | *पानी लाओ* – command, request, or plea? |
| 5 | **Referential Ambiguity** | Discourse | *उसने उसे देखा* – who saw whom? |
| 6 | **Scope Ambiguity** | Logic | *सब लोग नहीं आए* – some or none came? |
| 7 | **Phonological Ambiguity** | Sound | Hinglish transliteration homophones |
| 8 | **Morphological Ambiguity** | Word Form | *खेला* – verb (played) or noun (a game)? |

---

## Features

- **Real-time analysis** – results appear within seconds
- **All 8 NLP ambiguity types** detected in a single pass
- **Color-coded cards** – each ambiguity type has a unique visual identity
- **Severity badges** – High / Medium / Low per detected type
- **Possible interpretations** – every valid reading of the sentence listed
- **Most likely meaning** – model picks the most natural interpretation
- **Linguistic notes** – academic explanation of why the ambiguity exists
- **Hinglish support** – handles Roman transliterated Hindi alongside Devanagari
- **Example sentences** – clickable chips to test instantly
- **Dark theme UI** – professional, readable interface with Lucide icons
- **Powered** – uses Gemini 2.5 Flash free tier

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 |
| Build tool | Vite 5 |
| UI icons | Lucide React |
| AI model | Google Gemini 2.5 Flash |
| API communication | Fetch API (browser-native) |
| Styling | Inline styles |
| Font | Noto Serif Devanagari + Georgia |

---

## Project Structure

```
hindi-ambiguity-resolver/
│
├── src/
│   ├── App.jsx         # Complete application — UI + Gemini API logic
│   └── main.jsx        # React entry point
│
├── index.html          # HTML shell with Devanagari font imports
├── vite.config.js      # Vite configuration
├── package.json        # Node dependencies
├── .env                # Your Gemini API key
└── .gitignore          # Excludes .env and node_modules
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free Google Gemini API key

---

### Step 1 — Get a Free Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** in the left sidebar
4. Click **Create API Key**
5. Copy the key — it starts with `AIzaSy...`

---

### Step 2 — Clone the Repository

```bash
git clone https://github.com/arpita-prasad/ambiguity.git
cd hindi-ambiguity-resolver
```

---

### Step 3 — Install Dependencies

```bash
npm install
```

---

### Step 4 — Add Your API Key

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=AIzaSy_your_key_here
```

Then open `src/App.jsx` and update the fetch call headers to include the key:

```js
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // ...
  }
);
```

---

### Step 5 — Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How It Works

```
User enters sentence
        │
        ▼
React App (App.jsx)
        │
        ▼
POST to Gemini 2.5 Flash API
with structured system prompt
        │
        ▼
Gemini analyzes sentence for
all 8 NLP ambiguity types
        │
        ▼
Returns structured JSON response
        │
        ▼
React renders color-coded results:
  • Ambiguity type cards
  • Severity badges
  • Possible meanings list
  • Most likely interpretation
  • Linguistic note
```

The system prompt instructs Gemini to act as an NLP linguist and return a strictly structured JSON object.

---

## API Response Structure

The app receives and renders this JSON structure from Gemini:

```json
{
  "original_sentence": "वो आम खाता है",
  "language_detected": "Hindi",
  "ambiguity_found": true,
  "ambiguities": [
    {
      "type": "LEXICAL AMBIGUITY",
      "category": "Word-level",
      "explanation": "The word 'आम' can mean mango (noun) or common/ordinary (adjective)...",
      "example_from_sentence": "आम",
      "severity": "high"
    }
  ],
  "possible_meanings": [
    {
      "meaning_number": 1,
      "interpretation": "He eats mango.",
      "explanation": "Treating 'आम' as a noun referring to the fruit.",
      "context_clue": "The verb 'खाता' (eats) strongly implies food context."
    },
    {
      "meaning_number": 2,
      "interpretation": "He does ordinary things.",
      "explanation": "Treating 'आम' as an adjective meaning common/ordinary.",
      "context_clue": "Less natural without additional context."
    }
  ],
  "resolved_most_likely": "He eats mango — the fruit-eating interpretation is most natural.",
  "confidence": "high",
  "linguistic_note": "Classic Hindi polysemy where 'आम' serves dual roles..."
}
```

## Limitations

- Requires an active internet connection (API calls to Google)
- Free tier rate limit: 15 requests per minute on Gemini 2.5 Flash
- Analysis quality depends on Gemini's understanding of Hindi/Hinglish
- No offline mode – entirely dependent on the Gemini API being available

---

## NLP Background

The 8 ambiguity types detected by ArthaBot correspond to the standard classification used in NLP research and coursework:

- **Lexical** – polysemy and homonymy at the word level
- **Syntactic** – attachment and coordination ambiguity in parse trees  
- **Semantic** – figurative vs. literal meaning
- **Pragmatic** – speaker intent and speech act theory (Grice's Maxims)
- **Referential** – pronoun/coreference resolution
- **Scope** – negation and quantifier scope in logical form
- **Phonological** – homophone ambiguity, critical in Hinglish transliteration
- **Morphological** – POS ambiguity from identical word forms

---

## License

This project is for academic use as part of a Text Analytics and NLP course.

---

<div align="center">
  <strong>अर्थ ArthaBot</strong> · Built with React + Vite + Google Gemini API<br/>
  Text Analytics & NLP · 2026
</div>
