import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const QuizProblem = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const moduleId = searchParams.get('module');
  const moduleName = searchParams.get('name');
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [moduleName]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const questionsRef = collection(db, 'questions');
      const q = query(questionsRef, where('module', '==', moduleName));
      const snapshot = await getDocs(q);
      
      const fetchedQuestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (fetchedQuestions.length === 0) {
        setError('No questions found for this module.');
        setLoading(false);
        return;
      }

      // Shuffle questions for variety
      const shuffled = fetchedQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    
    // Update score and answered questions
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, {
      questionId: questions[currentQuestionIndex].id,
      selectedAnswer: answerIndex,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
    // Reshuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  };

  const getAnswerClassName = (index) => {
    if (!showFeedback) {
      return selectedAnswer === index
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50';
    }

    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    const isSelected = index === selectedAnswer;

    if (isCorrect) {
      return 'border-green-500 bg-green-50';
    } else if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50';
    } else {
      return 'border-gray-300 bg-gray-100';
    }
  };

  const getAnswerIcon = (index) => {
    if (!showFeedback) return null;

    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    const isSelected = index === selectedAnswer;

    if (isCorrect) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (isSelected && !isCorrect) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return null;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/quiz')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{moduleName}</p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Correct</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{questions.length - score}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Incorrect</p>
                  </div>
                  <div>
                    <p className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                      {percentage}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Score</p>
                  </div>
                </div>
              </div>

              {percentage >= 70 && (
                <div className="p-4 rounded-lg mb-6 bg-green-50 text-green-800">
                  <p className="font-semibold">
                    🎉 Congratulations! You passed!
                  </p>
                  <p className="text-sm mt-1">
                    Passing score: 70%
                  </p>
                </div>
              )}
              
              {percentage < 70 && (
                <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-800">
                  <p className="font-semibold">
                    ❌ You did not pass this time.
                  </p>
                  <p className="text-sm mt-1">
                    Passing score: 70% (You scored {percentage}%)
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetakeQuiz}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{moduleName}</h1>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Questions</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${getAnswerClassName(index)} ${
                    showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full font-bold text-gray-900">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-900 font-medium">{option}</span>
                    </div>
                    {getAnswerIcon(index)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <p className="font-semibold flex items-center gap-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Correct! Well done!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Incorrect. The correct answer is {String.fromCharCode(65 + currentQuestion.correctAnswer)}.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/quiz')}
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium"
            >
              ← Exit Quiz
            </button>
            
            {showFeedback && (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  'Finish Quiz'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Current Score Indicator */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Current Score: <span className="font-bold text-blue-600 dark:text-blue-400">{score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizProblem;