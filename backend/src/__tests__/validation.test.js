import { describe, it, expect } from '@jest/globals';
import { validateEmail, validateQuizData } from '../utils/validation.js';

describe('Validation Utility Tests', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('student@mu.ie')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validateQuizData', () => {
    it('should return empty array for valid quiz data', () => {
      const validQuiz = {
        title: 'Test Quiz',
        moduleId: 'CS101',
        timeLimit: 30,
        passingScore: 70
      };
      const errors = validateQuizData(validQuiz);
      expect(errors).toEqual([]);
      expect(errors.length).toBe(0);
    });

    it('should return error when title is missing', () => {
      const invalidQuiz = {
        title: '',
        moduleId: 'CS101'
      };
      const errors = validateQuizData(invalidQuiz);
      expect(errors).toContain('Title is required');
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return error when moduleId is missing', () => {
      const invalidQuiz = {
        title: 'Test Quiz',
        moduleId: ''
      };
      const errors = validateQuizData(invalidQuiz);
      expect(errors).toContain('Module ID is required');
    });

    it('should return error when timeLimit is invalid', () => {
      const invalidQuiz = {
        title: 'Test Quiz',
        moduleId: 'CS101',
        timeLimit: -5
      };
      const errors = validateQuizData(invalidQuiz);
      expect(errors).toContain('Time limit must be a positive number');
    });

    it('should return error when passingScore is out of range', () => {
      const invalidQuiz = {
        title: 'Test Quiz',
        moduleId: 'CS101',
        passingScore: 150
      };
      const errors = validateQuizData(invalidQuiz);
      expect(errors).toContain('Passing score must be between 0 and 100');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidQuiz = {
        title: '',
        moduleId: '',
        timeLimit: -10,
        passingScore: 200
      };
      const errors = validateQuizData(invalidQuiz);
      expect(errors.length).toBe(4);
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Module ID is required');
    });
  });
});
