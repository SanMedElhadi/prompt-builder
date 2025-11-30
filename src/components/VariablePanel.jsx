import React from 'react';

const VariablePanel = ({ variables, onChange }) => {
    const handleChange = (key, value) => {
        onChange(key, value);
    };

    const variableKeys = Object.keys(variables);

    return (
        <div className="variable-panel">
            <h2>Variables</h2>
            {variableKeys.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No variables detected.</p>
            ) : (
                <div className="variable-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {variableKeys.map((key) => (
                        <div key={key} className="variable-item">
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{key}</label>
                            <input
                                type="text"
                                value={variables[key] || ''}
                                onChange={(e) => handleChange(key, e.target.value)}
                                placeholder={`Value for ${key}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VariablePanel;
