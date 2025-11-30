import React from 'react';

const Tabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderRadius: 0,
                        transition: 'all 0.2s'
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
