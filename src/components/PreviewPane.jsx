import RagEngine from '../utils/RagEngine';

const PreviewPane = ({ prompt, variables, role, goal, topics, knowledge, examples, reasoning, ragSettings }) => {
    const getPreviewText = () => {
        let preview = '';

        if (role) preview += `Role:\n${role}\n\n`;
        if (goal) preview += `Goal:\n${goal}\n\n`;

        if (topics && topics.length > 0) {
            preview += `Topics:\n${topics.map(t => `- ${t}`).join('\n')}\n\n`;
        }

        if (knowledge && knowledge.length > 0) {
            let knowledgeContent = '';

            if (ragSettings && ragSettings.enabled) {
                // RAG Mode: Retrieve relevant chunks
                // We construct a query from the prompt + role + goal to give better context
                const query = `${role} ${goal} ${prompt}`;
                const retrievedChunks = RagEngine.retrieve(query, knowledge, ragSettings);

                if (retrievedChunks.length > 0) {
                    knowledgeContent = `Knowledge Sources (Retrieved):\n${retrievedChunks.map((chunk, i) => {
                        return `[Source: ${chunk.sourceName}] (Score: ${chunk.score.toFixed(2)})\n${chunk.content}`;
                    }).join('\n\n')}`;
                } else {
                    knowledgeContent = `Knowledge Sources:\n(No relevant information found for the current prompt)`;
                }
            } else {
                // Standard Mode: Show all sources (truncated)
                knowledgeContent = `Knowledge Sources:\n${knowledge.map(k => {
                    let sourceInfo = `- ${k.name} (${k.type})`;
                    if (k.content) {
                        const snippet = k.content.length > 200 ? k.content.substring(0, 200) + '...' : k.content;
                        sourceInfo += `\n  Content Snippet: ${snippet}`;
                    }
                    return sourceInfo;
                }).join('\n')}`;
            }

            preview += `${knowledgeContent}\n\n`;
        }

        if (examples && examples.length > 0) {
            preview += `Few-Shot Examples:\n${examples.map((ex, i) => `Example ${i + 1}:\nUser: ${ex.input}\nAssistant: ${ex.output}`).join('\n\n')}\n\n`;
        }

        if (reasoning) {
            preview += `Reasoning Configuration:\n`;

            // Reasoning Effort
            if (reasoning.effort === 'low') {
                preview += `[Reasoning Effort: Low]\n- Provide brief, bullet-point explanations.\n- Focus on speed and conciseness.\n`;
            } else if (reasoning.effort === 'high') {
                preview += `[Reasoning Effort: High]\n- Plan extensively before answering.\n- Decompose the user's query into sub-tasks.\n- Reflect on outcomes before proceeding.\n`;
            }

            // Strategic Instructions
            if (reasoning.strategies && reasoning.strategies.length > 0) {
                preview += `\nStrategic Instructions:\n`;
                if (reasoning.strategies.includes('tool_preamble')) {
                    preview += `<tool_preambles>\n- Always begin by rephrasing the user's goal.\n- Outline a structured plan detailing each logical step.\n- Narrate each step succinctly as you execute it.\n- Finish by summarizing completed work.\n</tool_preambles>\n`;
                }
                if (reasoning.strategies.includes('chain_of_thought')) {
                    preview += `- Think step-by-step. Explain your logic clearly for each decision.\n`;
                }
                if (reasoning.strategies.includes('planning_enforcement')) {
                    preview += `- Remember, you are an agent. Keep going until the user's query is completely resolved.\n- Do not stop after completing only part of the request.\n- Only terminate your turn when you are sure that the problem is solved.\n`;
                }
            }
            preview += `\n`;
        }

        preview += `Instructions:\n${prompt}`;

        Object.keys(variables).forEach((key) => {
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`{{${escapedKey}}}`, 'g');
            preview = preview.replace(regex, variables[key] || `{{${key}}}`);
        });
        return preview;
    };

    const handleCopy = () => {
        const text = getPreviewText();
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const handleExport = () => {
        const text = getPreviewText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="preview-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2>Preview</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleCopy} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>Copy</button>
                    <button onClick={handleExport} style={{ fontSize: '0.9rem', padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)' }}>Export</button>
                </div>
            </div>
            <div className="preview-content" style={{
                flex: 1,
                backgroundColor: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: '6px',
                whiteSpace: 'pre-wrap',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--text-primary)'
            }}>
                {getPreviewText() || <span style={{ color: 'var(--text-secondary)' }}>Preview will appear here...</span>}
            </div>
        </div>
    );
};

export default PreviewPane;
