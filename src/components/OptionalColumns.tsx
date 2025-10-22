'use client';

import { ChangeEvent } from 'react';
import { COLUMN_LABELS } from '@/lib/constants';

// Defines the shape of the state object for optional columns
interface OptionalColumnsState {
  [key: string]: boolean;
}

// Defines the props that this component accepts
interface OptionalColumnsProps {
  columns: OptionalColumnsState;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function OptionalColumns({ columns, onChange }: OptionalColumnsProps) {
  return (
    <section className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-black border-b pb-3">追加項目</h2>
      <p className="text-sm text-black mt-2">含めたい項目にチェックを入れてください。</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {Object.keys(COLUMN_LABELS).map((key) => (
          <label key={key} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              name={key}
              checked={columns[key]}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-black">{COLUMN_LABELS[key]}</span>
          </label>
        ))}