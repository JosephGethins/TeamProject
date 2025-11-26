import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function QuestionBank() {
  const [allModules, setAllModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'medium'
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchQuestions(selectedModule);
    }
  }, [selectedModule]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      // Fetch ALL users to get ALL their modules
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      console.log('Total users found:', snapshot.docs.length);
      
      const allModulesSet = new Set();
      
      snapshot.docs.forEach(userDoc => {
        const userData = userDoc.data();
        console.log('User data:', userData);
        
        // Check different possible module storage formats
        if (userData.modules && Array.isArray(userData.modules)) {
          userData.modules.forEach(module => {
            if (typeof module === 'string') {
              allModulesSet.add(module);
            } else if (module.name) {
              allModulesSet.add(module.name);
            } else if (module.title) {
              allModulesSet.add(module.title);
            }
          });
        }
        
        // Also check selectedModules field
        if (userData.selectedModules && Array.isArray(userData.selectedModules)) {
          userData.selectedModules.forEach(module => {
            if (typeof module === 'string') {
              allModulesSet.add(module);
            } else if (module.name) {
              allModulesSet.add(module.name);
            }
          });
        }
      });
      
      console.log('All unique modules found:', Array.from(allModulesSet));
      
      const uniqueModules = Array.from(allModulesSet).map(name => ({
        id: name.replace(/\s+/g, '-').toLowerCase(),
        name: name
      }));
      
      setAllModules(uniqueModules.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching modules:', error);
      setAllModules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (moduleName) => {
    setLoading(true);
    try {
      const questionsRef = collection(db, 'questions');
      const q = query(questionsRef, where('module', '==', moduleName));
      const snapshot = await getDocs(q);
      const moduleQuestions = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setQuestions(moduleQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleAddQuestion = async () => {
    if (!selectedModule || !newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const questionData = {
        ...newQuestion,
        module: selectedModule,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.uid || 'admin'
      };
      
      const docRef = await addDoc(collection(db, 'questions'), questionData);
      
      setQuestions([...questions, { ...questionData, id: docRef.id }]);
      setShowAddForm(false);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'medium'
      });
      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteDoc(doc(db, 'questions', questionId));
      setQuestions(questions.filter(q => q.id !== questionId));
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question. Please try again.');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const questionRef = doc(db, 'questions', editingQuestion.id);
      const updateData = {
        question: editingQuestion.question,
        options: editingQuestion.options,
        correctAnswer: editingQuestion.correctAnswer,
        difficulty: editingQuestion.difficulty,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(questionRef, updateData);

      setQuestions(questions.map(q => 
        q.id === editingQuestion.id ? { ...q, ...updateData } : q
      ));
      setEditingQuestion(null);
      alert('Question updated successfully!');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Error updating question. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading && allModules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Question Bank</h1>
          <p className="text-gray-600">Manage quiz questions for all available modules</p>
        </div>

        {allModules.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Modules Found</h3>
            <p className="text-gray-500">No users have selected any modules yet</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Module List Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  All Modules ({allModules.length})
                </h2>
                <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {allModules.map((module) => {
                    return (
                      <button
                        key={module.id}
                        onClick={() => setSelectedModule(module.name)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedModule === module.name
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{module.name}</span>
                          {selectedModule === module.name && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Questions Display */}
            <div className="lg:col-span-3">
              {!selectedModule ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Module</h3>
                  <p className="text-gray-500">Choose a module from the list to view and manage its questions</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedModule}</h2>
                        <p className="text-gray-600 mt-1">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
                      </div>
                      <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Question
                      </button>
                    </div>

                    {/* Add Question Form */}
                    {showAddForm && (
                      <div className="mb-6 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Question</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                            <textarea
                              value={newQuestion.question}
                              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                              placeholder="Enter your question..."
                              rows={3}
                            />
                          </div>
                          {newQuestion.options.map((option, idx) => (
                            <div key={idx}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Option {idx + 1} {idx === newQuestion.correctAnswer && <span className="text-green-600 font-bold">(Correct Answer)</span>}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...newQuestion.options];
                                    newOptions[idx] = e.target.value;
                                    setNewQuestion({...newQuestion, options: newOptions});
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder={`Option ${idx + 1}`}
                                />
                                <button
                                  onClick={() => setNewQuestion({...newQuestion, correctAnswer: idx})}
                                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                                    idx === newQuestion.correctAnswer
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  ✓
                                </button>
                              </div>
                            </div>
                          ))}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select
                              value={newQuestion.difficulty}
                              onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={handleAddQuestion}
                              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save Question
                            </button>
                            <button
                              onClick={() => setShowAddForm(false)}
                              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Questions List */}
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading questions...</p>
                      </div>
                    ) : questions.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">No questions yet</p>
                        <p className="text-sm mt-1">Add your first question to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((q, idx) => (
                          <div key={q.id} className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50">
                            {editingQuestion?.id === q.id ? (
                              <div className="space-y-4">
                                <textarea
                                  value={editingQuestion.question}
                                  onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                                  rows={3}
                                />
                                {editingQuestion.options.map((option, optIdx) => (
                                  <div key={optIdx} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...editingQuestion.options];
                                        newOptions[optIdx] = e.target.value;
                                        setEditingQuestion({...editingQuestion, options: newOptions});
                                      }}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                      onClick={() => setEditingQuestion({...editingQuestion, correctAnswer: optIdx})}
                                      className={`px-6 py-2 rounded-lg font-medium ${
                                        optIdx === editingQuestion.correctAnswer
                                          ? 'bg-green-600 text-white'
                                          : 'bg-gray-200 text-gray-700'
                                      }`}
                                    >
                                      ✓
                                    </button>
                                  </div>
                                ))}
                                <select
                                  value={editingQuestion.difficulty}
                                  onChange={(e) => setEditingQuestion({...editingQuestion, difficulty: e.target.value})}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="easy">Easy</option>
                                  <option value="medium">Medium</option>
                                  <option value="hard">Hard</option>
                                </select>
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleUpdateQuestion}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingQuestion(null)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded">Q{idx + 1}</span>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(q.difficulty)}`}>
                                        {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 font-medium text-lg">{q.question}</p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <button
                                      onClick={() => setEditingQuestion(q)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit question"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteQuestion(q.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete question"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="space-y-2 ml-4">
                                  {q.options.map((option, optIdx) => (
                                    <div
                                      key={optIdx}
                                      className={`px-4 py-3 rounded-lg border-2 ${
                                        optIdx === q.correctAnswer
                                          ? 'bg-green-50 border-green-400 text-green-900'
                                          : 'bg-white border-gray-200 text-gray-700'
                                      }`}
                                    >
                                      <span className="font-bold mr-3">{String.fromCharCode(65 + optIdx)}.</span>
                                      {option}
                                      {optIdx === q.correctAnswer && (
                                        <span className="ml-3 text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">✓ CORRECT</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}