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

      // Extract names from custom columns
      const customColumnNames = customColumns.map(col => col.name).filter(name => name.trim() !== '');

      const headers = [...fixedColumns, ...selectedOptionalColumns, ...customColumnNames];
      const ws = XLSX.utils.aoa_to_sheet([headers]);

      // Add data validation for select type custom columns
      customColumns.forEach(col => {
        if (col.type === 'select' && col.options && col.options.trim() !== '') {
          const colIndex = headers.indexOf(col.name);
          if (colIndex !== -1) {
            const colLetter = XLSX.utils.encode_col(colIndex);
            // Apply validation from row 2 to the maximum possible row
            const sqref = `${colLetter}2:${colLetter}1048576`; 
            
            if (!ws['!dataValidations']) ws['!dataValidations'] = {};
            ws['!dataValidations'][sqref] = {
              type: 'list',
              allowBlank: true,
              formula1: col.options.trim() // Options directly in formula, removed extra quotes
            };
          }
        }
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '顧客リスト');
      XLSX.writeFile(wb, '顧客管理フォーマット.xlsx');
    } catch (error) {
      console.error("Excel generation failed:", error);
      // You could add state to show an error message to the user
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