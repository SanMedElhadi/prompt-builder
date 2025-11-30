import React from 'react';

const AgentIdentity = ({ role, setRole, goal, setGoal, instructions, onInstructionsChange }) => {
    return (
        <div className="agent-identity" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Role</label>
                <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Customer Support Specialist"
                    style={{ fontSize: '1rem' }}
                />
            </div>

            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Goal</label>
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Help users resolve their technical issues efficiently."
                    style={{ height: '80px', resize: 'none', fontSize: '1rem' }}
                />
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Instructions</label>
                <textarea
                    value={instructions}
                    onChange={onInstructionsChange}
                    placeholder="Detailed instructions for the agent... Use {{variables}} here."
                    style={{ flex: 1, resize: 'none', fontSize: '1rem', lineHeight: '1.6' }}
                />
            </div>
        </div>
    );
};

export default AgentIdentity;
