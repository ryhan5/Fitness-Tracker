// import React from 'react';
// import { Calendar, Users, Trophy, Target, Clock } from 'lucide-react';

// const ChallengeCard = ({ challenge, onJoin, isUserChallenge }) => {
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return 'bg-green-100 text-green-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'hard': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold text-gray-900 mb-1">
//             {challenge.title}
//           </h3>
//           <p className="text-gray-600 text-sm line-clamp-2">
//             {challenge.description}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2 ml-4">
//           {challenge.difficulty && (
//             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
//               {challenge.difficulty}
//             </span>
//           )}
//           {isUserChallenge && challenge.status && (
//             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(challenge.status)}`}>
//               {challenge.status}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Users size={16} />
//           <span>{challenge.participantCount || 0} participants</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Trophy size={16} />
//           <span>{challenge.points || 0} points</span>
//         </div>
//         {challenge.category && (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Target size={16} />
//             <span className="capitalize">{challenge.category}</span>
//           </div>
//         )}
//         {challenge.type && (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Clock size={16} />
//             <span className="capitalize">{challenge.type}</span>
//           </div>
//         )}
//       </div>

//       {/* Dates */}
//       <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
//         {challenge.startDate && (
//           <div className="flex items-center gap-1">
//             <Calendar size={14} />
//             <span>Starts {formatDate(challenge.startDate)}</span>
//           </div>
//         )}
//         {challenge.endDate && (
//           <div className="flex items-center gap-1">
//             <Calendar size={14} />
//             <span>Ends {formatDate(challenge.endDate)}</span>
//           </div>
//         )}
//       </div>

//       {/* Progress Bar for User Challenges */}
//       {isUserChallenge && challenge.progress !== undefined && (
//         <div className="mb-4">
//           <div className="flex justify-between text-sm text-gray-600 mb-1">
//             <span>Progress</span>
//             <span>{challenge.progress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${challenge.progress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {/* Action Button */}
//       <div className="flex justify-between items-center">
//         <div className="text-sm text-gray-500">
//           {challenge.createdBy && (
//             <span>by {challenge.createdBy.name || challenge.createdBy}</span>
//           )}
//         </div>
//         {!isUserChallenge && (
//           <button
//             onClick={() => onJoin(challenge._id)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//           >
//             Join Challenge
//           </button>
//         )}
//         {isUserChallenge && challenge.status === 'active' && (
//           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//             View Details
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChallengeCard;

import React from 'react';
import { Calendar, Users, Trophy, Target, Clock } from 'lucide-react';

const ChallengeCard = ({ challenge, onJoin, isUserChallenge }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':   return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard':   return 'bg-red-100 text-red-800';
      default:       return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':    return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending':   return 'bg-yellow-100 text-yellow-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });
  };

  // Normalize createdBy to a string
  const renderCreator = () => {
    const creator = challenge.createdBy;

    if (!creator) return null;

    if (typeof creator === 'object') {
      // If it's an object, try .name, else fall back to its _id or toString()
      return creator.name ?? creator._id ?? String(creator);
    }

    // If it's already a primitive like string or number
    return creator;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {challenge.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {challenge.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          {challenge.difficulty && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                challenge.difficulty
              )}`}
            >
              {challenge.difficulty}
            </span>
          )}
          {isUserChallenge && challenge.status && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                challenge.status
              )}`}
            >
              {challenge.status}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{challenge.participantCount || 0} participants</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Trophy size={16} />
          <span>{challenge.points || 0} points</span>
        </div>
        {challenge.category && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target size={16} />
            <span className="capitalize">{challenge.category}</span>
          </div>
        )}
        {challenge.type && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span className="capitalize">{challenge.type}</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        {challenge.startDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Starts {formatDate(challenge.startDate)}</span>
          </div>
        )}
        {challenge.endDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Ends {formatDate(challenge.endDate)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar for User Challenges */}
      {isUserChallenge && challenge.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${challenge.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {challenge.createdBy && <span>by {renderCreator()}</span>}
        </div>

        {!isUserChallenge && (
          <button
            onClick={() => onJoin(challenge._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Join Challenge
          </button>
        )}

        {isUserChallenge && challenge.status === 'active' && (
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
