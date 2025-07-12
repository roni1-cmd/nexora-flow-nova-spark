
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Clock, 
  Star,
  Shield,
  Globe,
  Settings,
  ChevronRight,
  Crown,
  Award,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Mock data - in a real app this would come from your backend
  const userStats = {
    totalMessages: 1247,
    conversationsStarted: 89,
    favoriteModel: 'nexora fract-01',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date(),
    totalTokensUsed: 125640,
    averageSessionTime: '12 min',
    streak: 7,
    tier: 'Pro',
    monthlyUsage: 78, // percentage
    dailyUsage: [12, 8, 15, 22, 7, 18, 25, 11, 9, 14, 20, 16, 23, 19],
    achievements: [
      { id: 1, name: 'Early Adopter', description: 'Joined nexora in the first month', icon: Star, earned: true },
      { id: 2, name: 'Conversation Master', description: 'Started 50+ conversations', icon: MessageSquare, earned: true },
      { id: 3, name: 'Power User', description: 'Used 100k+ tokens', icon: Zap, earned: true },
      { id: 4, name: 'Streak Champion', description: 'Used nexora 7 days in a row', icon: Target, earned: true },
      { id: 5, name: 'Explorer', description: 'Tried all available models', icon: Globe, earned: false },
      { id: 6, name: 'Premium Member', description: 'Upgraded to Pro plan', icon: Crown, earned: true },
    ],
    recentActivity: [
      { action: 'Started conversation', model: 'nexora fract-01', time: '2 hours ago' },
      { action: 'Generated essay', model: 'nexora Cortex-Cerebruc', time: '1 day ago' },
      { action: 'Code analysis', model: 'nexora orion-9', time: '2 days ago' },
      { action: 'Image generation', model: 'nexora node-X7', time: '3 days ago' },
    ],
    preferences: {
      theme: 'Dark',
      defaultModel: 'nexora fract-01',
      language: 'English',
      timezone: 'UTC-8',
      notifications: true,
      autoSave: true,
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-purple-500">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback className="bg-purple-600 text-white text-2xl md:text-4xl">
              {user.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user.displayName}
              </h1>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                {userStats.tier}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <div className="text-2xl font-bold text-purple-400">{userStats.totalMessages.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Messages</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <div className="text-2xl font-bold text-blue-400">{userStats.conversationsStarted}</div>
                <div className="text-sm text-gray-400">Conversations</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <div className="text-2xl font-bold text-pink-400">{userStats.streak}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <div className="text-2xl font-bold text-green-400">{userStats.totalTokensUsed.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Tokens Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Usage Analytics */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Monthly Usage</span>
                  <span className="text-sm text-white">{userStats.monthlyUsage}% of limit</span>
                </div>
                <Progress value={userStats.monthlyUsage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{userStats.averageSessionTime}</div>
                  <div className="text-xs text-gray-400">Avg. Session</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{userStats.favoriteModel.split(' ')[1]}</div>
                  <div className="text-xs text-gray-400">Favorite Model</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{formatDate(userStats.joinDate).split(' ')[0]}</div>
                  <div className="text-xs text-gray-400">Member Since</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{formatTimeAgo(userStats.lastActive).split(' ')[0]}</div>
                  <div className="text-xs text-gray-400">Last Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-blue-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-xs">using {activity.model}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userStats.achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className={`p-4 rounded-lg border transition-all ${
                        achievement.earned 
                          ? 'bg-gray-800 border-purple-500/50 shadow-lg shadow-purple-500/10' 
                          : 'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 mt-1 ${
                          achievement.earned ? 'text-yellow-400' : 'text-gray-500'
                        }`} />
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            achievement.earned ? 'text-white' : 'text-gray-500'
                          }`}>
                            {achievement.name}
                          </h3>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-green-600 text-white text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Account Information */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-green-400" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{formatDate(userStats.joinDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan</span>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {userStats.tier}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Sessions</span>
                <span className="text-white">{userStats.conversationsStarted}</span>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-purple-400" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(userStats.preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors">
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">
                      {typeof value === 'boolean' ? (value ? 'On' : 'Off') : value}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-yellow-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
