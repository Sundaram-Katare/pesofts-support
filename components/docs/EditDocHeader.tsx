"use client";

import React from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EditDocHeaderProps {
  isSaving: boolean;
  onCancel: () => void;
  onSave: (e: React.FormEvent) => void;
}

export const EditDocHeader: React.FC<EditDocHeaderProps> = ({
  isSaving,
  onCancel,
  onSave,
}) => {
  return (
    <div className="flex justify-between items-center pb-6 border-b border-pesofts-gray-100 mb-8 select-none">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
          Admin Studio
        </span>
        <h1 className="text-2xl font-black text-pesofts-gray-900 tracking-tight">
          Edit Document
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="flex items-center font-bold text-xs"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center font-bold text-xs"
        >
          {isSaving ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
          ) : (
            <Save className="w-3.5 h-3.5 mr-1" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
