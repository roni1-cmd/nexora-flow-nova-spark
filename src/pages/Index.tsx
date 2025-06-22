
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-950">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex items-center p-4 border-b border-gray-800 md:hidden">
            <SidebarTrigger className="text-white hover:bg-gray-800" />
            <span className="ml-2 font-semibold text-white">Nexora</span>
          </div>
          <div className="flex-1">
            <ChatInterface />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
