
import React from 'react';
import { User, Activity, Code, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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

  return (
    <div className="p-6 bg-black text-white max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <img 
          src={user.photoURL} 
          alt={user.displayName}
          className="w-16 h-16 rounded-full border-2 border-purple-500"
        />
        <div>
          <h1 className="text-2xl font-semibold text-white">{user.displayName}</h1>
          <p className="text-gray-400">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-500">Active User</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total API Calls</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalApiCalls}</div>
            <p className="text-xs text-gray-400">
              Since account creation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Model Usage</CardTitle>
            <Code className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalModelUsage}</div>
            <p className="text-xs text-gray-400">
              Total sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgDailyUsage}</div>
            <p className="text-xs text-gray-400">
              API calls per day
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.usageData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Usage Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="apiCalls" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="API Calls"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="modelUsage" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Model Usage"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {stats.modelUsageData.length > 0 && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Model Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.modelUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="model" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="usage" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Usage Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Daily API Calls</span>
              <span className="text-gray-400">{stats.totalApiCalls}/1000</span>
            </div>
            <Progress value={(stats.totalApiCalls / 1000) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Monthly Model Usage</span>
              <span className="text-gray-400">{stats.totalModelUsage}/500</span>
            </div>
            <Progress value={(stats.totalModelUsage / 500) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
