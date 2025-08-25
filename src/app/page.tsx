'use client';

import { useState, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import OptionalColumns from '@/components/OptionalColumns';
import CustomColumns from '@/components/CustomColumns'; // Import CustomColumns

// Dynamically import the ExcelButton component with SSR turned off
const DynamicExcelButton = dynamic(() => import('@/components/ExcelButton'), {
  ssr: false,
  loading: () => <button className="px-8 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-lg cursor-not-allowed">読み込み中...</button>
});

interface CustomColumn {
  id: number;
  name: string;
  type: 'text' | 'select';
  options?: string; // Comma-separated for select type
}

export default function Home() {
  const [optionalColumns, setOptionalColumns] = useState({
    prefecture: false,
    address: false,
    email: false,
    inflowDate: false,
    inflowSource: false,
    listName: false,
    officeName: false,
    subIndustry: false,
    remarks: false,
    contactTitle: false,
  });

  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]); // New state for custom columns

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
            <h2 className="text-2xl font-semibold text-black border-b pb-3">必須項目</h2>
            <p className="text-sm text-black mt-2">下記はリードに定められた最低定義になります。略称は使わないでください　例：✗㈱　◯株式会社</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-slate-100 rounded-md text-black">顧客法人名</div>
              <div className="p-3 bg-slate-100 rounded-md text-black">担当者名（姓）</div>
              <div className="p-3 bg-slate-100 rounded-md text-black">担当者名（名）</div>
              <div className="p-3 bg-slate-100 rounded-md text-black">電話番号</div>
              <div className="p-3 bg-slate-100 rounded-md text-black">業種</div>
            </div>
          </section>

          <OptionalColumns columns={optionalColumns} onChange={handleOptionalColumnChange} />

          {/* Render CustomColumns component */}
          <CustomColumns customColumns={customColumns} setCustomColumns={setCustomColumns} />
          
          <section className="p-6 bg-white rounded-lg shadow">
             <h2 className="text-lg font-semibold text-black">現在の選択状況（確認用）</h2>
             <pre className="text-xs bg-gray-100 p-4 rounded-md mt-2 text-black">
               {JSON.stringify(optionalColumns, null, 2)}
             </pre>
             <h2 className="text-lg font-semibold text-black mt-4">現在のオリジナル項目（確認用）</h2>
             <pre className="text-xs bg-gray-100 p-4 rounded-md mt-2 text-black">
               {JSON.stringify(customColumns, null, 2)}
             </pre>
          </section>

          <section className="text-center mt-12">
            <DynamicExcelButton optionalColumns={optionalColumns} customColumns={customColumns} />
          </section>

          {/* --- マニュアルセクション --- */}
          <section className="p-6 bg-white rounded-lg shadow mt-10">
            <h2 className="text-2xl font-semibold text-black border-b pb-3">使い方マニュアル</h2>
            <div className="space-y-4 mt-4 text-black">
              <p>このツールは、Excelの顧客管理フォーマットを簡単に作成するためのものです。</p>
              
              <h3 className="text-xl font-semibold text-black">1. 項目の選択・追加</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>「<strong>追加項目</strong>」セクションで、Excelに含めたい項目にチェックを入れてください。</li>
                <li>「<strong>オリジナル項目</strong>」セクションでは、「＋項目を追加」ボタンで自由に新しい項目を作成できます。</li>
                <li>項目名を入力し、「自由入力」か「プルダウン」を選択してください。</li>
                <li>「プルダウン」を選択した場合、「選択肢（カンマ区切り）」に、プルダウンで表示させたい項目をカンマ（,）で区切って入力してください。（例：<code>男性,女性,その他</code>）</li>
              </ul>

              <h3 className="text-xl font-semibold text-black">2. Excelファイルの生成</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>必要な項目を全て選択・設定したら、「<strong>Excelフォーマットを生成</strong>」ボタンをクリックしてください。</li>
                <li>設定された内容でExcelファイルがダウンロードされます。</li>
              </ul>

              <h3 className="text-xl font-semibold text-black">3. 生成されたExcelファイルについて</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>ダウンロードされるExcelファイルには、主に2つのシートが含まれます。</li>
                <li><strong>「顧客リスト」シート</strong>：これがメインのフォーマットシートです。1行目に項目名、2行目に例のデータが入力されています。</li>
                <li><strong>「_ValidationLists」シート</strong>：プルダウンの選択肢が格納されているシートです。通常は直接編集する必要はありません。</li>
              </ul>

              <h3 className="text-xl font-semibold text-black">4. Excelでのプルダウン設定（手動）</h3>
              <p>「オリジナル項目」で「プルダウン」を選択した項目は、Excel側で手動で設定が必要です。</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>プルダウンを設定したいセル（例：<code>顧客リスト</code>シートの<code>C2</code>セルから<code>C100</code>セルまで）を選択します。</li>
                <li>Excelのリボンメニューから「<strong>データ</strong>」タブをクリックします。</li>
                <li>「<strong>データツール</strong>」グループにある「<strong>データの入力規則</strong>」をクリックします。</li>
                <li>「データの入力規則」ダイアログボックスが開きます。</li>
                <li>「<strong>設定</strong>」タブで、「<strong>入力値の種類</strong>」を「<strong>リスト</strong>」に設定します。</li>
                <li>「<strong>元の値</strong>」の欄に、以下のように入力します。（例は<code>_ValidationLists</code>シートの<code>C</code>列に選択肢がある場合）<br/>
                    <code>=&apos;_ValidationLists&apos;!$C$1:$C$N</code><br/>
                    （<code>N</code>は選択肢の最終行番号です。<code>_ValidationLists</code>シートを確認して、正しい列と行の範囲を指定してください。）
                </li>
                <li>「<strong>OK</strong>」をクリックします。</li>
              </ol>
              <p className="mt-4">これで、選択したセルにプルダウンが設定されます。</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}