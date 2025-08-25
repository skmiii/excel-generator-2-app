'use client';

import { useState, ChangeEvent } from 'react';

interface CustomColumn {
  id: number;
  name: string;
  type: 'text' | 'select';
  options?: string; // Comma-separated for select type
}

interface CustomColumnsProps {
  customColumns: CustomColumn[];
  setCustomColumns: React.Dispatch<React.SetStateAction<CustomColumn[]>>;
}

export default function CustomColumns({ customColumns, setCustomColumns }: CustomColumnsProps) {
  const addColumn = () => {
    setCustomColumns(prevColumns => [
      ...prevColumns,
      { id: Date.now(), name: '', type: 'text', options: '' } // Unique ID for key prop
    ]);
  };

  const updateColumn = (id: number, field: keyof CustomColumn, value: string) => {
    setCustomColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === id ? { ...col, [field]: value } : col
      )
    );
  };

  const removeColumn = (id: number) => {
    setCustomColumns(prevColumns => prevColumns.filter(col => col.id !== id));
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-black border-b pb-3">オリジナル項目</h2>
      <p className="text-sm text-gray-500 mt-2">自由な項目を追加します。</p>
      <div className="mt-4 space-y-4">
        {customColumns.map(col => (
          <div key={col.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 border rounded-md bg-gray-50">
            <input
              type="text"
              placeholder="項目名"
              value={col.name}
              onChange={(e) => updateColumn(col.id, 'name', e.target.value)}
              className="flex-grow p-2 border rounded-md w-full sm:w-auto text-black custom-placeholder-black"
            />
            <select
              value={col.type}
              onChange={(e) => updateColumn(col.id, 'type', e.target.value as 'text' | 'select')}
              className="p-2 border rounded-md text-black"
            >
              <option value="text" className="text-black">自由入力</option>
              <option value="select" className="text-black">プルダウン</option>
            </select>
            {col.type === 'select' && (
              <input
                type="text"
                placeholder="選択肢（カンマ区切り）"
                value={col.options}
                onChange={(e) => updateColumn(col.id, 'options', e.target.value)}
                className="flex-grow p-2 border rounded-md w-full sm:w-auto custom-placeholder-black"
              />
            )}
            <button
              onClick={() => removeColumn(col.id)}
              className="px-3 py-1 bg-red-500 text-black rounded-md hover:bg-red-600 text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addColumn}
        className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
      >
        ＋項目を追加
      </button>
    </section>
  );
}
