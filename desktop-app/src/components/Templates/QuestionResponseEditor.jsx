// src/components/Templates/QuestionResponseEditor.jsx
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './QuestionResponseEditor.css';

const QuestionResponseEditor = ({ template, onSave, onCancel }) => {
  const [jobTitle, setJobTitle] = useState(template?.jobTitle || '');
  const [category, setCategory] = useState(template?.category || 'General');
  const [questions, setQuestions] = useState(template?.questions || []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        questionPattern: '',
        keywords: [],
        response: '',
        variations: [],
        type: 'textarea'
      }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      jobTitle,
      category,
      questions: questions.filter(q => q.questionPattern && q.response)
    });
  };

  const canSave = jobTitle && questions.some(q => q.questionPattern && q.response);

  return (
    <div className="question-editor">
      <div className="editor-header">
        <h1>{template ? 'Edit Template' : 'Create New Template'}</h1>
      </div>

      <div className="editor-content">
        <div className="form-section">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
            >
              <option value="General">General</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Product">Product</option>
              <option value="Data">Data</option>
            </select>
          </div>
        </div>

        <div className="questions-section">
          <div className="section-header">
            <h2>Questions & Responses</h2>
            <button className="btn-secondary" onClick={addQuestion}>
              <Plus size={18} />
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="empty-questions">
              <p>No questions yet. Click "Add Question" to get started.</p>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <h3>Question {index + 1}</h3>
                    <button
                      className="icon-btn danger"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Question Pattern *</label>
                    <input
                      type="text"
                      placeholder="e.g., Why do you want to work here?"
                      value={question.questionPattern}
                      onChange={(e) => updateQuestion(index, 'questionPattern', e.target.value)}
                      className="form-input"
                    />
                    <small>This helps match similar questions in application forms</small>
                  </div>

                  <div className="form-group">
                    <label>Keywords (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., motivation, interest, why company"
                      value={question.keywords.join(', ')}
                      onChange={(e) => updateQuestion(index, 'keywords', 
                        e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                      )}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Response *</label>
                    <textarea
                      placeholder="Write your response here..."
                      value={question.response}
                      onChange={(e) => updateQuestion(index, 'response', e.target.value)}
                      className="form-textarea"
                      rows={6}
                    />
                    <div className="char-count">
                      {question.response.length} characters
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="editor-actions">
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={!canSave}
        >
          Save Template
        </button>
      </div>
    </div>
  );
};

export default QuestionResponseEditor;
