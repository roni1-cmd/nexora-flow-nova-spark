
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { MessageSquare, Plus, History, Settings, User } from 'lucide-react';

const conversationItems = [
  {
    id: '1',
    title: 'Essay about AI',
    lastMessage: 'Write an essay about artificial intelligence...',
    timestamp: '2 hours ago'
  },
  {
    id: '2', 
    title: 'Code Review',
    lastMessage: 'Can you review this React component...',
    timestamp: '1 day ago'
  },
  {
    id: '3',
    title: 'Database Design',
    lastMessage: 'Help me design a database schema...',
    timestamp: '3 days ago'
  }
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <span className="font-semibold text-white">Nexora</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white p-3">
                    <div className="flex flex-col items-start w-full min-w-0">
                      <span className="font-medium truncate w-full text-left text-sm">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500 truncate w-full text-left">
                        {item.lastMessage}
                      </span>
                      <span className="text-xs text-gray-600 mt-1">
                        {item.timestamp}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white">
                  <History className="w-4 h-4 mr-2" />
                  Chat History
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
