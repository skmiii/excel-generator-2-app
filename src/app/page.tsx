'use client';

import { useState, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import OptionalColumns from '@/components/OptionalColumns';

// Dynamically import the ExcelButton component with SSR turned off
const DynamicExcelButton = dynamic(() => import('@/components/ExcelButton'), {
  ssr: false,
  loading: () => <button className="px-8 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-lg cursor-not-allowed">読み込み中...</button>
});

export default function Home() {
  const [optionalColumns, setOptionalColumns] = useState({
    prefecture: false,
    address: false,
    email: false,
    inflowDate: false,
    inflowSource: false,
    listName: false,
  });

  const handleOptionalColumnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptionalColumns(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16 bg-gray-50">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Excel フォーマットジェネレーター</h1>
          <p className="text-gray-600 mt-2">必要な項目を選択・追加して、オリジナルのExcelフォーマットを作成します。</p>
        </header>

        <div className="space-y-10">
          <section className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3">必須項目</h2>
            <p className="text-sm text-gray-500 mt-2">これらの項目は常にExcelに含まれます。</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-slate-100 rounded-md text-slate-800">顧客法人名</div>
              <div className="p-3 bg-slate-100 rounded-md text-slate-800">担当者名（姓）</div>
              <div className="p-3 bg-slate-100 rounded-md text-slate-800">担当者名（名）</div>
              <div className="p-3 bg-slate-100 rounded-md text-slate-800">電話番号</div>
              <div className="p-3 bg-slate-100 rounded-md text-slate-800">業種</div>
            </div>
          </section>

          <OptionalColumns columns={optionalColumns} onChange={handleOptionalColumnChange} />

          <section className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3">オリジナル項目</h2>
            <p className="text-sm text-gray-500 mt-2">自由な項目を追加します。</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                ＋項目を追加
              </button>
            </div>
          </section>
          
          <section className="p-6 bg-white rounded-lg shadow">
             <h2 className="text-lg font-semibold text-gray-700">現在の選択状況（確認用）</h2>
             <pre className="text-xs bg-gray-100 p-4 rounded-md mt-2">
               {JSON.stringify(optionalColumns, null, 2)}
             </pre>
          </section>

          <section className="text-center mt-12">
            <DynamicExcelButton optionalColumns={optionalColumns} />
          </section>
        </div>
      </div>
    </main>
  );
}
