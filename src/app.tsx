import { useState } from 'preact/hooks'
import './app.css'

type GameMode = 'color' | 'text'

export function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [mode, setMode] = useState<GameMode | null>(null)

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode)
    setGameStarted(true)
  }

  // ゲーム画面
  if (gameStarted && mode) {
    return (
      <>
        {mode === 'color' ? (
          <div class="text-2xl font-bold text-gray-800">
            色を答えるモード
          </div>
        ) : (
          <div class="text-2xl font-bold text-gray-800">
            文字を答えるモード
          </div>
        )}
      </>
    )
  }

  // ホーム画面
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
              onClick={() => startGame('color')}
              class="px-8 py-4 bg-blue-500 rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <h2 class="text-xl font-bold text-white mb-2">色を答えるモード</h2>
              <p class="text-sm text-gray-300">文字に惑わされず、文字の色を答えてください</p>
            </button>
            <button
              onClick={() => startGame('text')}
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
