import { Settings as SettingsIcon, User, Building, Palette, Save, RotateCcw, Shield, Bell, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { CompanySettings } from './CompanySettings';
import { useState } from 'react';

export function Settings() {
  const { theme, setTheme } = useAuth();
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanySettings />;
      
      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance Settings
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Theme Preference</label>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                           ${theme === 'light' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                >
                  <Sun size={24} className={theme === 'light' ? 'text-violet-600' : 'text-gray-400'} />
                  <span className={`font-medium text-sm ${theme === 'light' ? 'text-violet-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Light
                  </span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                           ${theme === 'dark' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                >
                  <Moon size={24} className={theme === 'dark' ? 'text-violet-600' : 'text-gray-400'} />
                  <span className={`font-medium text-sm ${theme === 'dark' ? 'text-violet-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Dark
                  </span>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                           ${theme === 'system' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                >
                  <Monitor size={24} className={theme === 'system' ? 'text-violet-600' : 'text-gray-400'} />
                  <span className={`font-medium text-sm ${theme === 'system' ? 'text-violet-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    System
                  </span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
      case 'notifications':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="mb-4">
              {activeTab === 'security' ? (
                <Shield size={48} className="mx-auto text-gray-400" />
              ) : (
                <Bell size={48} className="mx-auto text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {activeTab === 'security' ? 'Security Settings' : 'Notification Settings'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'security' 
                ? 'Security settings will be implemented here.' 
                : 'Notification preferences will be implemented here.'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-violet-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your DDAS experience and manage preferences</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-xl shadow-lg">
          <SettingsIcon size={32} className="text-white" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                         ${activeTab === tab.id
                           ? 'border-violet-500 text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400'
                           : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                         }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {renderTabContent()}
        
        {/* Action Buttons for non-company tabs */}
        {activeTab !== 'company' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300
                               hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2
                               hover:border-gray-400 dark:hover:border-gray-500">
                <RotateCcw size={20} />
                Reset to Defaults
              </button>
              <button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 
                               text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 
                               flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
