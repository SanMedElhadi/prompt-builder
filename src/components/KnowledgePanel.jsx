import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const KnowledgePanel = ({ knowledge, onChange, ragSettings, onRagSettingsChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [mode, setMode] = useState('upload'); // 'upload' or 'manual'
    const [manualText, setManualText] = useState('');
    const [manualName, setManualName] = useState('');

    const handleManualAdd = () => {
        if (manualName.trim() && manualText.trim()) {
            onChange([...knowledge, {
                id: Date.now(),
                name: manualName.trim(),
                type: 'Manual Entry',
                content: manualText
            }]);
            setManualName('');
            setManualText('');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            let content = '';
            let type = 'File';

            if (file.type === 'application/json') {
                type = 'JSON';
                const text = await file.text();
                // Validate JSON
                JSON.parse(text);
                content = text;
            } else if (file.type === 'application/pdf') {
                type = 'PDF';
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                content = fullText;
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                type = 'DOCX';
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                content = result.value;
            } else {
                alert('Unsupported file type');
                setIsUploading(false);
                return;
            }

            onChange([...knowledge, {
                id: Date.now(),
                name: file.name,
                type: type,
                content: content
            }]);

        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Failed to parse file: ' + error.message);
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleRemove = (id) => {
        onChange(knowledge.filter(k => k.id !== id));
    };

    return (
        <div className="knowledge-panel">
            <h2>Knowledge Base</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Add knowledge sources (JSON, PDF, DOCX) or manual text for RAG.
            </p>

            <div className="mode-switch" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button
                    onClick={() => setMode('upload')}
                    style={{
                        flex: 1,
                        padding: '8px',
                        background: mode === 'upload' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    Upload File
                </button>
                <button
                    onClick={() => setMode('manual')}
                    style={{
                        flex: 1,
                        padding: '8px',
                        background: mode === 'manual' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    Manual Entry
                </button>
            </div>

            {mode === 'upload' ? (
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor="file-upload"
                        style={{
                            display: 'block',
                            padding: '12px',
                            backgroundColor: 'var(--input-bg)',
                            border: '1px dashed var(--border-color)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isUploading ? 'Processing...' : 'Click to Upload (JSON, PDF, DOCX)'}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".json,.pdf,.docx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        disabled={isUploading}
                    />
                </div>
            ) : (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder="Source Name (e.g. My Notes)"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                    <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Paste or type knowledge content here..."
                        style={{ height: '100px', resize: 'vertical', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                    <button onClick={handleManualAdd} style={{ padding: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Manual Source</button>
                </div>
            )}

            <div className="knowledge-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {knowledge.map((item) => (
                    <div key={item.id} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '12px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {item.type} • {item.content ? `${item.content.length} chars` : 'No content'}
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(item.id)}
                            style={{
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                padding: '4px',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {ragSettings && (
                <div className="rag-settings" style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                    <h3>Retrieval Settings (RAG)</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', fontSize: '0.9rem' }}>
                        Configure how the agent retrieves information from your knowledge base.
                    </p>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={ragSettings.enabled}
                                onChange={(e) => onRagSettingsChange({ ...ragSettings, enabled: e.target.checked })}
                            />
                            <span>Enable RAG (Smart Retrieval)</span>
                        </label>
                    </div>

                    {ragSettings.enabled && (
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Top K (Chunks)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={ragSettings.topK}
                                    onChange={(e) => onRagSettingsChange({ ...ragSettings, topK: parseInt(e.target.value) || 1 })}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Chunk Size (Chars)</label>
                                <input
                                    type="number"
                                    min="100"
                                    max="2000"
                                    step="100"
                                    value={ragSettings.chunkSize}
                                    onChange={(e) => onRagSettingsChange({ ...ragSettings, chunkSize: parseInt(e.target.value) || 100 })}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KnowledgePanel;
