import React, { useState } from 'react';

const OutputStructurePanel = ({ outputFormat, onChange }) => {
    const handleFormatChange = (format) => {
        onChange({ ...outputFormat, type: format });
    };

    const handleCustomChange = (e) => {
        onChange({ ...outputFormat, customInstruction: e.target.value });
    };

    return (
        <div className="output-structure-panel">
            <h2>Output Structure</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Define how you want the AI to format its response.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['Free Text', 'JSON', 'XML', 'Markdown', 'Custom'].map(format => (
                    <button
                        key={format}
                        onClick={() => handleFormatChange(format)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: outputFormat.type === format ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            color: outputFormat.type === format ? 'white' : 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        {format}
                    </button>
                ))}
            </div>

            {outputFormat.type === 'JSON' && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>JSON Schema / Example</label>
                    <textarea
                        value={outputFormat.customInstruction}
                        onChange={handleCustomChange}
                        placeholder='{\n  "key": "value"\n}'
                        style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                    />
                </div>
            )}

            {outputFormat.type === 'XML' && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>XML Structure</label>
                    <textarea
                        value={outputFormat.customInstruction}
                        onChange={handleCustomChange}
                        placeholder='<root>\n  <item>value</item>\n</root>'
                        style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                    />
                </div>
            )}

            {outputFormat.type === 'Custom' && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Custom Instructions</label>
                    <textarea
                        value={outputFormat.customInstruction}
                        onChange={handleCustomChange}
                        placeholder="Describe the desired output format..."
                        style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                </div>
            )}

            <div style={{ padding: '15px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginTop: 0 }}>Preview Instruction</h4>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    {outputFormat.type === 'Free Text' && "No specific formatting instructions will be added."}
                    {outputFormat.type === 'Markdown' && "Please format the response using Markdown."}
                    {(outputFormat.type === 'JSON' || outputFormat.type === 'XML' || outputFormat.type === 'Custom') && (
                        outputFormat.customInstruction ?
                            `Please output the response in ${outputFormat.type} format following this structure:\n${outputFormat.customInstruction}` :
                            `Please output the response in ${outputFormat.type} format.`
                    )}
                </p>
            </div>
        </div>
    );
};

export default OutputStructurePanel;
