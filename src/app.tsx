import { useEffect, useState } from 'preact/hooks'
import './app.css'

// 使用する色名
const COLORS = [
  '赤',
  '青',
  '緑',
  '黄',
]

// 色名とカラーコ―ドのマッピング
const COLOR_MAP: Record<typeof COLORS[number], string> = {
  '赤': '#ff0000',
  '青': '#0000ff',
  '緑': '#00ff00',
  '黄': '#ffff00',
}

const GAME_TIME_LIMIT = 60 // ゲームの制限時間（秒）

type GameMode = 'color' | 'text'

export function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [mode, setMode] = useState<GameMode | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_LIMIT)
  const [displayText, setDisplayText] = useState('')
  const [displayColor, setDisplayColor] = useState('')
  const [result, setResult] = useState<boolean | null>(null)  // 正解・不正解

  // ゲーム開始
  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode)
    setGameStarted(true)
  }

  // 新しい問題を生成
  const generateNewChallenge = () => {
    const randomText = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setDisplayText(randomText);
    setDisplayColor(randomColor);
  };

  // ゲーム開始時にタイマーをセット
  useEffect(() => {
    if (!gameStarted) return

    setScore(0)
    setTimeLeft(GAME_TIME_LIMIT)

    // 最初の問題を生成
    generateNewChallenge()

    // 1秒ごとに時間を減らすタイマー
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 時間になったらゲーム終了
          clearInterval(timer)
          setGameStarted(false)
          setMode(null)
          alert(`ゲーム終了。スコアは ${score} 点です。`)
          return GAME_TIME_LIMIT
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted])

  // ゲーム画面
  if (gameStarted && mode) {
    return (
      <>
        <div class="min-h-screen bg-blue-50 flex items-center justify-center p-8">
          <div class="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div class="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
              <div class="flex justify-between items-center">
                <div class="flex gap-6 sm:gap-8 items-center">
                  <div class="text-center">
                    <div class="text-xs text-gray-500 mb-1">スコア</div>
                    <div class="text-2xl sm:text-3xl font-bold text-blue-600">{score}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-500 mb-1">残り時間</div>
                    <div class={`text-2xl sm:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                      {timeLeft}秒
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500 mb-1">モード</div>
                  <div class="font-bold text-gray-800">
                    {mode === 'color' ? '色を答える' : '文字を答える'}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center my-12 rounded-2xl relative">
              <div
                class="text-8xl md:text-9xl font-black text-center w-full"
                style={{ color: COLOR_MAP[displayColor] }}
              >
                {displayText}
              </div>

              {result !== null && (
                <div class="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div class={`text-center py-2 px-6 rounded-lg font-bold text-lg sm:text-xl ${
                    result
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {result ? '⭕ 正解!' : '❌ 不正解'}
                  </div>
                </div>
              )}
            </div>

            <div class="grid grid-cols-2 gap-6 max-w-sm mx-auto">
              {COLORS.map(color => (
                <button
                  key={color}
                  class="aspect-square text-xl sm:text-2xl font-bold rounded-xl border-4 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ borderColor: COLOR_MAP[color], color: COLOR_MAP[color] }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
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
