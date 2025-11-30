# Prompt Builder

A powerful, desktop-based Prompt Engineering IDE built with Electron and React.

![Prompt Builder Logo](public/logo.png)

## Features

*   **Dynamic Prompt Editor**: Use `{{variable}}` syntax for dynamic inputs.
*   **Local-First**: All templates and data are stored locally on your machine.
*   **Client-Side RAG**: Intelligent context retrieval from your local documents (PDF, DOCX, JSON).
*   **Reasoning Strategies**: Built-in support for Chain of Thought and Planning prompts.
*   **Template Library**: Save and organize your best prompts.
*   **Export**: Copy to clipboard or export to text files.

## Installation

### Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run electron:dev
    ```

### Build

To build the application for Windows:

```bash
npm run electron:build
```

The executable will be found in `dist-electron/win-unpacked/Prompt Builder.exe`.

## Testing

Run the quality assurance suite:

```bash
npm test
```

## Tech Stack

*   **Frontend**: React, Vite
*   **Backend**: Electron
*   **Styling**: Vanilla CSS (Dark Theme)
*   **Parsers**: pdfjs-dist, mammoth

## License

MIT
