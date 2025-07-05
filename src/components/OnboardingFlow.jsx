
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap, 
  Code, 
  Server, 
  Cloud, 
  Smartphone, 
  Database,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  BookOpen
} from 'lucide-react';

const educationLevels = [
  { id: '11th-12th', label: '11th/12th Grade (PCM/Commerce)', icon: GraduationCap },
  { id: 'ug', label: 'Undergraduate (UG)', icon: BookOpen },
  { id: 'pg', label: 'Postgraduate (PG)', icon: Target }
];

const careerPaths = [
  { 
    id: 'web-developer', 
    label: 'Web Developer', 
    icon: Code,
    description: 'Build amazing websites and web applications',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Responsive Design']
  },
  { 
    id: 'software-engineer', 
    label: 'Software Engineer', 
    icon: Server,
    description: 'Create robust software solutions and systems',
    skills: ['Programming Languages', 'Data Structures', 'Algorithms', 'System Design', 'Testing', 'Git', 'Databases', 'API Development']
  },
  { 
    id: 'devops-engineer', 
    label: 'DevOps Engineer', 
    icon: Cloud,
    description: 'Bridge development and operations seamlessly',
    skills: ['Linux', 'Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD', 'Monitoring', 'Infrastructure as Code', 'Scripting']
  },
  { 
    id: 'mobile-developer', 
    label: 'Mobile Developer', 
    icon: Smartphone,
    description: 'Build native and cross-platform mobile apps',
    skills: ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'Mobile UI/UX', 'App Store Deployment', 'API Integration', 'Mobile Testing']
  },
  { 
    id: 'data-engineer', 
    label: 'Data Engineer', 
    icon: Database,
    description: 'Design and maintain data infrastructure',
    skills: ['Python', 'SQL', 'Apache Spark', 'Data Warehousing', 'ETL Pipelines', 'Big Data', 'Cloud Platforms', 'Data Modeling']
  }
];

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    educationLevel: '',
    careerPath: '',
    currentSkills: []
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.includes(skill)
        ? prev.currentSkills.filter(s => s !== skill)
        : [...prev.currentSkills, skill]
    }));
  };

  const handleComplete = () => {
    const selectedCareer = careerPaths.find(c => c.id === formData.careerPath);
    const skillGaps = selectedCareer.skills.filter(skill => !formData.currentSkills.includes(skill));
    
    const userData = {
      ...formData,
      skillGaps,
      requiredSkills: selectedCareer.skills,
      joinedAt: new Date().toISOString(),
      bookmarkedResources: [],
      completedResources: []
    };
    
    onComplete(userData);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name && formData.email;
      case 2: return formData.educationLevel;
      case 3: return formData.careerPath;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">Learning Resource Aggregator</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Your Tech Career Journey Starts Here
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/80 mb-8"
          >
            Discover your skill gaps and get personalized learning paths
          </motion.p>
        </div>

        <Card className="glass-effect border-white/20 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-purple-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/60 text-sm">Step {step} of 4</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Let's get to know you!</h2>
                  <p className="text-white/70">Tell us a bit about yourself</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">What's your education level?</h2>
                  <p className="text-white/70">This helps us customize your learning path</p>
                </div>
                
                <div className="grid gap-4">
                  {educationLevels.map((level) => (
                    <motion.div
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, educationLevel: level.id }))}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        formData.educationLevel === level.id
                          ? 'border-purple-400 bg-purple-400/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <level.icon className="w-6 h-6 text-white" />
                        <span className="text-white font-medium">{level.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Choose your career path</h2>
                  <p className="text-white/70">What role excites you the most?</p>
                </div>
                
                <div className="grid gap-4">
                  {careerPaths.map((career) => (
                    <motion.div
                      key={career.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, careerPath: career.id }))}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        formData.careerPath === career.id
                          ? 'border-purple-400 bg-purple-400/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <career.icon className="w-6 h-6 text-white mt-1" />
                        <div>
                          <h3 className="text-white font-medium">{career.label}</h3>
                          <p className="text-white/70 text-sm">{career.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">What skills do you already have?</h2>
                  <p className="text-white/70">Select all that apply to identify your skill gaps</p>
                </div>
                
                {formData.careerPath && (
                  <div className="grid grid-cols-2 gap-3">
                    {careerPaths.find(c => c.id === formData.careerPath)?.skills.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 border border-white/20"
                      >
                        <Checkbox
                          id={skill}
                          checked={formData.currentSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          className="border-white/40 data-[state=checked]:bg-purple-500"
                        />
                        <Label htmlFor={skill} className="text-white text-sm cursor-pointer">
                          {skill}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrev}
              disabled={step === 1}
              variant="outline"
              className="border-white/20"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Complete Setup
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default OnboardingFlow;
