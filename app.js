// ===== CONFIGURATION =====
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbx3_vhRhPCBdHWT2tsdjRqEe_9rpPJSIn77ste6RE25utO9VAYeserJEy4V21w7_XQP/exec",
  FEEDBACK_EMAIL: "job.ramirez@qmmcmx.com", // Change this to your email
  STORAGE_KEYS: {
    DESCRIPTIONS: 'problemTracking_descriptions',
    ACTIONS: 'problemTracking_actions',
    TEMPLATES: 'problemTracking_templates',
    PREFERENCES: 'problemTracking_preferences',
    FEEDBACK: 'problemTracking_feedback'
  },
  MAX_SAVED_ITEMS: 50,
  MAX_TEMPLATES: 8
};

// ===== FILE UPLOAD STATE =====
let selectedFiles = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Auto-fill functions
  autoSelectWeek();
  autoDetectShift();
  autoFillDateDetection();
  autoFillDateFinished();
  
  // Setup listeners
  setupShiftListener();
  setupFileUpload();
  setupCollapsible();
  setupProgressTracking();
  setupHelpModal();
  setupFeedback();
  
  // Load saved data
  loadSavedDescriptions();
  loadSavedCorrectiveActions();
  loadSavedPreferences();
  loadAndRenderTemplates();
  
  // Load duration options
  loadIssueDurationOptions();
});

// ===== AUTO-FILL FUNCTIONS =====

function getCurrentWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

function autoSelectWeek() {
  const weekNum = getCurrentWeekNumber();
  const weekSelect = document.querySelector('select[name="week"]');
  
  if (weekNum >= 1 && weekNum <= 16) {
    const optionValue = `Week ${weekNum}`;
    for (let option of weekSelect.options) {
      if (option.text === optionValue) {
        option.selected = true;
        break;
      }
    }
  }
}

function autoDetectShift() {
  const hour = new Date().getHours();
  const shiftInput = document.querySelector('input[name="shift"]');
  
  // Day shift: 7:00 - 15:00
  // Middle shift: 15:00 - 23:00
  // Night shift: 23:00 - 7:00
  if (hour >= 7 && hour < 15) {
    shiftInput.value = "Day shift";
  } else if (hour >= 15 && hour < 23) {
    shiftInput.value = "Middle shift";
  } else {
    shiftInput.value = "Night shift";
  }
}

function autoFillDateDetection() {
  const dateInput = document.querySelector('input[name="date_detection"]');
  dateInput.value = new Date().toISOString().split('T')[0];
}

function autoFillDateFinished() {
  const dateInput = document.querySelector('input[name="date_finished"]');
  dateInput.value = new Date().toISOString().split('T')[0];
}

// ===== ISSUE DURATION OPTIONS =====

function loadIssueDurationOptions() {
  const datalist = document.getElementById('issue_times');
  datalist.innerHTML = '';
  
  const durations = [
    '5 min',
    '10 min',
    '15 min',
    '20 min',
    '30 min',
    '45 min',
    '1 hour',
    '1.5 hours',
    '2 hours',
    '2.5 hours',
    '3 hours',
    '4 hours',
    '5 hours',
    '6 hours',
    '8 hours',
    'Full shift'
  ];
  
  durations.forEach(duration => {
    const option = document.createElement('option');
    option.value = duration;
    datalist.appendChild(option);
  });
}

// ===== SHIFT LISTENER =====

function setupShiftListener() {
  // Shift listener kept for potential future use
  const shiftInput = document.querySelector('input[name="shift"]');
  
  shiftInput.addEventListener('input', function() {
    // Duration options don't change based on shift
  });
}

// ===== FILE UPLOAD =====

function setupFileUpload() {
  const fileInput = document.getElementById('evidence_files');
  
  fileInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        selectedFiles.push(file);
      }
    });
    
    updateFilePreview();
  });
}

