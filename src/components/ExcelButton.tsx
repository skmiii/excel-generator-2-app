'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { COLUMN_LABELS, SALES_COLUMN_LABELS } from '@/lib/constants';

interface CustomColumn {
  id: number;
  name: string;
  type: 'text' | 'select';
  options?: string; // Comma-separated for select type
}

interface ExcelButtonProps {
  optionalColumns: { [key: string]: boolean };
  customColumns: CustomColumn[]; // Add customColumns prop
  salesColumns: { [key: string]: boolean }; // Add salesColumns prop
  manualContent: string[]; // New prop for manual content
}

const JAPANESE_PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const INDUSTRY_OPTIONS = [
  "農業，林業", "漁業", "鉱業，採石業，砂利採取業", "建設業", "製造業",
  "電気・ガス・熱供給・水道業", "情報通信業", "運輸業，郵便業", "卸売業，小売業",
  "金融業，保険業", "不動産業，物品賃貸業", "学術研究，専門・技術サービス業",
  "宿泊業，飲食サービス業", "生活関連サービス業，娯楽業", "教育，学習支援業",
  "医療，福祉", "複合サービス事業", "サービス業（他に分類されないもの）",
  "公務（他に分類されるものを除く）", "分類不能の産業"
];

const EXAMPLE_DATA_MAP: { [key: string]: string } = {
  '顧客法人名': '例：株式会社アイ・ステーション',
  '担当者名（姓）': '例：山田',
  '担当者名（名）': '例：太郎',
  '電話番号': '例：09012345678',
  '業種': '例：情報通信業',
  '県域': '例：東京都',
  '住所': '例：東京都千代田区1-2-3',
  'メールアドレス': '例：example@example.com',
  '流入日': '例：2024/01/01',
  '流入元': '例：Web広告',
  'リスト名': '例：2024年新規リード',
  '事業所名': '例：東京本社',
  '小業種': '例：ソフトウェア開発',
  '備考': '例：特記事項',
  '担当者役職': '例：部長',
  'Salesforceリード': '例：https://example.salesforce.com/...',
  'Salesforce取引先': '例：https://example.salesforce.com/...',
  'ステータス_インサイド': '例：アポイント獲得',
  'ステータス_フィールド': '例：初回訪問済',
  '売上': '例：1000000',
  '粗利': '例：300000',
  '提案【商材A】': '例：提案済',
  '提案【商材B】': '例：検討中',
  '提案【商材C】': '例：未提案',
  '議事録': '例：2024年10月22日商談議事録',
};

export default function ExcelButton({ optionalColumns, customColumns, salesColumns, manualContent }: ExcelButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = () => {
    setIsLoading(true);
    
    try {
      const fixedColumns = ['顧客法人名', '担当者名（姓）', '担当者名（名）', '電話番号', '業種'];
      
      const selectedOptionalColumns = Object.keys(optionalColumns)
        .filter(key => optionalColumns[key as keyof typeof optionalColumns])
        .map(key => COLUMN_LABELS[key]);

      const selectedSalesColumns = Object.keys(salesColumns)
        .filter(key => salesColumns[key as keyof typeof salesColumns])
        .map(key => SALES_COLUMN_LABELS[key]);

      const customColumnNames = customColumns.map(col => col.name).filter(name => name.trim() !== '');

      const headers = [...fixedColumns, ...selectedOptionalColumns, ...selectedSalesColumns, ...customColumnNames];

      // --- 例の行を作成 --- 
      const exampleRow: string[] = headers.map(header => {
        if (EXAMPLE_DATA_MAP[header]) {
          return EXAMPLE_DATA_MAP[header];
        } else {
          // For custom columns not in EXAMPLE_DATA_MAP
          const customCol = customColumns.find(col => col.name === header);
          if (customCol) {
            if (customCol.type === 'select') {
              return '例：選択肢から選択';
            } else { // text type
              return '例：自由入力';
            }
          }
          return ''; // Default for unknown headers
        }
      });

      const dataForSheet = [headers, exampleRow];
      const ws = XLSX.utils.aoa_to_sheet(dataForSheet);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '顧客リスト');

      // --- プルダウン選択肢用の別シートを作成 --- 
      const VALIDATION_SHEET_NAME = '選択肢一覧'; // New sheet name
      const validationOptionsData: string[][] = [];
      let validationColIndex = 0;

      // Add fixed/optional dropdowns
      const addValidationList = (options: string[], colName: string) => {
        const colIndex = headers.indexOf(colName);
        if (colIndex !== -1) {
          // Write options to a column in the validation sheet
          for (let i = 0; i < options.length; i++) {
            if (!validationOptionsData[i]) validationOptionsData[i] = [];
            validationOptionsData[i][validationColIndex] = options[i];
          }

          const colLetter = XLSX.utils.encode_col(colIndex);
          const sqref = `${colLetter}2:${colLetter}1048576`; // Apply validation from row 2 to max row
          
          const validationSheetColLetter = XLSX.utils.encode_col(validationColIndex);
          // Updated formula1 to use new sheet name and absolute references
          const formula1 = `'${VALIDATION_SHEET_NAME}'!$${validationSheetColLetter}$1:$${validationSheetColLetter}$${options.length}`;

          console.log(`Generated formula1 for ${colName}:`, formula1);

          if (!ws['!dataValidations']) ws['!dataValidations'] = {};
          ws['!dataValidations'][sqref] = {
            type: 'list',
            allowBlank: true,
            formula1: formula1
          };
          validationColIndex++;
        }
      };

      // Add Prefecture dropdown if '県域' column exists
      if (headers.includes('県域')) {
        addValidationList(JAPANESE_PREFECTURES, '県域');
      }

      // Add Industry dropdown if '業種' column exists
      if (headers.includes('業種')) {
        addValidationList(INDUSTRY_OPTIONS, '業種');
      }

      // Add custom dropdowns
      customColumns.forEach(col => {
        if (col.type === 'select' && col.options && col.options.trim() !== '') {
          const optionsArray = col.options.split(',').map(opt => opt.trim());
          addValidationList(optionsArray, col.name);
        }
      });

      if (validationOptionsData.length > 0) {
        const validationWs = XLSX.utils.aoa_to_sheet(validationOptionsData);
        XLSX.utils.book_append_sheet(wb, validationWs, VALIDATION_SHEET_NAME);
      }
      // --- プルダウン選択肢用の別シート作成 終わり --- 

      // --- マニュアルシートを追加 --- 
      if (manualContent && manualContent.length > 0) {
        const manualWs = XLSX.utils.aoa_to_sheet(manualContent.map(line => [line]));
        XLSX.utils.book_append_sheet(wb, manualWs, '！マニュアル！');
      }
      // --- マニュアルシート追加 終わり --- 

      XLSX.writeFile(wb, '顧客管理フォーマット.xlsx');
    } catch (error) {
      console.error("Excel generation failed:", error);
      // You could add state to show an error message to show the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGenerateClick}
      disabled={isLoading}
      className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
    >
      {isLoading ? '生成中...' : 'Excelフォーマットを生成'}
    </button>
  );
}