import React, { useState } from 'react';

const DEFAULT_TOPICS = [
    {
        id: 'topic_presentation_design',
        title: 'Presentation Design',
        description: 'Guidelines for creating visually appealing and effective slides.',
        scope: 'Applies to all slide deck generation tasks.',
        instructions: [
            'Keep text minimal (max 6 bullets per slide).',
            'Use high-contrast colors.',
            'Ensure fonts are legible (min 24pt).',
            'Include visual descriptions for every slide.'
        ],
        actions: ['GenerateImage', 'FormatSlide']
    },
    {
        id: 'topic_academic_research',
        title: 'Academic Research',
        description: 'Standards for conducting and citing academic research.',
        scope: 'Applies to research summaries and literature reviews.',
        instructions: [
            'Prioritize peer-reviewed sources.',
            'Use neutral, objective tone.',
            'Cite all claims using APA format.',
            'Distinguish between consensus and minority views.'
        ],
        actions: ['SearchScholar', 'CiteSource']
    },
    {
        id: 'topic_pedagogy',
        title: 'Pedagogy',
        description: 'Instructional strategies for effective teaching.',
        scope: 'Applies to tutoring and educational content.',
        instructions: [
            'Use the Socratic method (ask questions).',
            'Scaffold learning from simple to complex.',
            'Provide positive reinforcement.',
            'Check for understanding frequently.'
        ],
        actions: ['CreateQuiz', 'ExplainConcept']
    }
];

const TopicManager = ({ topics, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentTopic, setCurrentTopic] = useState({
        id: null,
        title: '',
        description: '',
        scope: '',
        instructions: [],
        actions: []
    });
    const [instructionInput, setInstructionInput] = useState('');
    const [actionInput, setActionInput] = useState('');

    const resetForm = () => {
        setCurrentTopic({
            id: null,
            title: '',
            description: '',
            scope: '',
            instructions: [],
            actions: []
        });
        setInstructionInput('');
        setActionInput('');
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!currentTopic.title.trim()) return;

        const newTopic = {
            ...currentTopic,
            id: currentTopic.id || Date.now(),
            title: currentTopic.title.trim()
        };

        if (currentTopic.id) {
            // Edit existing
            onChange(topics.map(t => t.id === currentTopic.id ? newTopic : t));
        } else {
            // Create new
            onChange([...topics, newTopic]);
        }
        resetForm();
    };

    const loadDefaults = () => {
        // Merge defaults, avoiding duplicates by title
        const existingTitles = new Set(topics.map(t => typeof t === 'string' ? t : t.title));
        const newDefaults = DEFAULT_TOPICS.filter(t => !existingTitles.has(t.title));

        if (newDefaults.length === 0) {
            alert('All standard topics are already loaded.');
            return;
        }

        onChange([...topics, ...newDefaults]);
        alert(`Loaded ${newDefaults.length} new standard topics.`);
    };

    const handleEdit = (topic) => {
        // Handle migration from old string topics
        if (typeof topic === 'string') {
            setCurrentTopic({
                id: Date.now(), // Assign ID for migration
                title: topic,
                description: '',
                scope: '',
                instructions: [],
                actions: []
            });
        } else {
            setCurrentTopic(topic);
        }
        setIsEditing(true);
    };

    const handleRemove = (id) => {
        onChange(topics.filter(t => (typeof t === 'string' ? t !== id : t.id !== id)));
    };

    const addInstruction = () => {
        if (instructionInput.trim()) {
            setCurrentTopic(prev => ({
                ...prev,
                instructions: [...prev.instructions, instructionInput.trim()]
            }));
            setInstructionInput('');
        }
    };

    const removeInstruction = (index) => {
        setCurrentTopic(prev => ({
            ...prev,
            instructions: prev.instructions.filter((_, i) => i !== index)
        }));
    };

    const addAction = () => {
        if (actionInput.trim()) {
            setCurrentTopic(prev => ({
                ...prev,
                actions: [...prev.actions, actionInput.trim()]
            }));
            setActionInput('');
        }
    };

    const removeAction = (index) => {
        setCurrentTopic(prev => ({
            ...prev,
            actions: prev.actions.filter((_, i) => i !== index)
        }));
    };

    const handleToggleSelection = (id) => {
        onChange(topics.map(t => {
            const tId = typeof t === 'string' ? t : t.id;
            if (tId === id) {
                if (typeof t === 'string') {
                    // Convert legacy string to object if toggled
                    return {
                        id: t,
                        title: t,
                        description: '',
                        scope: '',
                        instructions: [],
                        actions: [],
                        selected: false
                    };
                }
                return { ...t, selected: !t.selected };
            }
            return t;
        }));
    };

    return (
        <div className="topic-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Topics</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {!isEditing && (
                        <>
                            <button
                                onClick={loadDefaults}
                                style={{ padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Load Defaults
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                + New Topic
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="topic-editor" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>{currentTopic.id ? 'Edit Topic' : 'Create Topic'}</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Title</label>
                        <input
                            value={currentTopic.title}
                            onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                            placeholder="e.g. Customer Returns"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Description</label>
                        <textarea
                            value={currentTopic.description}
                            onChange={(e) => setCurrentTopic({ ...currentTopic, description: e.target.value })}
                            placeholder="What is this topic about?"
                            style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Scope (Guardrails)</label>
                        <textarea
                            value={currentTopic.scope}
                            onChange={(e) => setCurrentTopic({ ...currentTopic, scope: e.target.value })}
                            placeholder="When does this apply? What is out of scope?"
                            style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Instructions</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                value={instructionInput}
                                onChange={(e) => setInstructionInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addInstruction()}
                                placeholder="Add an instruction..."
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                            />
                            <button onClick={addInstruction} style={{ padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                        </div>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {currentTopic.instructions.map((inst, i) => (
                                <li key={i} style={{ marginBottom: '5px' }}>
                                    {inst} <span onClick={() => removeInstruction(i)} style={{ cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: '10px' }}>×</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Actions</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                value={actionInput}
                                onChange={(e) => setActionInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addAction()}
                                placeholder="Add an action (e.g. IssueRefund)..."
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                            />
                            <button onClick={addAction} style={{ padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {currentTopic.actions.map((act, i) => (
                                <span key={i} style={{ background: 'var(--bg-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                                    {act} <span onClick={() => removeAction(i)} style={{ cursor: 'pointer', marginLeft: '5px' }}>×</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={resetForm} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Topic</button>
                    </div>
                </div>
            ) : (
                <div className="topic-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {topics.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No topics defined.</p>}
                    {topics.map((topic, index) => {
                        const isLegacy = typeof topic === 'string';
                        const title = isLegacy ? topic : topic.title;
                        const desc = isLegacy ? '' : topic.description;
                        const id = isLegacy ? topic : topic.id;
                        const isSelected = isLegacy ? true : (topic.selected !== false); // Default to true

                        return (
                            <div key={index} style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                padding: '15px',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: isSelected ? 1 : 0.6
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleSelection(id)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{title}</div>
                                        {desc && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{desc}</div>}
                                        {!isLegacy && (
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                <span>{topic.instructions.length} Instructions</span>
                                                <span>•</span>
                                                <span>{topic.actions.length} Actions</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(topic)}
                                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleRemove(id)}
                                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TopicManager;
