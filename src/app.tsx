import './app.css'

export function App() {
  return (
    <>
      <div class="min-h-screen bg-blue-50 flex items-center justify-center p-8">
        {/* TODO: ロゴ */}
        <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <h1 class="text-4xl font-bold text-center text-gray-800 mb-12">
            ストループ効果 脳トレ
          </h1>
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <button
              class="px-8 py-4 bg-blue-500 rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <h2 class="text-xl font-bold text-white mb-2">色を答えるモード</h2>
              <p class="text-sm text-gray-300">文字に惑わされず、文字の色を答えてください</p>
            </button>
            <button
              class="px-8 py-4 bg-purple-500 rounded-xl hover:bg-purple-600 transform hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <h2 class="text-xl font-bold text-white mb-2">文字を答えるモード</h2>
              <p class="text-sm text-gray-300">色に惑わされず、文字を答えてください</p>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
