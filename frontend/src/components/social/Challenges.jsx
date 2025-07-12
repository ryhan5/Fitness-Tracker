import React, { useState, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import ChallengeCard from './ChallengeCard';
import ChallengeFilters from './ChallengeFilters';
import CreateChallengeModal from './CreateChallengeModal';
import { Plus, Trophy, Users, Target } from 'lucide-react';

const Challenges = () => {
  const {
    challenges,
    userChallenges,
    loading,
    error,
    getAvailableChallenges,
    getUserChallenges,
    joinChallenge,
    clearError
  } = useSocial();

  const [activeTab, setActiveTab] = useState('available');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    difficulty: ''
  });

  useEffect(() => {
    if (activeTab === 'available') {
      getAvailableChallenges(filters);
    } else {
      getUserChallenges(activeTab);
    }
  }, [activeTab, filters]);

  const handleJoinChallenge = async (challengeId) => {
    try {
      await joinChallenge(challengeId);
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const tabs = [
    { id: 'available', label: 'Available', icon: Target },
    { id: 'active', label: 'Active', icon: Users },
    { id: 'completed', label: 'Completed', icon: Trophy }
  ];

  const getDisplayChallenges = () => {
    return activeTab === 'available' ? challenges : userChallenges;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Challenges</h1>
          <p className="text-gray-600">Join challenges and compete with friends</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Challenge
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters - only show for available challenges */}
      {activeTab === 'available' && (
        <ChallengeFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Challenges Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayChallenges().map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onJoin={handleJoinChallenge}
              isUserChallenge={activeTab !== 'available'}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && getDisplayChallenges().length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No challenges found
          </h3>
          <p className="text-gray-600">
            {activeTab === 'available' 
              ? 'Try adjusting your filters or create a new challenge'
              : `You don't have any ${activeTab} challenges yet`
            }
          </p>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <CreateChallengeModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default Challenges;