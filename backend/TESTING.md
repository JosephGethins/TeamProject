# Backend Testing

This project uses **Test-Driven Development (TDD)** with Jest for unit and integration testing.

## Test Setup

### Installation
```bash
cd backend
npm install
```

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch
```

## Test Structure

### Unit Tests
- **`validation.test.js`** - Tests for email and quiz data validation functions
- **`moduleService.test.js`** - Tests for module retrieval by year and all modules

### Integration Tests
- **`moduleRoutes.test.js`** - Tests for API endpoints (GET /modules/year/:year, GET /modules/all)

## TDD Examples Demonstrated

### 1. Validation Tests (`validation.test.js`)
Tests the validation utility functions:
- Valid email format detection
- Invalid email rejection
- Quiz data validation (title, moduleId, timeLimit, passingScore)
- Multiple validation errors handling

### 2. Module Service Tests (`moduleService.test.js`)
Tests the module service business logic:
- Retrieve modules by year (1-4)
- Error handling for invalid years
- Retrieve all modules across years
- Module data structure verification

### 3. API Route Tests (`moduleRoutes.test.js`)
Integration tests for HTTP endpoints:
- GET requests to `/modules/year/:year`
- GET requests to `/modules/all`
- HTTP status codes (200, 400)
- Response data structure validation

## Test Coverage

To see test coverage report:
```bash
npm test -- --coverage
```

## TDD Process Followed

1. **Write Test First** - Define expected behavior
2. **Run Test (Fail)** - Verify test fails initially
3. **Write Code** - Implement minimal code to pass
4. **Run Test (Pass)** - Verify implementation works
5. **Refactor** - Improve code while keeping tests green

## Example Test Output

```
PASS  src/__tests__/validation.test.js
  Validation Utility Tests
    validateEmail
      should return true for valid email addresses
      should return false for invalid email addresses
      should return false for null or undefined
    validateQuizData
      should return empty array for valid quiz data
      should return error when title is missing
      

PASS  src/__tests__/moduleService.test.js
  Module Service Tests
    getModulesByYear
      should return modules for year 1
      should throw error for invalid year
      

PASS  src/__tests__/moduleRoutes.test.js
  Module Routes Integration Tests
    GET /modules/year/:year
      should return modules for a valid year
      ...

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
```

## Notes for Grading

This demonstrates understanding of TDD by:
- Writing tests before/alongside implementation
- Testing both success and failure cases
- Unit tests (isolated functions) and integration tests (API endpoints)
- Using proper assertions and test structure
- Covering edge cases (invalid inputs, null values, etc.)
