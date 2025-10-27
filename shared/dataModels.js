// shared/dataModels.js
// Shared data models between desktop app and extension

export const ProjectSchema = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  fields: [],
  fieldMappings: {},
  filePath: null,
  applications: []
};

export const ApplicationSchema = {
  id: '',
  data: {},
  capturedAt: '',
  source: ''
};

export const TemplateSchema = {
  id: '',
  jobTitle: '',
  category: '',
  createdAt: '',
  updatedAt: '',
  questions: []
};

export const QuestionSchema = {
  id: '',
  questionPattern: '',
  keywords: [],
  response: '',
  variations: [],
  type: 'textarea',
  maxLength: null,
  tags: []
};

// Message protocol for extension <-> desktop communication
export const MessageTypes = {
  // Extension -> Desktop
  REQUEST_TEMPLATES: 'REQUEST_TEMPLATES',
  SAVE_APPLICATION: 'SAVE_APPLICATION',
  FORM_DETECTED: 'FORM_DETECTED',
  JOB_CAPTURED: 'JOB_CAPTURED',
  
  // Desktop -> Extension
  TEMPLATES_RESPONSE: 'TEMPLATES_RESPONSE',
  FILL_FORM: 'FILL_FORM',
  CAPTURE_ENABLED: 'CAPTURE_ENABLED',
  CONNECTION_STATUS: 'CONNECTION_STATUS'
};

export const StandardFields = {
  company: 'Company Name',
  position: 'Job Position',
  date: 'Date Applied',
  status: 'Application Status',
  url: 'Job URL',
  location: 'Location',
  salary: 'Salary',
  contact: 'Contact Person',
  notes: 'Notes'
};