function updateFilePreview() {
  const previewContainer = document.getElementById('file-preview');
  previewContainer.innerHTML = '';
  
  selectedFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-preview-item';
    
    let icon = '📄';
    if (file.type.startsWith('image/')) icon = '🖼️';
    else if (file.type.includes('pdf')) icon = '📕';
    else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) icon = '📘';
    else if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) icon = '📗';
    
    const displayName = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
    
    item.innerHTML = `${icon} ${displayName} <span class="remove-file" data-index="${index}">✕</span>`;
    previewContainer.appendChild(item);
  });
  
  previewContainer.querySelectorAll('.remove-file').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      selectedFiles.splice(index, 1);
      updateFilePreview();
    });
  });
}

function clearFileUpload() {
  selectedFiles = [];
  document.getElementById('evidence_files').value = '';
  updateFilePreview();
}

// ===== LOCAL STORAGE HELPERS =====

function getSavedItems(storageKey) {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveItem(storageKey, value) {
  if (!value || value.trim() === '') return;
  
  let saved = getSavedItems(storageKey);
  saved = saved.filter(item => item.toLowerCase() !== value.toLowerCase());
  saved.unshift(value.trim());
  
  if (saved.length > CONFIG.MAX_SAVED_ITEMS) {
    saved = saved.slice(0, CONFIG.MAX_SAVED_ITEMS);
  }
  
  localStorage.setItem(storageKey, JSON.stringify(saved));
}

// ===== DESCRIPTIONS & ACTIONS =====

function loadSavedDescriptions() {
  const datalist = document.getElementById('descriptions');
  const saved = getSavedItems(CONFIG.STORAGE_KEYS.DESCRIPTIONS);
  
  datalist.innerHTML = '';
  saved.forEach(desc => {
    const option = document.createElement('option');
    option.value = desc;
    datalist.appendChild(option);
  });
}

function loadSavedCorrectiveActions() {
  const datalist = document.getElementById('corrective_actions');
  if (!datalist) return;
  
  const saved = getSavedItems(CONFIG.STORAGE_KEYS.ACTIONS);
  
  datalist.innerHTML = '';
  saved.forEach(action => {
    const option = document.createElement('option');
    option.value = action;
    datalist.appendChild(option);
  });
}

// ===== QUICK TEMPLATES =====

function getSavedTemplates() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TEMPLATES) || '[]');
  } catch (e) {
    return [];
  }
}

function saveTemplate(category, description, corrective_action) {
  if (!description || description.trim() === '') return;
  
  let templates = getSavedTemplates();
  
  const existingIndex = templates.findIndex(t => 
    t.description.toLowerCase() === description.toLowerCase()
  );
  
  if (existingIndex >= 0) {
    templates[existingIndex].count++;
    templates[existingIndex].category = category;
    templates[existingIndex].corrective_action = corrective_action;
  } else {
    templates.push({
      category: category || '',
      description: description.trim(),
      corrective_action: corrective_action || '',
      count: 1
    });
  }
  
  templates.sort((a, b) => b.count - a.count);
  templates = templates.slice(0, 50);
  
  localStorage.setItem(CONFIG.STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}

function loadAndRenderTemplates() {
  const container = document.getElementById('template-buttons');
  const templates = getSavedTemplates();
  
  container.innerHTML = '';
  
  if (templates.length === 0) {
    container.innerHTML = '<span class="no-templates">Templates will appear as you submit issues</span>';
    return;
  }
  
  templates
    .sort((a, b) => b.count - a.count)
    .slice(0, CONFIG.MAX_TEMPLATES)
    .forEach((template, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'template-btn';
      btn.dataset.index = index;
      
      const shortDesc = template.description.length > 25 
        ? template.description.substring(0, 22) + '...' 
        : template.description;
      btn.textContent = shortDesc;
      btn.title = `${template.category}: ${template.description}`;
      
      btn.addEventListener('click', () => applyTemplate(template));
      container.appendChild(btn);
    });
}

function applyTemplate(template) {
  document.querySelector('input[name="category"]').value = template.category || '';
  document.querySelector('input[name="description"]').value = template.description || '';
  document.querySelector('input[name="corrective_action"]').value = template.corrective_action || '';
  
  updateProgress();
  showToast('Template applied!', false);
}

// ===== COLLAPSIBLE SECTIONS =====

function setupCollapsible() {
  // Resolution section
  const resolutionHeader = document.getElementById('resolution-header');
  const resolutionContent = document.getElementById('resolution-content');
  
  resolutionHeader.addEventListener('click', function() {
    this.classList.toggle('collapsed');
    resolutionContent.classList.toggle('collapsed');
  });
  
  // Feedback section
  const feedbackHeader = document.getElementById('feedback-header');
  const feedbackContent = document.getElementById('feedback-content');
  
  if (feedbackHeader && feedbackContent) {
    feedbackHeader.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      feedbackContent.classList.toggle('collapsed');
    });
  }
}

