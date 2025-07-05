
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import SkillTest from '@/components/SkillTest';
import { 
  User, 
  LogOut, 
  Target, 
  BookOpen, 
  Star, 
  CheckCircle, 
  TrendingUp,
  Award,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  FileText,
  HelpCircle
} from 'lucide-react';

const mockResources = {
  'HTML': [
    { id: 1, title: 'HTML Crash Course', type: 'Video', duration: '2 hours', url: '#', provider: 'YouTube' },
    { id: 2, title: 'MDN HTML Guide', type: 'Documentation', duration: '1 hour', url: '#', provider: 'MDN' },
    { id: 3, title: 'HTML5 Certification', type: 'Certification', duration: '4 weeks', url: '#', provider: 'Coursera' }
  ],
  'CSS': [
    { id: 4, title: 'CSS Grid & Flexbox', type: 'Video', duration: '3 hours', url: '#', provider: 'YouTube' },
    { id: 5, title: 'CSS Tricks Guide', type: 'Article', duration: '30 mins', url: '#', provider: 'CSS-Tricks' },
    { id: 6, title: 'Advanced CSS Course', type: 'Course', duration: '6 weeks', url: '#', provider: 'Udemy' }
  ],
  'JavaScript': [
    { id: 7, title: 'JavaScript Fundamentals', type: 'Course', duration: '8 weeks', url: '#', provider: 'freeCodeCamp' },
    { id: 8, title: 'ES6+ Features', type: 'Video', duration: '2 hours', url: '#', provider: 'YouTube' },
    { id: 9, title: 'JavaScript Algorithms', type: 'Practice', duration: 'Ongoing', url: '#', provider: 'LeetCode' }
  ],
  'React': [
    { id: 10, title: 'React Official Tutorial', type: 'Tutorial', duration: '4 hours', url: '#', provider: 'React.dev' },
    { id: 11, title: 'React Hooks Deep Dive', type: 'Video', duration: '3 hours', url: '#', provider: 'YouTube' },
    { id: 12, title: 'React Projects Course', type: 'Course', duration: '10 weeks', url: '#', provider: 'Udemy' }
  ],
  'Node.js': [
    { id: 13, title: 'Node.js Crash Course', type: 'Video', duration: '4 hours', url: '#', provider: 'YouTube' },
    { id: 14, title: 'Express.js Guide', type: 'Documentation', duration: '2 hours', url: '#', provider: 'Express' },
    { id: 15, title: 'Node.js Certification', type: 'Certification', duration: '6 weeks', url: '#', provider: 'Coursera' }
  ],
  'MongoDB': [
    { id: 16, title: 'MongoDB Basics', type: 'Course', duration: '4 weeks', url: '#', provider: 'MongoDB University' },
    { id: 17, title: 'Mongoose for Node.js', type: 'Video', duration: '1.5 hours', url: '#', provider: 'YouTube' }
  ],
  'Git': [
    { id: 18, title: 'Git & GitHub Crash Course', type: 'Video', duration: '2 hours', url: '#', provider: 'YouTube' },
    { id: 19, title: 'Pro Git Book', type: 'Book', duration: 'Varies', url: '#', provider: 'git-scm.com' }
  ],
  'Responsive Design': [
    { id: 20, title: 'Responsive Web Design Course', type: 'Course', duration: '5 weeks', url: '#', provider: 'freeCodeCamp' }
  ],
  'Programming Languages': [
    { id: 21, title: 'Introduction to Python', type: 'Course', duration: '6 weeks', url: '#', provider: 'Codecademy' }
  ],
  'Data Structures': [
    { id: 22, title: 'Data Structures in Java', type: 'Course', duration: '8 weeks', url: '#', provider: 'Coursera' }
  ],
  'Algorithms': [
    { id: 23, title: 'Algorithm Design Manual', type: 'Book', duration: 'Varies', url: '#', provider: 'Springer' }
  ]
};


