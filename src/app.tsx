import { useEffect, useState } from 'preact/hooks'
import './app.css'

// 使用する色名
const COLORS = [
  '赤',
  '青',
  '緑',
  '黄',
]

// 色名とカラーコードのマッピング
const COLOR_MAP: Record<typeof COLORS[number], string> = {
  '赤': '#e53935',
  '青': '#1565c0',
  '緑': '#388e3c',
  '黄': '#fbc02d',
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
  const [disabled, setDisabled] = useState(false) // 回答ボタンの無効化
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null) // ゲーム開始前のカウントダウン

  // ゲーム開始
  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode)
    setCountdown(3)
    setDisabled(true)
  }

  // 新しい問題を生成
  const generateNewChallenge = () => {
    const randomText = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setDisplayText(randomText);
    setDisplayColor(randomColor);
  };

  // 回答処理
  const handleAnswer = (answer: string) => {
    if (result !== null) return; // 結果表示中は無効化

    setDisabled(true);

    const correctAnswer = mode === 'color' ? displayColor : displayText;

    if (answer === correctAnswer) {
      setScore((prev) => prev + 1);
      setResult(true);
    } else {
      setResult(false);
    }
    setTotalAnswers((prev) => prev + 1);

    // 次の問題を表示
    // 若干遅延させて結果を見せる
    setTimeout(() => {
      setResult(null);
      generateNewChallenge();
      setDisabled(false);
    }, 500);
  }

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
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted])

  // ゲーム開始前のカウントダウン
  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      setCountdown(null)
      setGameStarted(true)
      generateNewChallenge()
      setDisabled(false)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  // ゲーム画面表示判定
  // ゲームが開始されているか、カウントダウン中であること
  const isGameScreenVisible = (gameStarted || countdown !== null) && mode !== null && timeLeft > 0;

  // ゲーム画面
  if (isGameScreenVisible) {
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

            <div class="flex items-center justify-center mb-12 rounded-2xl relative">
              {result !== null && (
                <div class="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div class={`text-center py-2 px-6 rounded-lg font-bold text-lg sm:text-xl ${
                    result
                      ? 'border border-green-500 text-green-500 bg-green-500/20'
                      : 'border border-red-500 text-red-500 bg-red-500/20'
                  }`}>
                    {result ? '⭕ 正解!' : '❌ 不正解'}
                  </div>
                </div>
              )}

              <div class="mt-8">
                {countdown !== null ? (
                  <div class="text-gray-600 text-6xl sm:text-8xl font-black">
                    {countdown}
                  </div>
                ) : (
                  <div
                    class="text-8xl md:text-9xl font-black text-center w-full"
                    style={{ color: COLOR_MAP[displayColor] }}
                  >
                    {displayText}
                  </div>
                )}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6 max-w-sm mx-auto">
              {COLORS.map(color => (
                <button
                  key={color}
                  class="aspect-square text-xl sm:text-2xl font-bold rounded-xl border-4 shadow-lg flex items-center justify-center transition-all disabled:opacity-40 enabled:hover:scale-105 disabled:enabled:active:scale-95 enabled:cursor-pointer"
                  style={{ borderColor: COLOR_MAP[color], color: COLOR_MAP[color] }}
                  disabled={disabled || result !== null}
                  onClick={() => handleAnswer(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div class="absolute top-4 right-4">
            <button
              onClick={() => {
                setGameStarted(false)
                setMode(null)
                setScore(0)
                setTimeLeft(GAME_TIME_LIMIT)
                setTotalAnswers(0)
              }}
              class="px-4 py-2 text-sm text-gray-500 bg-white/50 rounded-lg shadow-lg hover:bg-white hover:text-gray-700 transition-all border border-gray-300 cursor-pointer"
            >
              終了
            </button>
          </div>
        </div>
      </>
    )
  }

  // ゲーム結果画面
  if (timeLeft === 0) {
    const accuracy = totalAnswers > 0 ? Math.round((score / totalAnswers) * 100) : 0;
    const avgTimePerAnswer = totalAnswers > 0 ? (GAME_TIME_LIMIT / totalAnswers).toFixed(1) : '0';
    return (
      <div class="min-h-screen bg-blue-50 flex items-center justify-center p-8">
        <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 space-y-8 text-center">
          <h1 class="text-5xl font-bold text-gray-800">終了！</h1>

          <div class="text-gray-600 text-lg">
            モード: <span class="font-bold">{mode === 'color' ? '色を答える' : '文字を答える'}</span>
          </div>

          <div class="bg-blue-400 rounded-xl p-10">
            <div class="text-white text-2xl mb-3">正解数</div>
            <div class="text-8xl font-bold text-white">{score}</div>
            <div class="text-white text-xl mt-3">/ {totalAnswers}問</div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-green-50 rounded-xl p-6 border border-green-200">
              <div class="text-green-600 text-sm font-semibold mb-2">正解率</div>
              <div class="text-4xl font-bold text-green-700">{accuracy}%</div>
            </div>
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div class="text-blue-600 text-sm font-semibold mb-2">平均回答時間</div>
              <div class="text-4xl font-bold text-blue-700">{avgTimePerAnswer}秒</div>
            </div>
            <div class="bg-red-50 rounded-xl p-6 border border-red-200">
              <div class="text-red-600 text-sm font-semibold mb-2">不正解</div>
              <div class="text-4xl font-bold text-red-700">{totalAnswers - score}問</div>
            </div>
          </div>

          <button
            onClick={() => {
              setTimeLeft(GAME_TIME_LIMIT)
              setScore(0)
              setTotalAnswers(0)
              setMode(null)
              setGameStarted(false)
            }}
            class="mt-6 px-8 py-4 bg-blue-500 rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg text-white font-bold cursor-pointer"
          >
            ホームに戻る
          </button>
        </div>
      </div>
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