// ===== HELP MODAL =====

function setupHelpModal() {
  const helpBtn = document.getElementById('help-btn');
  const modal = document.getElementById('help-modal');
  const closeBtn = document.getElementById('modal-close');
  
  helpBtn.addEventListener('click', function() {
    modal.classList.add('show');
  });
  
  closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });
}

// ===== FEEDBACK SYSTEM =====

function setupFeedback() {
  const sendBtn = document.getElementById('send-feedback-btn');
  
  sendBtn.addEventListener('click', function() {
    submitFeedback();
  });
}

function submitFeedback() {
  const name = document.getElementById('feedback-name').value.trim();
  const email = document.getElementById('feedback-email').value.trim();
  const type = document.getElementById('feedback-type').value;
  const message = document.getElementById('feedback-message').value.trim();
  
  if (!message) {
    showToast('Please write your feedback before sending.', true);
    return;
  }
  
  const sendBtn = document.getElementById('send-feedback-btn');
  sendBtn.classList.add('loading');
  sendBtn.textContent = 'Sending...';
  
  const feedback = {
    name: name || 'Anonymous',
    email: email || 'Not provided',
    type: type,
    message: message,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  
  // Save to localStorage as backup
  saveFeedbackLocally(feedback);
  
  // Send via mailto (opens email client)
  sendFeedbackEmail(feedback);
  
  // Reset form
  setTimeout(() => {
    document.getElementById('feedback-name').value = '';
    document.getElementById('feedback-email').value = '';
    document.getElementById('feedback-type').value = 'suggestion';
    document.getElementById('feedback-message').value = '';
    
    sendBtn.classList.remove('loading');
    sendBtn.textContent = '📧 Send Feedback';
    
    showToast('✓ Feedback submitted! Thank you!');
  }, 500);
}

function saveFeedbackLocally(feedback) {
  try {
    let savedFeedback = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FEEDBACK) || '[]');
    savedFeedback.push(feedback);
    
    // Keep only last 100 feedback items
    if (savedFeedback.length > 100) {
      savedFeedback = savedFeedback.slice(-100);
    }
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.FEEDBACK, JSON.stringify(savedFeedback));
  } catch (e) {
    console.log('Could not save feedback locally');
  }
}

function sendFeedbackEmail(feedback) {
  const typeLabels = {
    'suggestion': '💡 Suggestion',
    'bug': '🐛 Bug Report',
    'feature': '✨ Feature Request',
    'other': '📝 Other'
  };
  
  const subject = encodeURIComponent(`[Problem Tracking Feedback] ${typeLabels[feedback.type]}`);
  const body = encodeURIComponent(
    `FEEDBACK SUBMISSION\n` +
    `==================\n\n` +
    `Type: ${typeLabels[feedback.type]}\n` +
    `From: ${feedback.name}\n` +
    `Email: ${feedback.email}\n` +
    `Date: ${new Date(feedback.timestamp).toLocaleString()}\n\n` +
    `MESSAGE:\n${feedback.message}\n\n` +
    `---\nSent from Problem Tracking Form`
  );
  
  // Open email client
  window.open(`mailto:${CONFIG.FEEDBACK_EMAIL}?subject=${subject}&body=${body}`, '_blank');
}

