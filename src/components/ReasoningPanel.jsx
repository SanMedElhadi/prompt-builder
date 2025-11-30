import React from 'react';

const ReasoningPanel = ({ reasoning, onChange }) => {
    const handleEffortChange = (e) => {
        onChange({ ...reasoning, effort: e.target.value });
    };

    const handleStrategyChange = (strategy) => {
        const currentStrategies = reasoning.strategies || [];
        let newStrategies;
        if (currentStrategies.includes(strategy)) {
            newStrategies = currentStrategies.filter(s => s !== strategy);
        } else {
            newStrategies = [...currentStrategies, strategy];
        }
        onChange({ ...reasoning, strategies: newStrategies });
    };

    return (
        <div className="reasoning-panel">
            <h2>Reasoning Configuration</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Control the agent's cognitive process and strategic behavior.
            </p>

            <div className="form-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>Reasoning Effort</label>
                <select
                    value={reasoning.effort}
                    onChange={handleEffortChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                    }}
                >
                    <option value="low">Low (Minimal Reasoning - Faster)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Extensive Planning - Better for Complex Tasks)</option>
                </select>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {reasoning.effort === 'low' && "Injects instructions for brief, bullet-point reasoning. Best for latency-sensitive tasks."}
                    {reasoning.effort === 'medium' && "Standard reasoning behavior."}
                    {reasoning.effort === 'high' && "Injects instructions to plan extensively and decompose queries. Best for complex workflows."}
                </p>
            </div>

            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: 500 }}>Strategic Instructions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={reasoning.strategies.includes('tool_preamble')}
                            onChange={() => handleStrategyChange('tool_preamble')}
                            style={{ width: 'auto' }}
                        />
                        <span>
                            <strong>Tool Preamble</strong>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Force agent to narrate plans before acting (XML block).</span>
                        </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={reasoning.strategies.includes('chain_of_thought')}
                            onChange={() => handleStrategyChange('chain_of_thought')}
                            style={{ width: 'auto' }}
                        />
                        <span>
                            <strong>Chain of Thought</strong>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Explicitly ask to "Think step-by-step".</span>
                        </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={reasoning.strategies.includes('planning_enforcement')}
                            onChange={() => handleStrategyChange('planning_enforcement')}
                            style={{ width: 'auto' }}
                        />
                        <span>
                            <strong>Planning Enforcement</strong>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Strict instructions to decompose queries and ensure completion.</span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ReasoningPanel;
