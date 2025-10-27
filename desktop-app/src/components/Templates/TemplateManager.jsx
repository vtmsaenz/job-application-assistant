// src/components/Templates/TemplateManager.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import QuestionResponseEditor from './QuestionResponseEditor';
import './TemplateManager.css';

const TemplateManager = () => {
  const { templates, createTemplate, deleteTemplate } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTemplate(null);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setIsCreating(false);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(templateId);
    }
  };

  const handleSave = async (templateData) => {
    await createTemplate(templateData);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTemplate(null);
  };

  if (isCreating || editingTemplate) {
    return (
      <QuestionResponseEditor
        template={editingTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="template-manager">
      <div className="manager-header">
        <h1>Response Templates</h1>
        <button className="btn-primary" onClick={handleCreateNew}>
          <Plus size={18} />
          New Template
        </button>
      </div>

      <p className="manager-description">
        Create reusable response templates for common job application questions.
        Save time by auto-filling your applications with pre-written answers.
      </p>

      {templates.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No templates yet</h3>
          <p>Create your first template to start saving time on applications!</p>
          <button className="btn-primary" onClick={handleCreateNew}>
            Create Template
          </button>
        </div>
      ) : (
        <div className="templates-grid">
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEdit(template)}
              onDelete={() => handleDelete(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TemplateCard = ({ template, onEdit, onDelete }) => (
  <div className="template-card">
    <div className="template-header">
      <h3>{template.jobTitle}</h3>
      <div className="template-actions">
        <button className="icon-btn" onClick={onEdit}>
          <Edit size={16} />
        </button>
        <button className="icon-btn danger" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="template-meta">
      <span className="category-badge">{template.category}</span>
      <span className="question-count">{template.questions.length} questions</span>
    </div>
    <div className="template-preview">
      {template.questions.slice(0, 2).map((q, i) => (
        <p key={i} className="question-preview">{q.questionPattern}</p>
      ))}
      {template.questions.length > 2 && (
        <p className="more-questions">+{template.questions.length - 2} more</p>
      )}
    </div>
  </div>
);

export default TemplateManager;