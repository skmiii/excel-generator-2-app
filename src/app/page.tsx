export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16 bg-gray-50">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Excel フォーマットジェネレーター</h1>
          <p className="text-gray-600 mt-2">必要な項目を選択・追加して、オリジナルのExcelフォーマットを作成します。</p>
        </header>

        <div className="space-y-10">
          {/* --- 必須項目 --- */}
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

          {/* --- 追加項目 --- */}
          <section className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3">追加項目</h2>
            <p className="text-sm text-gray-500 mt-2">含めたい項目にチェックを入れてください。</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <label className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>県域</span>
              </label>
              <label className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>住所</span>
              </label>
              <label className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>メールアドレス</span>
              </label>
              <label className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>流入日</span>
              </label>
              <label className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>流入元</span>
              </label>
              <label className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>リスト名</span>
              </label>
            </div>
          </section>

          {/* --- オリジナル項目 --- */}
          <section className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3">オリジナル項目</h2>
            <p className="text-sm text-gray-500 mt-2">自由な項目を追加します。</p>
            <div className="mt-4">
              {/* ここに項目追加のUIが将来的に入ります */}
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                ＋項目を追加
              </button>
            </div>
          </section>

          {/* --- 生成ボタン --- */}
          <section className="text-center mt-12">
            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
              Excelフォーマットを生成
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
