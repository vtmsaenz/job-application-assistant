// browser-extension/content/contentScript.js
// Injected into every webpage

console.log('Job Application Assistant - Content Script Loaded');

let detectedForms = [];
let currentTemplates = null;

// Detect application forms on page load
window.addEventListener('load', () => {
  detectApplicationForms();
});

// Detect job application forms
function detectApplicationForms() {
  const forms = document.querySelectorAll('form');
  detectedForms = [];
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const questions = extractQuestionsFromForm(form);
    
    if (questions.length > 0) {
      detectedForms.push({
        form: form,
        questions: questions,
        isJobApplication: isJobApplicationForm(form)
      });
    }
  });
  
  if (detectedForms.length > 0) {
    console.log(`Detected ${detectedForms.length} forms with questions`);
    showAutoFillPrompt();
  }
}

// Extract questions from form
function extractQuestionsFromForm(form) {
  const questions = [];
  const inputs = form.querySelectorAll('input[type="text"], textarea');
  
  inputs.forEach(input => {
    const label = findLabelForInput(input);
    if (label && label.length > 10) { // Filter out short labels
      questions.push({
        element: input,
        question: label,
        type: input.tagName.toLowerCase(),
        required: input.hasAttribute('required')
      });
    }
  });
  
  return questions;
}

// Find label for input field
function findLabelForInput(input) {
  // Try to find associated label
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent.trim();
  }
  
  // Look for parent label
  const parentLabel = input.closest('label');
  if (parentLabel) {
    return parentLabel.textContent.trim();
  }
  
  // Look for nearby text
  const prev = input.previousElementSibling;
  if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'P' || prev.tagName === 'DIV')) {
    return prev.textContent.trim();
  }
  
  // Check placeholder
  if (input.placeholder) {
    return input.placeholder;
  }
  
  return null;
}

// Check if form is likely a job application
function isJobApplicationForm(form) {
  const formText = form.textContent.toLowerCase();
  const keywords = ['apply', 'application', 'resume', 'cv', 'cover letter', 'experience', 'why you', 'tell us about'];
  return keywords.some(keyword => formText.includes(keyword));
}

// Show auto-fill prompt
function showAutoFillPrompt() {
  const existingPrompt = document.getElementById('job-tracker-prompt');
  if (existingPrompt) return;
  
  const prompt = document.createElement('div');
  prompt.id = 'job-tracker-prompt';
  prompt.innerHTML = `
    <div class="jt-prompt-container">
      <div class="jt-prompt-header">
        <strong>Job Application Assistant</strong>
        <button class="jt-close-btn" id="jt-close-prompt">✕</button>
      </div>
      <p>We detected a job application form. Would you like to auto-fill?</p>
      <div class="jt-prompt-actions">
        <button class="jt-btn jt-btn-secondary" id="jt-capture-btn">Capture Job</button>
        <button class="jt-btn jt-btn-primary" id="jt-autofill-btn">Auto-Fill</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(prompt);
  
  // Add event listeners
  document.getElementById('jt-close-prompt').addEventListener('click', () => {
    prompt.remove();
  });
  
  document.getElementById('jt-capture-btn').addEventListener('click', () => {
    captureCurrentJob();
    prompt.remove();
  });
  
  document.getElementById('jt-autofill-btn').addEventListener('click', () => {
    showTemplateSelector();
    prompt.remove();
  });
}

// Capture current job posting
function captureCurrentJob() {
  const jobData = extractJobData();
  
  chrome.runtime.sendMessage({
    action: 'captureJob',
    data: jobData
  }, response => {
    if (response.success) {
      showNotification('Job captured successfully!', 'success');
    }
  });
}

// Extract job data from page
function extractJobData() {
  const data = {};
  
  // Try to find job title
  const h1 = document.querySelector('h1');
  if (h1) data.title = h1.textContent.trim();
  
  // Try to find company name
  const companySelectors = [
    '[class*="company"]',
    '[data-company]',
    'meta[property="og:site_name"]'
  ];
  
  for (const selector of companySelectors) {
    const element = document.querySelector(selector);
    if (element) {
      data.company = element.textContent || element.getAttribute('content');
      break;
    }
  }
  
  // Extract other info
  data.location = extractLocation();
  data.description = extractDescription();
  
  return data;
}

// Show template selector
function showTemplateSelector() {
  const modal = document.createElement('div');
  modal.id = 'jt-template-modal';
  modal.innerHTML = `
    <div class="jt-modal-overlay">
      <div class="jt-modal-content">
        <div class="jt-modal-header">
          <h3>Select Job Title Template</h3>
          <button class="jt-close-btn" id="jt-close-modal">✕</button>
        </div>
        <div class="jt-modal-body">
          <select id="jt-job-title-select" class="jt-select">
            <option value="">Loading templates...</option>
          </select>
          <div id="jt-preview" class="jt-preview"></div>
        </div>
        <div class="jt-modal-footer">
          <button class="jt-btn jt-btn-secondary" id="jt-cancel-fill">Cancel</button>
          <button class="jt-btn jt-btn-primary" id="jt-confirm-fill">Fill Form</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Load templates
  loadTemplates();
  
  // Event listeners
  document.getElementById('jt-close-modal').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('jt-cancel-fill').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('jt-confirm-fill').addEventListener('click', () => {
    const jobTitle = document.getElementById('jt-job-title-select').value;
    if (jobTitle) {
      fillFormWithTemplate(jobTitle);
      modal.remove();
    }
  });
  
  document.getElementById('jt-job-title-select').addEventListener('change', (e) => {
    previewTemplate(e.target.value);
  });
}