function Dashboard({ user, onLogout, updateUser }) {
  const [bookmarkedResources, setBookmarkedResources] = useState(user.bookmarkedResources || []);
  const [completedResources, setCompletedResources] = useState(user.completedResources || []);
  const [testResults, setTestResults] = useState(user.testResults || {});

  useEffect(() => {
    const updatedUser = {
      ...user,
      bookmarkedResources,
      completedResources,
      testResults
    };
    localStorage.setItem('learningAggregatorUser', JSON.stringify(updatedUser));
  }, [bookmarkedResources, completedResources, testResults, user]);

  const toggleBookmark = (resourceId) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
    
    toast({
      title: bookmarkedResources.includes(resourceId) ? "Bookmark removed" : "Resource bookmarked!",
      description: bookmarkedResources.includes(resourceId) ? "Removed from your bookmarks" : "Added to your bookmarks",
    });
  };

  const toggleComplete = (resourceId) => {
    setCompletedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
    
    toast({
      title: completedResources.includes(resourceId) ? "Marked as incomplete" : "Great progress! 🎉",
      description: completedResources.includes(resourceId) ? "Removed from completed" : "Resource marked as completed",
    });
  };

  const handleTestComplete = (skill, score, totalQuestions) => {
    const newTestResults = {
      ...testResults,
      [skill]: { score, totalQuestions, date: new Date().toISOString() }
    };
    setTestResults(newTestResults);
    updateUser({ ...user, testResults: newTestResults });
    toast({
      title: `Test for ${skill} completed!`,
      description: `You scored ${score}/${totalQuestions}. Check recommendations!`,
    });
  };

  const getProgressPercentage = () => {
    if (!user.requiredSkills || user.requiredSkills.length === 0) return 0;
    const totalSkills = user.requiredSkills.length;
    const learnedSkills = user.currentSkills.length;
    return Math.round((learnedSkills / totalSkills) * 100);
  };

  const getAllResources = () => {
    return Object.values(mockResources).flat();
  };

  const getBookmarkedResourcesList = () => {
    return getAllResources().filter(resource => bookmarkedResources.includes(resource.id));
  };

  const getResourcesForSkill = (skill) => {
    return mockResources[skill] || [];
  };


  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Welcome back, {user.name}!</h1>
                <p className="text-white/70 text-sm">Continue your learning journey</p>
              </div>
            </div>
            
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-effect border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Skills Learned</p>
                <p className="text-2xl font-bold text-white">{user.currentSkills.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-effect border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Skills to Learn</p>
                <p className="text-2xl font-bold text-white">{user.skillGaps.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-effect border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Bookmarked</p>
                <p className="text-2xl font-bold text-white">{bookmarkedResources.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-effect border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{getProgressPercentage()}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="roadmap" className="space-y-6">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="roadmap" className="data-[state=active]:bg-white/20 text-white">
                Learning Roadmap
              </TabsTrigger>
              <TabsTrigger value="skill-tests" className="data-[state=active]:bg-white/20 text-white">
                Skill Tests
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-white/20 text-white">
                All Resources
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="data-[state=active]:bg-white/20 text-white">
                Bookmarks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roadmap" className="space-y-6">
              <Card className="glass-effect border-white/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Your Learning Progress</h2>
                <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  />
                </div>
                <p className="text-white/70">
                  You've mastered {user.currentSkills.length} out of {user.requiredSkills.length} required skills
                </p>
              </Card>

              {user.skillGaps.length > 0 && (
                <Card className="glass-effect border-white/20 p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Skills to Focus On
                  </h3>
                  <div className="grid gap-4">
                    {user.skillGaps.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <h4 className="text-white font-medium mb-3">{skill}</h4>
                        <div className="grid gap-2">
                          {getResourcesForSkill(skill).map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">{resource.title}</p>
                                  <p className="text-white/60 text-xs">{resource.type} • {resource.duration}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleBookmark(resource.id)}
                                  className="text-white hover:bg-white/10"
                                >
                                  {bookmarkedResources.includes(resource.id) ? (
                                    <BookmarkCheck className="w-4 h-4" />
                                  ) : (
                                    <Bookmark className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleComplete(resource.id)}
                                  className="text-white hover:bg-white/10"
                                >
                                  <CheckCircle className={`w-4 h-4 ${completedResources.includes(resource.id) ? 'text-green-400' : ''}`} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="skill-tests" className="space-y-6">
              <Card className="glass-effect border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Assess Your Skills
                </h3>
                <p className="text-white/70 mb-6">
                  Take these short MCQ tests to understand your current knowledge level for skills relevant to your chosen career path.
                  The results will help you identify areas to focus on.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.requiredSkills.map((skill) => (
                    <SkillTest
                      key={skill}
                      skill={skill}
                      onTestComplete={handleTestComplete}
                      lastResult={testResults[skill]}
                      mockResources={mockResources}
                    />
                  ))}
                </div>
              </Card>
            </TabsContent>


            <TabsContent value="resources" className="space-y-6">
              <Card className="glass-effect border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">All Learning Resources</h3>
                <div className="grid gap-4">
                  {getAllResources().map((resource) => (
                    <motion.div
                      key={resource.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{resource.title}</p>
                          <p className="text-white/60 text-sm">{resource.type} • {resource.duration} • {resource.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleBookmark(resource.id)}
                          className="text-white hover:bg-white/10"
                        >
                          {bookmarkedResources.includes(resource.id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleComplete(resource.id)}
                          className="text-white hover:bg-white/10"
                        >
                          <CheckCircle className={`w-4 h-4 ${completedResources.includes(resource.id) ? 'text-green-400' : ''}`} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-6">
              <Card className="glass-effect border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Your Bookmarked Resources
                </h3>
                {getBookmarkedResourcesList().length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No bookmarked resources yet</p>
                    <p className="text-white/40 text-sm">Start bookmarking resources to see them here</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {getBookmarkedResourcesList().map((resource) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{resource.title}</p>
                            <p className="text-white/60 text-sm">{resource.type} • {resource.duration} • {resource.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleComplete(resource.id)}
                            className="text-white hover:bg-white/10"
                          >
                            <CheckCircle className={`w-4 h-4 ${completedResources.includes(resource.id) ? 'text-green-400' : ''}`} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
