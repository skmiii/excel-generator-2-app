'use client';

import { useState, ChangeEvent } from 'react';
import OptionalColumns from '@/components/OptionalColumns';
import * as XLSX from 'xlsx';

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

  const handleGenerateClick = () => {
    // 1. ヘッダー（列名）のリストを作成する
    const fixedColumns = ['顧客法人名', '担当者名（姓）', '担当者名（名）', '電話番号', '業種'];
    const optionalColumnLabels: { [key: string]: string } = {
      prefecture: '県域',
      address: '住所',
      email: 'メールアドレス',
      inflowDate: '流入日',
      inflowSource: '流入元',
      listName: 'リスト名',
    };

    const selectedOptionalColumns = Object.keys(optionalColumns)
      .filter(key => optionalColumns[key as keyof typeof optionalColumns])
      .map(key => optionalColumnLabels[key]);

    const headers = [...fixedColumns, ...selectedOptionalColumns];

    // 2. Excelのワークシートを作成する
    // ヘッダーだけの空のワークシート
    const ws = XLSX.utils.aoa_to_sheet([headers]);

    // 3. 新しいワークブックを作成し、ワークシートを追加する
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '顧客リスト');

    // 4. ファイルを生成してダウンロードさせる
    XLSX.writeFile(wb, '顧客管理フォーマット.xlsx');
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
            <button 
              onClick={handleGenerateClick}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Excelフォーマットを生成
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}