
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';

const mockQuestions = {
  'HTML': [
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language"],
      answer: "Hyper Text Markup Language",
      difficulty: "easy"
    },
    {
      question: "Which HTML tag is used to define an internal style sheet?",
      options: ["<css>", "<script>", "<style>"],
      answer: "<style>",
      difficulty: "medium"
    },
    {
      question: "What is the correct HTML element for inserting a line break?",
      options: ["<lb>", "<break>", "<br>"],
      answer: "<br>",
      difficulty: "easy"
    },
  ],
  'CSS': [
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets"],
      answer: "Cascading Style Sheets",
      difficulty: "easy"
    },
    {
      question: "Which CSS property controls the text size?",
      options: ["font-style", "text-size", "font-size"],
      answer: "font-size",
      difficulty: "medium"
    },
  ],
  'JavaScript': [
    {
      question: "Inside which HTML element do we put the JavaScript?",
      options: ["<script>", "<javascript>", "<js>"],
      answer: "<script>",
      difficulty: "easy"
    },
    {
      question: "How do you write 'Hello World' in an alert box?",
      options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');"],
      answer: "alert('Hello World');",
      difficulty: "medium"
    },
  ],
  // Add more questions for other skills as needed
};

const getSkillIcon = (skill) => {
  const icons = {
    'HTML': FileText,
    'CSS': FileText,
    'JavaScript': FileText,
    'React': FileText,
  };
  return icons[skill] || FileText;
};


function SkillTest({ skill, onTestComplete, lastResult, mockResources }) {
  const [testState, setTestState] = useState('idle'); // idle, ongoing, completed
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const SkillIcon = getSkillIcon(skill);

  useEffect(() => {
    if (mockQuestions[skill]) {
      // Shuffle and select a few questions (e.g., 2-3)
      const shuffled = [...mockQuestions[skill]].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, Math.min(shuffled.length, 3))); // Max 3 questions
    } else {
      setQuestions([]);
    }
  }, [skill]);

  const startTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setTestState('ongoing');
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitTest = () => {
    let currentScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setTestState('completed');
    onTestComplete(skill, currentScore, questions.length);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitTest();
    }
  };
  
  const getResourcesForSkill = (skillName) => {
    return mockResources[skillName] || [];
  };


  if (!questions || questions.length === 0) {
    return (
      <Card className="glass-effect border-white/20 p-6 flex flex-col items-center text-center">
        <SkillIcon className="w-10 h-10 text-purple-400 mb-3" />
        <h4 className="text-lg font-semibold text-white mb-2">{skill}</h4>
        <p className="text-sm text-white/60">No test available for this skill yet.</p>
      </Card>
    );
  }


  if (testState === 'idle') {
    return (
      <Card className="glass-effect border-white/20 p-6 flex flex-col items-center text-center">
        <SkillIcon className="w-10 h-10 text-purple-400 mb-3" />
        <h4 className="text-lg font-semibold text-white mb-2">{skill}</h4>
        {lastResult && (
          <p className="text-xs text-white/50 mb-1">
            Last score: {lastResult.score}/{lastResult.totalQuestions} on {new Date(lastResult.date).toLocaleDateString()}
          </p>
        )}
        <p className="text-sm text-white/70 mb-4">Ready to test your knowledge? ({questions.length} questions)</p>
        <Button onClick={startTest} className="bg-purple-500 hover:bg-purple-600 text-white">
          Start Test
        </Button>
      </Card>
    );
  }

  if (testState === 'ongoing') {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <Card className="glass-effect border-white/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">{skill} Test</h4>
          <p className="text-sm text-white/70">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <p className="text-white mb-4">{currentQuestion.question}</p>
          <RadioGroup
            onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
            value={answers[currentQuestionIndex]}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10">
                <RadioGroupItem value={option} id={`${skill}-q${currentQuestionIndex}-o${i}`} className="border-white/40 text-purple-400 data-[state=checked]:border-purple-400" />
                <Label htmlFor={`${skill}-q${currentQuestionIndex}-o${i}`} className="text-white cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </motion.div>
        <Button
          onClick={handleNextQuestion}
          disabled={!answers[currentQuestionIndex]}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Test'}
        </Button>
      </Card>
    );
  }

  if (testState === 'completed') {
    const percentage = Math.round((score / questions.length) * 100);
    const recommendedResources = getResourcesForSkill(skill);

    return (
      <Card className="glass-effect border-white/20 p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h4 className="text-xl font-bold text-white mb-2">Test Completed!</h4>
        <p className="text-3xl font-bold gradient-text mb-2">{percentage}%</p>
        <p className="text-white/80 mb-1">You scored {score} out of {questions.length} for {skill}.</p>
        
        {percentage < 70 && recommendedResources.length > 0 && (
          <div className="mt-6 text-left">
            <h5 className="text-md font-semibold text-white mb-3">Recommendations to improve your {skill} knowledge:</h5>
            <div className="space-y-2">
              {recommendedResources.slice(0, 2).map(resource => (
                <motion.div
                  key={resource.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <div>
                       <p className="text-sm text-white font-medium">{resource.title}</p>
                       <p className="text-xs text-white/60">{resource.type} - {resource.provider}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild className="text-white hover:bg-white/10">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {percentage >= 70 && (
            <p className="text-green-400 mt-4">Great job! You have a good understanding of {skill}.</p>
        )}

        <Button onClick={startTest} variant="outline" className="mt-6 border-white/20">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Test
        </Button>
      </Card>
    );
  }

  return null;
}

export default SkillTest;
