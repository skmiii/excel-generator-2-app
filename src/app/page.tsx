'use client';

import { useState, ChangeEvent } from 'react';
import OptionalColumns from '@/components/OptionalColumns';

export default function Home() {
  const [optionalColumns, setOptionalColumns] = useState({
    prefecture: false,
    address: false,
    email: false,
    inflowDate: false,
    inflowSource: false,
    listName: false,
  });
  const [serverResponse, setServerResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionalColumnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptionalColumns(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setServerResponse(null);
    const fixedColumns = ['顧客法人名', '担当者名（姓）', '担当者名（名）', '電話番号', '業種'];
    
    try {
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fixed: fixedColumns,
          optional: optionalColumns,
        }),
      });
      
      const data = await response.json();
      setServerResponse(data);
      
      if (!response.ok) {
        throw new Error('サーバーがエラーを返しました');
      }
      
    } catch (error) {
      console.error('Excelファイルの生成に失敗しました:', error);
      setServerResponse({ error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16 bg-gray-50">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Excel フォーマットジェネレーター</h1>
          <p className="text-gray-600 mt-2">必要な項目を選択・追加して、オリジナルのExcelフォーマットを作成します。</p>
        </header>

        <div className="space-y-10">
          {/* ... (他のセクションは変更なし) ... */}
          <OptionalColumns columns={optionalColumns} onChange={handleOptionalColumnChange} />

          {/* ... */}
          <section className="p-6 bg-white rounded-lg shadow">
             <h2 className="text-lg font-semibold text-gray-700">現在の選択状況（確認用）</h2>
             <pre className="text-xs bg-gray-100 p-4 rounded-md mt-2">
               {JSON.stringify(optionalColumns, null, 2)}
             </pre>
          </section>

          {/* --- 生成ボタン --- */}
          <section className="text-center mt-12">
            <button 
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '生成中...' : 'Excelフォーマットを生成'}
            </button>
          </section>

          {/* --- API応答確認エリア --- */}
          {serverResponse && (
            <section className="p-6 bg-white rounded-lg shadow">
               <h2 className="text-lg font-semibold text-gray-700">バックエンドからの応答（確認用）</h2>
               <pre className="text-xs bg-gray-100 p-4 rounded-md mt-2">
                 {JSON.stringify(serverResponse, null, 2)}
               </pre>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
