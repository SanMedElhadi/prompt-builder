import React, { useState } from 'react';

const TopicManager = ({ topics, onChange }) => {
    const [input, setInput] = useState('');

    const handleAdd = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            if (!topics.includes(input.trim())) {
                onChange([...topics, input.trim()]);
            }
            setInput('');
        }
    };

    const handleRemove = (topicToRemove) => {
        onChange(topics.filter(t => t !== topicToRemove));
    };

    return (
        <div className="topic-manager">
            <h2>Topics</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Define the topics this agent is authorized to handle.
            </p>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleAdd}
                placeholder="Type a topic and press Enter..."
                style={{ marginBottom: '20px' }}
            />

            <div className="topic-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {topics.map((topic) => (
                    <span key={topic} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--accent-secondary)',
                        color: 'var(--text-primary)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        {topic}
                        <button
                            onClick={() => handleRemove(topic)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                padding: 0,
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TopicManager;
