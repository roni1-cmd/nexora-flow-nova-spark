
import React from 'react';
import { X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback className="bg-purple-600 text-white text-lg">
              {user.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-lg font-medium text-white mb-1">{user.displayName}</h3>
          <p className="text-gray-400 text-sm mb-6">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
