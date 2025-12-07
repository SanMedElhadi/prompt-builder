import React, { useState, useEffect } from 'react';

const DEFAULT_TEMPLATES = [
    {
        name: 'Customer Support Agent',
        role: 'Customer Support Specialist',
        goal: 'Assist customers with empathy and efficiency to resolve their issues.',
        content: 'Customer Issue: {{issue}}\nCustomer Name: {{customer_name}}\n\nPlease provide a polite and helpful response to the customer.'
    },
    {
        name: 'Blog Post Generator',
        role: 'Professional Content Writer',
        goal: 'Write engaging, SEO-optimized blog posts.',
        content: 'Write a comprehensive blog post about {{topic}}.\n\nTarget Audience: {{audience}}\nKey Points to Cover:\n- {{point1}}\n- {{point2}}\n- {{point3}}\n\nThe tone should be {{tone}}.'
    },
    {
        name: 'Code Reviewer',
        role: 'Senior Software Engineer',
        goal: 'Ensure code quality, performance, and maintainability.',
        content: 'Review the following code snippet for bugs, performance issues, and best practices.\n\nLanguage: {{language}}\nCode:\n{{code_snippet}}\n\nProvide a detailed analysis and suggested improvements.'
    },
    {
        name: 'Data Extractor',
        role: 'Data Analyst',
        goal: 'Extract structured data from unstructured text accurately.',
        content: 'Extract the following fields from the text below and format the output as JSON.\n\nFields to Extract: {{fields}}\nText:\n{{text_content}}'
    },
    {
        name: 'CV Builder',
        role: 'Expert Career Coach',
        goal: 'Create professional, high-impact resumes that pass ATS systems.',
        content: 'Create a professional resume for the following candidate.\n\nName: {{name}}\nExperience: {{experience}}\nSkills: {{skills}}\nTarget Job: {{target_job}}\n\nFormat the output as a clean, modern resume.'
    },
    {
        name: 'CV Checker',
        role: 'Senior Recruiter',
        goal: 'Critique resumes and provide actionable feedback for improvement.',
        content: 'Analyze the following resume for the position of {{position}}.\n\nResume Text:\n{{resume_text}}\n\nProvide feedback on:\n1. Formatting\n2. Content Impact\n3. Keyword Optimization\n4. Overall Impression'
    },
    {
        name: 'Learning Assistant',
        role: 'Patient Tutor',
        goal: 'Explain complex concepts in simple, easy-to-understand terms.',
        content: 'Explain the concept of {{concept}} to a {{audience_level}}.\n\nUse analogies and examples to make it clear.\n\nSpecific questions to answer:\n- {{question1}}'
    },
    {
        name: 'Presentation Builder',
        role: 'Presentation Expert',
        goal: 'Create engaging, clear, and visually descriptive slide decks.',
        content: 'Create a slide deck outline for a presentation about {{topic}}.\n\nAudience: {{audience}}\nDuration: {{duration}}\n\nFor each slide, provide:\n1. Title\n2. Bullet points\n3. Visual description (image suggestion)'
    },
    {
        name: 'Socratic Tutor',
        role: 'Socratic Tutor',
        goal: 'Guide the student to the answer through questioning rather than direct explanation.',
        content: 'I am trying to learn about {{topic}}.\n\nInstead of explaining it to me directly, ask me a series of guiding questions to help me figure it out myself.\n\nStart with a simple question.'
    },
    {
        name: 'Research Assistant',
        role: 'Academic Researcher',
        goal: 'Synthesize information from multiple sources into a coherent summary.',
        content: 'Please research and summarize the key findings on {{research_topic}}.\n\nFocus on:\n- Recent developments\n- Major controversies\n- Consensus views\n\nProvide citations where possible.'
    }
];

const TemplateLibrary = ({ currentPrompt, onLoad }) => {
    const [templates, setTemplates] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const loadTemplates = async () => {
            if (window.__TAURI__) {
                const saved = await window.__TAURI__.invoke('get_templates');
                if (saved.length === 0) {
                    setTemplates(DEFAULT_TEMPLATES);
                    await window.__TAURI__.invoke('save_templates', { templates: DEFAULT_TEMPLATES });
                } else {
                    setTemplates(saved);
                }
            } else {
                // Fallback for browser-only dev
                const saved = JSON.parse(localStorage.getItem('templates') || '[]');
                if (saved.length === 0) {
                    setTemplates(DEFAULT_TEMPLATES);
                } else {
                    setTemplates(saved);
                }
            }
        };
        loadTemplates();
    }, []);

    const saveTemplate = async () => {
        if (!name) return;
        const newTemplate = {
            name,
            content: currentPrompt,
            role: '',
            goal: ''
        };
        const updated = [...templates, newTemplate];
        setTemplates(updated);

        if (window.__TAURI__) {
            await window.__TAURI__.invoke('save_templates', { templates: updated });
        } else {
            localStorage.setItem('templates', JSON.stringify(updated));
        }
        setName('');
    };

    const loadDefaults = async () => {
        // Merge defaults, avoiding duplicates by name
        const existingNames = new Set(templates.map(t => t.name));
        const newDefaults = DEFAULT_TEMPLATES.filter(t => !existingNames.has(t.name));

        if (newDefaults.length === 0) {
            alert('All default templates are already loaded.');
            return;
        }

        const updated = [...templates, ...newDefaults];
        setTemplates(updated);

        if (window.__TAURI__) {
            await window.__TAURI__.invoke('save_templates', { templates: updated });
        } else {
            localStorage.setItem('templates', JSON.stringify(updated));
        }
        alert(`Loaded ${newDefaults.length} new default templates.`);
    };

    const loadTemplate = (template) => {
        onLoad(template);
    };

    const deleteTemplate = async (index) => {
        const updated = templates.filter((_, i) => i !== index);
        setTemplates(updated);

        if (window.__TAURI__) {
            await window.__TAURI__.invoke('save_templates', { templates: updated });
        } else {
            localStorage.setItem('templates', JSON.stringify(updated));
        }
    };

    return (
        <div className="template-library" style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>Templates</h3>
                <button onClick={loadDefaults} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>Load Defaults</button>
            </div>
            <div className="save-controls" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Template Name"
                    style={{ flex: 1 }}
                />
                <button onClick={saveTemplate}>Save</button>
            </div>
            <ul className="template-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {templates.map((t, i) => (
                    <li key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: 'var(--input-bg)',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        <span onClick={() => loadTemplate(t)} style={{ flex: 1 }}>{t.name}</span>
                        <button
                            className="delete-btn"
                            onClick={(e) => { e.stopPropagation(); deleteTemplate(i); }}
                            style={{
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                padding: '2px 6px',
                                fontSize: '1.2rem'
                            }}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TemplateLibrary;