// Load templates from storage
function loadTemplates() {
  chrome.storage.local.get(['templates'], (result) => {
    const templates = result.templates || [];
    const select = document.getElementById('jt-job-title-select');
    
    if (templates.length === 0) {
      select.innerHTML = '<option value="">No templates found. Create one in the app!</option>';
      return;
    }
    
    select.innerHTML = '<option value="">Select a job title...</option>';
    templates.forEach(template => {
      const option = document.createElement('option');
      option.value = template.id;
      option.textContent = template.jobTitle;
      select.appendChild(option);
    });
    
    currentTemplates = templates;
  });
}

// Preview template matches
function previewTemplate(templateId) {
  if (!templateId || !currentTemplates) return;
  
  const template = currentTemplates.find(t => t.id === templateId);
  if (!template) return;
  
  const preview = document.getElementById('jt-preview');
  const matches = matchQuestionsToTemplate(template);
  
  preview.innerHTML = `
    <h4>Matched Questions: ${matches.length}/${detectedForms[0].questions.length}</h4>
    <ul class="jt-matches-list">
      ${matches.map(match => `
        <li>
          <strong>${match.question}</strong>
          <span class="jt-confidence">${Math.round(match.confidence * 100)}% match</span>
        </li>
      `).join('')}
    </ul>
  `;
}

// Match questions to template
function matchQuestionsToTemplate(template) {
  const formQuestions = detectedForms[0].questions;
  const matches = [];
  
  formQuestions.forEach(formQ => {
    template.questions.forEach(templateQ => {
      const similarity = calculateSimilarity(
        formQ.question.toLowerCase(),
        templateQ.questionPattern.toLowerCase(),
        templateQ.keywords
      );
      
      if (similarity > 0.3) { // 30% threshold
        matches.push({
          question: formQ.question,
          answer: templateQ.response,
          element: formQ.element,
          confidence: similarity
        });
      }
    });
  });
  
  return matches;
}

// Calculate similarity between questions
function calculateSimilarity(question1, question2, keywords) {
  let score = 0;
  
  // Direct substring match
  if (question1.includes(question2) || question2.includes(question1)) {
    score += 0.5;
  }
  
  // Keyword matching
  if (keywords) {
    keywords.forEach(keyword => {
      if (question1.includes(keyword.toLowerCase())) {
        score += 0.2;
      }
    });
  }
  
  // Word overlap
  const words1 = question1.split(/\s+/);
  const words2 = question2.split(/\s+/);
  const commonWords = words1.filter(w => words2.includes(w) && w.length > 3);
  score += (commonWords.length / Math.max(words1.length, words2.length)) * 0.3;
  
  return Math.min(score, 1);
}

// Fill form with template
function fillFormWithTemplate(templateId) {
  if (!templateId || !currentTemplates) return;
  
  const template = currentTemplates.find(t => t.id === templateId);
  if (!template) return;
  
  const matches = matchQuestionsToTemplate(template);
  let filledCount = 0;
  
  matches.forEach(match => {
    if (match.confidence > 0.3) {
      match.element.value = match.answer;
      match.element.dispatchEvent(new Event('input', { bubbles: true }));
      match.element.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
    }
  });
  
  showNotification(`Filled ${filledCount} fields successfully!`, 'success');
}

// Utility: Extract location from page
function extractLocation() {
  const locationSelectors = [
    '[class*="location"]',
    '[data-location]',
    'meta[property="og:locality"]'
  ];
  
  for (const selector of locationSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.textContent || element.getAttribute('content');
    }
  }
  return null;
}

// Utility: Extract description
function extractDescription() {
  const descSelectors = [
    '[class*="description"]',
    '[class*="job-description"]',
    'meta[name="description"]'
  ];
  
  for (const selector of descSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent || element.getAttribute('content');
      return text.trim().substring(0, 500); // First 500 chars
    }
  }
  return null;
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `jt-notification jt-notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('jt-notification-show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('jt-notification-show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillFormWithTemplate(request.data.templateId);
    sendResponse({ success: true });
  }
});