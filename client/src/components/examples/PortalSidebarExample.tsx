import { useState } from 'react';
import PortalSidebar from '../PortalSidebar';

export default function PortalSidebarExample() {
  const [activeTab, setActiveTab] = useState('content');
  
  return (
    <PortalSidebar 
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
