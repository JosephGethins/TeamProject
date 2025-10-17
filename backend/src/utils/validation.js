export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function validateQuizData(quizData) {
  const errors = [];
  
  if (!quizData.title || quizData.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!quizData.moduleId || quizData.moduleId.trim().length === 0) {
    errors.push('Module ID is required');
  }
  
  if (quizData.timeLimit && (isNaN(quizData.timeLimit) || quizData.timeLimit <= 0)) {
    errors.push('Time limit must be a positive number');
  }
  
  if (quizData.passingScore && (isNaN(quizData.passingScore) || quizData.passingScore < 0 || quizData.passingScore > 100)) {
    errors.push('Passing score must be between 0 and 100');
  }
  
  return errors;
}

export function validateQuestionData(questionData) {
  const errors = [];
  
  if (!questionData.question || questionData.question.trim().length === 0) {
    errors.push('Question text is required');
  }
  
  if (!questionData.options || !Array.isArray(questionData.options) || questionData.options.length < 2) {
    errors.push('At least 2 options are required');
  }
  
  if (questionData.correctAnswer === undefined || questionData.correctAnswer === null) {
    errors.push('Correct answer is required');
  }
  
  if (questionData.options && questionData.correctAnswer !== undefined) {
    if (questionData.correctAnswer < 0 || questionData.correctAnswer >= questionData.options.length) {
      errors.push('Correct answer must be a valid option index');
    }
  }
  
  if (questionData.points && (isNaN(questionData.points) || questionData.points <= 0)) {
    errors.push('Points must be a positive number');
  }
  
  return errors;
}

export function validateScheduleItem(scheduleItem) {
  const errors = [];
  
  if (!scheduleItem.title || scheduleItem.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!scheduleItem.startTime || !isValidTime(scheduleItem.startTime)) {
    errors.push('Valid start time is required (HH:MM format)');
  }
  
  if (!scheduleItem.endTime || !isValidTime(scheduleItem.endTime)) {
    errors.push('Valid end time is required (HH:MM format)');
  }
  
  if (scheduleItem.startTime && scheduleItem.endTime && 
      !isValidTimeRange(scheduleItem.startTime, scheduleItem.endTime)) {
    errors.push('End time must be after start time');
  }
  
  return errors;
}

function isValidTime(time) {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function isValidTimeRange(startTime, endTime) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes > startMinutes;
}

export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
}

export function validateRole(role) {
  const validRoles = ['student', 'instructor', 'admin'];
  return validRoles.includes(role);
}
