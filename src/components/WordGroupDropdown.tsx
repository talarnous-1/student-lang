import React, { useState, useRef, useEffect } from 'react';
import { FolderPlus, Check, Plus, Folder } from 'lucide-react';
import { WordGroup, AppLanguage } from '../types';
import { playSound } from '../utils/audio';

interface WordGroupDropdownProps {
  wordId: string;
  groups: WordGroup[];
  onToggleWordInGroup: (groupId: string, wordId: string) => void;
  onOpenCreateGroupModal: () => void;
  appLang: AppLanguage;
  buttonClassName?: string;
}

export const WordGroupDropdown: React.FC<WordGroupDropdownProps> = ({
  wordId,
  groups,
  onToggleWordInGroup,
  onOpenCreateGroupModal,
  appLang,
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isEn = appLang === 'en';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containingGroups = groups.filter((g) => g.wordIds.includes(wordId));

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={
          buttonClassName ||
          `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
            containingGroups.length > 0
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`
        }
        title={isEn ? 'Add or remove from custom groups' : 'إضافة أو حذف من المجموعات'}
      >
        <FolderPlus className="w-3.5 h-3.5 text-purple-600" />
        <span>
          {containingGroups.length > 0
            ? `${containingGroups.length} ${isEn ? 'Groups' : 'مجموعات'}`
            : isEn
            ? '+ Group'
            : '+ مجموعة'}
        </span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 mt-1 w-60 rounded-2xl bg-white shadow-2xl border border-indigo-100 py-2 px-1 text-slate-800 animate-fadeIn end-0"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              {isEn ? 'Assign to Word Group:' : 'أضف هذه الكلمة لمجموعة:'}
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-0.5 px-1">
            {groups.length === 0 ? (
              <div className="text-center py-3 text-xs text-slate-400">
                {isEn ? 'No groups created yet' : 'لم تنشئ مجموعات بعد'}
              </div>
            ) : (
              groups.map((group) => {
                const isInGroup = group.wordIds.includes(wordId);
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      onToggleWordInGroup(group.id, wordId);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      isInGroup
                        ? 'bg-indigo-50 text-indigo-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{group.icon}</span>
                      <span className="truncate">{group.name}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                        isInGroup
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isInGroup && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="pt-2 mt-1 border-t border-slate-100 px-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCreateGroupModal();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isEn ? 'New Custom Group' : 'إنشاء مجموعة جديدة'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
