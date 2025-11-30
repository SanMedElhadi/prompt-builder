import React from 'react';

const PromptEditor = ({ prompt, onChange }) => {
    return (
        <div className="prompt-editor" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2>Prompt Editor</h2>
            <textarea
                value={prompt}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your prompt here. Use {{variable}} to define variables."
                spellCheck={false}
                style={{ flex: 1, resize: 'none', fontSize: '1.1rem', lineHeight: '1.6' }}
            />
        </div>
    );
};

export default PromptEditor;
