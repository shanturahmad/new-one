import React from 'react';
import { Member } from '../types';
import { User, CreditCard, Hash, Phone, MapPin, School } from 'lucide-react';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row">
      {/* Image Section */}
      <div className="sm:w-48 h-48 sm:h-auto bg-gray-100 relative flex-shrink-0">
        <img 
            src={member.photoUrl} 
            alt={member.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
                // Fallback if image fails or is empty
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=random&size=256`;
            }}
        />
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{member.fullName}</h3>
          <div className="flex items-center text-sm text-blue-600 font-medium bg-blue-50 w-fit px-2 py-1 rounded-md mt-2">
             <CreditCard className="w-3 h-3 ml-1" />
             {member.role || 'عضو'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
            <div className="flex items-center">
                <Hash className="w-4 h-4 ml-2 text-gray-400" />
                <span className="font-semibold ml-1">الهوية:</span>
                <span className="font-mono text-gray-800">{member.nationalId}</span>
            </div>
            
            {member.phoneNumber && (
                <div className="flex items-center">
                    <Phone className="w-4 h-4 ml-2 text-gray-400" />
                    <span className="font-semibold ml-1">الجوال:</span>
                    <span className="font-mono dir-ltr">{member.phoneNumber}</span>
                </div>
            )}

            {member.region && (
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 ml-2 text-gray-400" />
                    <span>{member.region}</span>
                </div>
            )}

            {member.university && (
                 <div className="flex items-center">
                    <School className="w-4 h-4 ml-2 text-gray-400" />
                    <span>{member.university}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;