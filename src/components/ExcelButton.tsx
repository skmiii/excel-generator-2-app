'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface CustomColumn {
  id: number;
  name: string;
  type: 'text' | 'select';
  options?: string; // Comma-separated for select type
}

interface ExcelButtonProps {
  optionalColumns: { [key: string]: boolean };
  customColumns: CustomColumn[]; // Add customColumns prop
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

export default function ExcelButton({ optionalColumns, customColumns }: ExcelButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = () => {
    setIsLoading(true);
    
    try {
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

      const customColumnNames = customColumns.map(col => col.name).filter(name => name.trim() !== '');

      const headers = [...fixedColumns, ...selectedOptionalColumns, ...customColumnNames];
      const ws = XLSX.utils.aoa_to_sheet([headers]);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '顧客リスト');

      // --- プルダウン選択肢用の別シートを作成 --- 
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
          const formula1 = `'_ValidationLists'!$${validationSheetColLetter}$1:$${validationSheetColLetter}$${options.length}`;

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
        XLSX.utils.book_append_sheet(wb, validationWs, '_ValidationLists');
      }
      // --- プルダウン選択肢用の別シート作成 終わり --- 

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