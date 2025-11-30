import React, { useState } from 'react';
import Tabs from './components/Tabs';
import AgentIdentity from './components/AgentIdentity';
import TopicManager from './components/TopicManager';
import KnowledgePanel from './components/KnowledgePanel';
import PreviewPane from './components/PreviewPane';
import VariablePanel from './components/VariablePanel';
import TemplateLibrary from './components/TemplateLibrary';
import ExamplesPanel from './components/ExamplesPanel';
import ReasoningPanel from './components/ReasoningPanel';
import './index.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [variables, setVariables] = useState({});
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [topics, setTopics] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [examples, setExamples] = useState([]);
  const [reasoning, setReasoning] = useState({ effort: 'medium', strategies: [] }); // Added reasoning state
  const [ragSettings, setRagSettings] = useState({ enabled: true, topK: 3, chunkSize: 500 }); // Added RAG settings
  const [activeTab, setActiveTab] = useState('identity');

  const handlePromptChange = (e) => {
    const newText = e.target.value;
    setPrompt(newText);

    // Extract variables: {{variableName}}
    const regex = /{{([^}]+)}}/g;
    const matches = [...newText.matchAll(regex)];
    const newVariables = {};

    matches.forEach(match => {
      const varName = match[1].trim();
      newVariables[varName] = variables[varName] || '';
    });

    setVariables(newVariables);
  };

  const handleVariableChange = (name, value) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoadTemplate = (template) => {
    // Handle both old string-only templates and new object templates
    if (typeof template === 'string') {
      setPrompt(template);
      // Trigger variable extraction
      const regex = /{{([^}]+)}}/g;
      const matches = [...template.matchAll(regex)];
      const newVariables = {};
      matches.forEach(match => {
        const varName = match[1].trim();
        newVariables[varName] = '';
      });
      setVariables(newVariables);
    } else {
      setPrompt(template.content);
      setRole(template.role || '');
      setGoal(template.goal || '');

      // Trigger variable extraction for the content
      const regex = /{{([^}]+)}}/g;
      const matches = [...template.content.matchAll(regex)];
      const newVariables = {};
      matches.forEach(match => {
        const varName = match[1].trim();
        newVariables[varName] = '';
      });
      setVariables(newVariables);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'identity':
        return <AgentIdentity role={role} setRole={setRole} goal={goal} setGoal={setGoal} instructions={prompt} onInstructionsChange={handlePromptChange} />;
      case 'topics':
        return <TopicManager topics={topics} onChange={setTopics} />;
      case 'knowledge':
        return <KnowledgePanel knowledge={knowledge} onChange={setKnowledge} ragSettings={ragSettings} onRagSettingsChange={setRagSettings} />; // Passed RAG props
      case 'examples':
        return <ExamplesPanel examples={examples} onChange={setExamples} />;
      case 'reasoning': // Added Reasoning tab content
        return <ReasoningPanel reasoning={reasoning} onChange={setReasoning} />;
      case 'preview':
        return <PreviewPane prompt={prompt} variables={variables} role={role} goal={goal} topics={topics} knowledge={knowledge} examples={examples} reasoning={reasoning} ragSettings={ragSettings} />; // Passed RAG props
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="./logo.png" alt="Logo" style={{ height: '32px', marginRight: '10px' }} />
        <h1>Prompt Builder</h1>
      </header>

      <main className="main-content">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'identity', label: 'Agent Identity' },
            { id: 'topics', label: 'Topics' },
            { id: 'knowledge', label: 'Knowledge' },
            { id: 'examples', label: 'Examples' },
            { id: 'reasoning', label: 'Reasoning' }, // Added Reasoning tab
            { id: 'preview', label: 'Preview & Test' }
          ]}
        />
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </main>

      <aside className="sidebar">
        <VariablePanel variables={variables} onChange={handleVariableChange} />
        <TemplateLibrary currentPrompt={prompt} onLoad={handleLoadTemplate} />
      </aside>
    </div>
  );
}

export default App;
