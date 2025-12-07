# Prompt Builder

A powerful, desktop-based Prompt Engineering IDE built with **Tauri** and **React**.

![Prompt Builder Logo](public/logo.png)

## Features

### 🚀 Core Capabilities
*   **Dynamic Prompt Editor**: Use `{{variable}}` syntax for dynamic inputs.
*   **Local-First**: All templates, topics, and knowledge are stored locally on your machine.
*   **Client-Side RAG**: Intelligent context retrieval from your local documents (PDF, DOCX, JSON).
*   **Reasoning Strategies**: Built-in support for Chain of Thought and Planning prompts.

### ✨ New in v2.0.0
*   **Ultra-Lightweight**: Migrated to Tauri for massive performance gains. Installer size reduced by ~95%.
*   **Native Performance**: Uses the OS's native webview instead of bundling Chrome.
*   **Low Memory Usage**: Significantly lower RAM footprint than previous versions.

### ✨ v1.2.0 Features
*   **Selectable Topics**: Define rich guardrails and capabilities (Instructions, Actions) and selectively apply them to your prompts.
*   **Output Structure Control**: Define exactly how you want the AI to respond (JSON, XML, Markdown, etc.) with a dedicated editor.
*   **Expanded Content Library**: Comes pre-loaded with templates and standard topics.

### 🛠️ Tools
*   **Template Library**: Save and organize your best prompts.
*   **Knowledge Base**: Upload files to ground your agent's responses.
*   **Export**: Copy to clipboard or export to text files.

## Installation

### Prerequisites
- **Rust**: You must have Rust installed to build the app. [Install Rust](https://rustup.rs/)

### Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    # Wait for Rust dependencies to compile
    ```
3.  Run the development server:
    ```bash
    npm run tauri:dev
    ```

### Build

To build the optimized installer for Windows:

```bash
npm run tauri:build
```

The executable will be found in `src-tauri/target/release/bundle/nsis/`.

## Testing

Run the quality assurance suite:

```bash
npm test
```

## Tech Stack

*   **Frontend**: React, Vite
*   **Backend**: Tauri (Rust), SQLite (Internal)
*   **Styling**: Vanilla CSS (Dark Theme)
*   **Parsers**: pdfjs-dist, mammoth
*   **Parsers**: pdfjs-dist, mammoth

## License

MIT
