// electron/utils/ipcChannels.js
module.exports = {
  // Project channels
  CREATE_PROJECT: 'create-project',
  GET_PROJECTS: 'get-projects',
  UPDATE_PROJECT: 'update-project',
  DELETE_PROJECT: 'delete-project',

  // Excel channels
  IMPORT_EXCEL: 'import-excel',
  EXPORT_EXCEL: 'export-excel',
  DETECT_FIELDS: 'detect-fields',

  // Application channels
  ADD_APPLICATION: 'add-application',
  UPDATE_APPLICATION: 'update-application',
  DELETE_APPLICATION: 'delete-application',

  // Template channels
  CREATE_TEMPLATE: 'create-template',
  GET_TEMPLATES: 'get-templates',
  GET_TEMPLATE_BY_JOB_TITLE: 'get-template-by-job-title',
  UPDATE_TEMPLATE: 'update-template',
  DELETE_TEMPLATE: 'delete-template',

  // Widget channels
  TOGGLE_WIDGET: 'toggle-widget',
  CAPTURE_PAGE: 'capture-page',
  PAGE_CAPTURED: 'page-captured'
};