// Function to export all feedback (for admin use)
function exportAllFeedback() {
  const feedback = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FEEDBACK) || '[]');
  console.log('All saved feedback:', feedback);
  return feedback;
}

// ===== PROGRESS TRACKING =====

function setupProgressTracking() {
  const requiredFields = document.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    field.addEventListener('input', updateProgress);
    field.addEventListener('change', updateProgress);
  });
  
  updateProgress();
}

function updateProgress() {
  const requiredFields = document.querySelectorAll('[required]');
  let filled = 0;
  const total = requiredFields.length;
  
  requiredFields.forEach(field => {
    if (field.value && field.value.trim() !== '') {
      filled++;
      field.closest('.form-group')?.classList.add('completed');
    } else {
      field.closest('.form-group')?.classList.remove('completed');
    }
  });
  
  const percentage = (filled / total) * 100;
  document.getElementById('progress-fill').style.width = percentage + '%';
  document.getElementById('progress-count').textContent = filled;
  document.getElementById('progress-total').textContent = total;
}

// ===== PREFERENCES =====

function loadSavedPreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PREFERENCES) || '{}');
    
    if (prefs.line) {
      const lineSelect = document.querySelector('select[name="line"]');
      for (let option of lineSelect.options) {
        if (option.value === prefs.line) {
          option.selected = true;
          break;
        }
      }
    }
    
    if (prefs.owner) {
      const ownerSelect = document.getElementById('owner-select');
      for (let option of ownerSelect.options) {
        if (option.value === prefs.owner) {
          option.selected = true;
          break;
        }
      }
    }
    
    updateProgress();
  } catch (e) {
    console.log('No saved preferences');
  }
}

function savePreferences() {
  if (!document.getElementById('remember-prefs').checked) return;
  
  const prefs = {
    line: document.querySelector('select[name="line"]').value,
    owner: document.getElementById('owner-select').value
  };
  
  localStorage.setItem(CONFIG.STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}

// ===== TOAST NOTIFICATIONS =====

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast' + (isError ? ' error' : '');
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== FORM SUBMISSION =====

document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Sending...';

  const formData = new FormData(this);
  
  // Handle file uploads
  formData.delete('evidence_files');
  selectedFiles.forEach((file, index) => {
    formData.append('evidence_file_' + index, file);
  });
  
  if (selectedFiles.length > 0) {
    const fileNames = selectedFiles.map(f => f.name).join(', ');
    formData.append('evidence_files_list', fileNames);
  }
  
  // Save for future autocomplete
  const category = formData.get('category');
  const description = formData.get('description');
  const correctiveAction = formData.get('corrective_action');
  
  saveItem(CONFIG.STORAGE_KEYS.DESCRIPTIONS, description);
  saveItem(CONFIG.STORAGE_KEYS.ACTIONS, correctiveAction);
  saveTemplate(category, description, correctiveAction);
  savePreferences();

  // Submit to Google Apps Script
  fetch(CONFIG.GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(() => {
    showToast('✓ Data sent successfully!');
    resetForm();
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '✓ Submit Report';
  })
  .catch(() => {
    showToast('Error sending data. Please try again.', true);
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '✓ Submit Report';
  });
});

function resetForm() {
  document.getElementById("form").reset();
  clearFileUpload();
  
  // Re-apply auto-fills
  autoSelectWeek();
  autoDetectShift();
  autoFillDateDetection();
  autoFillDateFinished();
  autoFillIssueTime();
  
  // Reload saved data
  loadSavedDescriptions();
  loadSavedCorrectiveActions();
  loadSavedPreferences();
  loadAndRenderTemplates();
  
  updateProgress();
}
