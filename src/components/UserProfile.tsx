
import React from 'react';
import { User, Activity, Code, Zap, TrendingUp, Calendar, Clock, MessageSquare, Brain, Settings, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface UserProfileProps {
  user: {
    displayName: string;
    email: string;
    photoURL: string;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const { stats } = useUsageTracking();
  
  const accountAge = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const weeklyData = [
    { day: 'Mon', messages: 12, tokens: 2400 },
    { day: 'Tue', messages: 8, tokens: 1800 },
    { day: 'Wed', messages: 15, tokens: 3200 },
    { day: 'Thu', messages: 20, tokens: 4100 },
    { day: 'Fri', messages: 18, tokens: 3600 },
    { day: 'Sat', messages: 5, tokens: 800 },
    { day: 'Sun', messages: 3, tokens: 450 },
  ];

  const modelPreferences = [
    { name: 'nexora node-X7', value: 35, color: '#8B5CF6' },
    { name: 'nexora orion-9', value: 25, color: '#3B82F6' },
    { name: 'nexora fract-01', value: 20, color: '#10B981' },
    { name: 'nexora cryptiq-32R', value: 15, color: '#F59E0B' },
    { name: 'nexora Cortex-Cerebruc', value: 5, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="bg-gray-900 border-gray-700 flex-1">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName}
                    className="w-20 h-20 rounded-full border-2 border-purple-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">{user.displayName}</h1>
                  <p className="text-gray-400 mb-3">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-purple-600 text-white">Pro User</Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400">Active</Badge>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">Member since Jan 2024</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">Account age: <span className="text-white">{accountAge} days</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Last active: <span className="text-white">2 minutes ago</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy & Security
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">247</div>
              <p className="text-xs text-green-400">+12 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Messages Sent</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalApiCalls}</div>
              <p className="text-xs text-green-400">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Tokens Used</CardTitle>
              <Brain className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1.2M</div>
              <p className="text-xs text-blue-400">89% efficiency rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avg Session Time</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24m</div>
              <p className="text-xs text-purple-400">+3m from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line type="monotone" dataKey="messages" stroke="#8B5CF6" strokeWidth={2} name="Messages" />
                  <Line type="monotone" dataKey="tokens" stroke="#3B82F6" strokeWidth={2} name="Tokens (x100)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Model Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modelPreferences}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {modelPreferences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Usage Limits */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Usage & Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Daily Messages</span>
                  <span className="text-gray-400">78/100</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Resets in 6 hours</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Monthly Tokens</span>
                  <span className="text-gray-400">1.2M/2M</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Resets on Feb 1st</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Usage Tips</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use shorter prompts to save tokens</li>
                <li>• Clear conversation history regularly</li>
                <li>• Try different models for different tasks</li>
                <li>• Use reasoning models sparingly for complex tasks</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Started new conversation", model: "nexora node-X7", time: "2 minutes ago", type: "message" },
                { action: "Generated code snippet", model: "nexora fract-01", time: "15 minutes ago", type: "code" },
                { action: "Analyzed document", model: "nexora Cortex-Cerebruc", time: "1 hour ago", type: "analysis" },
                { action: "Created essay draft", model: "nexora orion-9", time: "3 hours ago", type: "writing" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'message' ? 'bg-blue-400' :
                    activity.type === 'code' ? 'bg-green-400' :
                    activity.type === 'analysis' ? 'bg-purple-400' : 'bg-yellow-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">using {activity.model}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
