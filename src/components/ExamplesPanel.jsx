import React, { useState } from 'react';

const ExamplesPanel = ({ examples, onChange }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleAdd = () => {
        if (input.trim() && output.trim()) {
            onChange([...examples, { id: Date.now(), input: input.trim(), output: output.trim() }]);
            setInput('');
            setOutput('');
        }
    };

    const handleRemove = (id) => {
        onChange(examples.filter(e => e.id !== id));
    };

    return (
        <div className="examples-panel">
            <h2>Few-Shot Examples</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Provide examples of Input/Output pairs to guide the agent's behavior.
            </p>

            <div className="add-example" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>User Input (Example)</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. 'Hello, who are you?'"
                        style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Model Output (Ideal Response)</label>
                    <textarea
                        value={output}
                        onChange={(e) => setOutput(e.target.value)}
                        placeholder="e.g. 'I am your helpful AI assistant.'"
                        style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    style={{ padding: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Add Example
                </button>
            </div>

            <div className="examples-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {examples.map((ex, i) => (
                    <div key={ex.id} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => handleRemove(ex.id)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                border: 'none',
                                fontSize: '1.2rem',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                        <div style={{ marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Input:</strong>
                            <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginTop: '4px' }}>{ex.input}</div>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Output:</strong>
                            <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginTop: '4px' }}>{ex.output}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamplesPanel;
