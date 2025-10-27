// electron/services/excelService.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs').promises;

class ExcelService {
  
  async importExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (data.length === 0) {
        throw new Error('Excel file is empty');
      }
      
      const headers = data[0];
      const rows = data.slice(1);
      
      return {
        headers,
        rows,
        rowCount: rows.length,
        filePath
      };
    } catch (error) {
      throw new Error(`Failed to import Excel: ${error.message}`);
    }
  }

  async detectFields(filePath) {
    const { headers } = await this.importExcel(filePath);
    
    // Standard field patterns
    const patterns = {
      company: ['company', 'organization', 'employer', 'company name'],
      position: ['position', 'title', 'role', 'job title', 'job'],
      date: ['date', 'applied', 'application date', 'date applied'],
      status: ['status', 'stage', 'application status'],
      url: ['url', 'link', 'job url', 'posting', 'job link'],
      location: ['location', 'city', 'place', 'where'],
      salary: ['salary', 'compensation', 'pay', 'wage'],
      contact: ['contact', 'recruiter', 'hr', 'email'],
      notes: ['notes', 'comments', 'description']
    };
    
    const detectedMappings = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      
      for (const [standardField, keywords] of Object.entries(patterns)) {
        if (keywords.some(keyword => normalizedHeader.includes(keyword))) {
          detectedMappings[standardField] = header;
          break;
        }
      }
    });
    
    return {
      headers,
      suggestedMappings: detectedMappings,
      unmappedHeaders: headers.filter(h => 
        !Object.values(detectedMappings).includes(h)
      )
    };
  }

  async exportExcel(projectId, filePath) {
    const storageService = require('./storageService');
    const project = await storageService.getProjectById(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Prepare data for export
    const headers = project.fields;
    const rows = project.applications.map(app => {
      return headers.map(header => {
        const mapping = Object.keys(project.fieldMappings).find(
          key => project.fieldMappings[key] === header
        );
        return mapping ? app.data[mapping] : app.data[header] || '';
      });
    });
    
    const worksheetData = [headers, ...rows];
    
    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    // Write file
    XLSX.writeFile(workbook, filePath);
    
    return { success: true, filePath };
  }

  async createExcelTemplate(fields, filePath) {
    const headers = [fields];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    XLSX.writeFile(workbook, filePath);
    
    return { success: true, filePath };
  }
}

module.exports = new ExcelService();