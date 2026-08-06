"use client";

import React from "react";
import { User, MessageSquare, CheckCircle2 } from "lucide-react";

interface CommunityStatsCardProps {
  totalMembers: number;
  totalDiscussions: number;
  totalSolved: number;
}

export const CommunityStatsCard: React.FC<CommunityStatsCardProps> = ({
  totalMembers,
  totalDiscussions,
  totalSolved,
}) => {
  return (
    <div className="bg-black text-white rounded-2xl p-6 shadow-sm border border-black">
      <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-6">
        Community Stats
      </h3>
      <div className="space-y-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFEFE6] flex items-center justify-center text-[#E65C24] flex-shrink-0 border border-[#FFEFE6]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {totalMembers.toLocaleString()}
            </div>
            <div className="text-xs text-pesofts-gray-400 font-semibold">Members</div>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFEFE6] flex items-center justify-center text-[#E65C24] flex-shrink-0 border border-[#FFEFE6]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {totalDiscussions.toLocaleString()}
            </div>
            <div className="text-xs text-pesofts-gray-400 font-semibold">Discussions</div>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {totalSolved.toLocaleString()}
            </div>
            <div className="text-xs text-pesofts-gray-400 font-semibold">Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
};
