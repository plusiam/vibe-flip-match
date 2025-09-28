import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, RotateCcw, Lightbulb, Volume2, VolumeX, BookOpen, Brain, Zap } from 'lucide-react';
import GameCard from './GameCard';
import PlayerNameModal from './PlayerNameModal';
import Leaderboard from './Leaderboard';
import DifficultySelector from './DifficultySelector';
import CategorySelector from './CategorySelector';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { playSound } from '@/lib/sounds';

interface GameCard {
  id: number;
  content: string;
  matchContent: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 교육적 콘텐츠 카테고리
const LEARNING_CATEGORIES = {
  emoji: {
    name: '이모지',
    icon: '😊',
    pairs: [
      { front: '🎮', back: '🎮' },
      { front: '🎯', back: '🎯' },
      { front: '🎨', back: '🎨' },
      { front: '🎭', back: '🎭' },
      { front: '🎪', back: '🎪' },
      { front: '🎵', back: '🎵' },
      { front: '🎸', back: '🎸' },
      { front: '⚽', back: '⚽' },
      { front: '🏀', back: '🏀' },
      { front: '⚡', back: '⚡' },
      { front: '🌟', back: '🌟' },
      { front: '🔥', back: '🔥' }
    ]
  },
  math: {
    name: '수학',
    icon: '🔢',
    pairs: [
      { front: '2+2', back: '4' },
      { front: '3×3', back: '9' },
      { front: '10÷2', back: '5' },
      { front: '7-3', back: '4' },
      { front: '5×5', back: '25' },
      { front: '15÷3', back: '5' },
      { front: '8+7', back: '15' },
      { front: '6×4', back: '24' },
      { front: '20÷4', back: '5' },
      { front: '9-6', back: '3' },
      { front: '4×7', back: '28' },
      { front: '30÷6', back: '5' }
    ]
  },
  english: {
    name: '영어',
    icon: '🔤',
    pairs: [
      { front: 'cat', back: '고양이' },
      { front: 'dog', back: '개' },
      { front: 'book', back: '책' },
      { front: 'apple', back: '사과' },
      { front: 'water', back: '물' },
      { front: 'sun', back: '태양' },
      { front: 'moon', back: '달' },
      { front: 'star', back: '별' },
      { front: 'tree', back: '나무' },
      { front: 'flower', back: '꽃' },
      { front: 'house', back: '집' },
      { front: 'car', back: '자동차' }
    ]
  },
  science: {
    name: '과학',
    icon: '🔬',
    pairs: [
      { front: 'H₂O', back: '물' },
      { front: 'O₂', back: '산소' },
      { front: 'CO₂', back: '이산화탄소' },
      { front: 'NaCl', back: '소금' },
      { front: 'Fe', back: '철' },
      { front: 'Au', back: '금' },
      { front: 'Ag', back: '은' },
      { front: 'N₂', back: '질소' },
      { front: 'He', back: '헬륨' },
      { front: 'C', back: '탄소' },
      { front: 'H₂', back: '수소' },
      { front: 'Ca', back: '칼슘' }
    ]
  },
  history: {
    name: '역사',
    icon: '📚',
    pairs: [
      { front: '세종대왕', back: '한글' },
      { front: '이순신', back: '거북선' },
      { front: '광개토대왕', back: '고구려' },
      { front: '김구', back: '독립운동' },
      { front: '신사임당', back: '화가' },
      { front: '장보고', back: '해상왕' },
      { front: '정약용', back: '실학' },
      { front: '안창호', back: '도산' },
      { front: '유관순', back: '3.1운동' },
      { front: '김유신', back: '신라' },
      { front: '을지문덕', back: '살수대첩' },
      { front: '왕건', back: '고려' }
    ]
  }
};

// 난이도 설정
const DIFFICULTY_LEVELS = {
  easy: { 
    name: '쉬움', 
    pairs: 4, 
    timeBonus: 180, 
    scoreMultiplier: 1,
    icon: '😊'
  },
  medium: { 
    name: '보통', 
    pairs: 6, 
    timeBonus: 120, 
    scoreMultiplier: 1.5,
    icon: '😎'
  },
  hard: { 
    name: '어려움', 
    pairs: 8, 
    timeBonus: 90, 
    scoreMultiplier: 2,
    icon: '🔥'
  },
  expert: {
    name: '전문가',
    pairs: 10,
    timeBonus: 60,
    scoreMultiplier: 3,
    icon: '💎'
  }
};

const MemoryGame = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_LEVELS>('medium');
  const [category, setCategory] = useState<keyof typeof LEARNING_CATEGORIES>('emoji');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // 점수 계산 함수 (난이도와 연속 성공 보너스 포함)
  const calculateScore = (timeElapsed: number, movesCount: number) => {
    const diff = DIFFICULTY_LEVELS[difficulty];
    const baseScore = 1000 * diff.scoreMultiplier;
    const timeBonus = Math.max(0, diff.timeBonus - timeElapsed) * 2;
    const movePenalty = movesCount * 5;
    const streakBonus = streak * 50;
    const hintPenalty = hintsUsed * 100;
    
    return Math.max(100, Math.floor(baseScore + timeBonus - movePenalty + streakBonus - hintPenalty));
  };

  // 힌트 시스템
  const useHint = () => {
    if (hintsUsed >= 3 || gameCompleted || flippedCards.length > 0) {
      toast({
        title: "힌트 사용 불가",
        description: "이미 카드를 뒤집고 있거나 힌트를 모두 사용했습니다.",
        variant: "destructive"
      });
      return;
    }

    const unmatchedCards = cards.filter(card => !card.isMatched);
    if (unmatchedCards.length === 0) return;

    // 랜덤으로 매칭 쌍 하나 선택
    const cardPairs = new Map<string, number[]>();
    unmatchedCards.forEach(card => {
      const key = card.matchContent;
      if (!cardPairs.has(key)) {
        cardPairs.set(key, []);
      }
      cardPairs.get(key)!.push(card.id);
    });

    const pairsArray = Array.from(cardPairs.values()).filter(pair => pair.length === 2);
    if (pairsArray.length === 0) return;

    const randomPair = pairsArray[Math.floor(Math.random() * pairsArray.length)];
    
    // 힌트로 카드 잠깐 보여주기
    setCards(prevCards => 
      prevCards.map(card => 
        randomPair.includes(card.id) 
          ? { ...card, isFlipped: true } 
          : card
      )
    );

    if (soundEnabled) playSound('hint');
    
    hintTimeoutRef.current = setTimeout(() => {
      setCards(prevCards => 
        prevCards.map(card => 
          randomPair.includes(card.id) && !card.isMatched
            ? { ...card, isFlipped: false } 
            : card
        )
      );
    }, 1500);

    setHintsUsed(prev => prev + 1);
    toast({
      title: "💡 힌트 사용!",
      description: `남은 힌트: ${3 - hintsUsed - 1}개`,
    });
  };

  // 게임 초기화
  const initializeGame = () => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }

    const selectedCategory = LEARNING_CATEGORIES[category];
    const numPairs = DIFFICULTY_LEVELS[difficulty].pairs;
    
    // 카테고리에서 필요한 수만큼 쌍 선택
    const selectedPairs = selectedCategory.pairs
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);
    
    // 카드 배열 생성
    const gameCards: GameCard[] = [];
    let id = 0;
    
    selectedPairs.forEach(pair => {
      // 첫 번째 카드
      gameCards.push({
        id: id++,
        content: pair.front,
        matchContent: pair.front + pair.back,
        isFlipped: false,
        isMatched: false,
      });
      // 두 번째 카드
      gameCards.push({
        id: id++,
        content: pair.back,
        matchContent: pair.front + pair.back,
        isFlipped: false,
        isMatched: false,
      });
    });
    
    // 카드 섞기
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTime(0);
    setIsGameActive(true);
    setGameCompleted(false);
    setHintsUsed(0);
    setWrongAttempts(0);
    setStreak(0);
    
    if (soundEnabled) playSound('start');
  };

  // 새 게임 시작
  const startNewGame = () => {
    setShowNameModal(true);
  };

  const handlePlayerNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameModal(false);
    setShowCategory(true);
  };

  // 카테고리 선택 후 난이도 선택
  const handleCategorySelect = (cat: keyof typeof LEARNING_CATEGORIES) => {
    setCategory(cat);
    setShowCategory(false);
    setShowDifficulty(true);
  };

  // 난이도 선택 후 게임 시작
  const handleDifficultySelect = (diff: keyof typeof DIFFICULTY_LEVELS) => {
    setDifficulty(diff);
    setShowDifficulty(false);
    initializeGame();
  };

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !gameCompleted) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameCompleted]);

  // 카드 클릭 처리
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;

    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.isMatched) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    setCards(cards => 
      cards.map(card => 
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    if (soundEnabled) playSound('flip');

    if (newFlippedCards.length === 2) {
      setMoves(moves => moves + 1);
      
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  // 매칭 확인
  const checkForMatch = (flippedCardIds: number[]) => {
    const [first, second] = flippedCardIds;
    const firstCard = cards.find(card => card.id === first);
    const secondCard = cards.find(card => card.id === second);

    if (firstCard?.matchContent === secondCard?.matchContent) {
      // 매칭 성공
      setCards(cards => 
        cards.map(card => 
          flippedCardIds.includes(card.id) 
            ? { ...card, isMatched: true } 
            : card
        )
      );
      
      setStreak(prev => prev + 1);
      setWrongAttempts(0);
      
      // 점수 추가
      const matchScore = calculateScore(time, moves);
      const pairScore = Math.floor(matchScore / DIFFICULTY_LEVELS[difficulty].pairs);
      setScore(prevScore => prevScore + pairScore);
      
      if (soundEnabled) playSound('match');
      
      toast({
        title: `매칭 성공! ${streak > 1 ? `🔥 ${streak}연속!` : '🎉'}`,
        description: `+${pairScore}점 획득!`,
      });
    } else {
      // 매칭 실패
      setCards(cards => 
        cards.map(card => 
          flippedCardIds.includes(card.id) 
            ? { ...card, isFlipped: false } 
            : card
        )
      );
      
      setStreak(0);
      setWrongAttempts(prev => prev + 1);
      
      if (soundEnabled) playSound('wrong');
      
      // 3번 이상 틀리면 힌트 제안
      if (wrongAttempts >= 2 && hintsUsed < 3) {
        toast({
          title: "💡 힌트를 사용해보세요!",
          description: "상단의 힌트 버튼을 눌러 도움을 받을 수 있습니다.",
        });
      }
    }
    
    setFlippedCards([]);
  };

  // 게임 완료 확인
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameActive(false);
      setGameCompleted(true);
      
      // 최종 점수 계산
      const finalScore = score + calculateScore(time, moves);
      setScore(finalScore);
      
      if (soundEnabled) playSound('complete');
      
      // 데이터베이스에 저장
      saveGameRecord(finalScore);
    }
  }, [cards, score, time, moves]);

  // 게임 기록 저장
  const saveGameRecord = async (finalScore: number) => {
    try {
      const { error } = await supabase
        .from('game_records')
        .insert({
          player_name: playerName,
          score: finalScore,
          time_seconds: time,
          moves: moves,
          difficulty,
          category,
        });

      if (error) throw error;

      setLeaderboardRefresh(prev => prev + 1);
      
      const difficultyName = DIFFICULTY_LEVELS[difficulty].name;
      const categoryName = LEARNING_CATEGORIES[category].name;
      
      toast({
        title: "게임 완료! 🎊",
        description: `${difficultyName} 난이도, ${categoryName} 카테고리에서 ${finalScore.toLocaleString()}점 획득!`,
      });
    } catch (error) {
      console.error('게임 기록 저장 중 오류:', error);
    }
  };

  // 컴포넌트 마운트시 로컬 스토리지 확인
  useEffect(() => {
    const savedName = localStorage.getItem('memory-game-player-name');
    const savedSound = localStorage.getItem('memory-game-sound');
    
    setSoundEnabled(savedSound !== 'false');
    
    if (!savedName) {
      setShowNameModal(true);
    } else {
      setPlayerName(savedName);
      setShowNameModal(true);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('memory-game-sound', String(newValue));
    if (newValue) playSound('flip');
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          메모리 카드 게임
        </h1>
        <p className="text-muted-foreground">
          {category !== 'emoji' && (
            <span className="font-semibold">
              {LEARNING_CATEGORIES[category].icon} {LEARNING_CATEGORIES[category].name} 학습 모드
            </span>
          )}
        </p>
        {playerName && (
          <p className="text-sm text-primary font-semibold mt-1">
            플레이어: {playerName} | 난이도: {DIFFICULTY_LEVELS[difficulty].icon} {DIFFICULTY_LEVELS[difficulty].name}
          </p>
        )}
      </div>

      {/* 게임 통계 */}
      <Card className="game-header px-6 py-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">시간</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{moves}</div>
            <div className="text-sm text-muted-foreground">시도</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{score.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">점수</div>
          </div>
          {streak > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 flex items-center">
                <Zap className="w-5 h-5 mr-1" />
                {streak}
              </div>
              <div className="text-sm text-muted-foreground">연속</div>
            </div>
          )}
          <div className="flex gap-2 ml-4">
            <Button
              onClick={useHint}
              disabled={hintsUsed >= 3 || gameCompleted || !isGameActive}
              variant="outline"
              size="sm"
              className="hover:bg-yellow-500/20 transition-colors"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              힌트 ({3 - hintsUsed})
            </Button>
            <Button
              onClick={toggleSound}
              variant="outline"
              size="icon"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={startNewGame}
              variant="outline"
              size="sm"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              새 게임
            </Button>
            <Button 
              onClick={() => setShowLeaderboard(true)}
              variant="outline"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Trophy className="w-4 h-4 mr-1" />
              리더보드
            </Button>
          </div>
        </div>
      </Card>

      {/* 게임 보드 */}
      {cards.length > 0 && (
        <div 
          className={`grid gap-4 p-6 bg-muted/20 rounded-2xl backdrop-blur-sm game-board`}
          style={{
            gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`
          }}
        >
          {cards.map(card => (
            <GameCard
              key={card.id}
              id={card.id}
              content={card.content}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={handleCardClick}
              disabled={flippedCards.length === 2 || !isGameActive}
              category={category}
            />
          ))}
        </div>
      )}

      {/* 게임 시작 안내 */}
      {cards.length === 0 && !showNameModal && !showCategory && !showDifficulty && (
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">학습하며 즐기는 메모리 게임!</h2>
          <div className="flex gap-4 mb-4 justify-center">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-sm">다양한 학습 주제</p>
            </div>
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-2 text-accent" />
              <p className="text-sm">난이도 선택</p>
            </div>
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-success" />
              <p className="text-sm">리더보드 경쟁</p>
            </div>
          </div>
          <Button 
            onClick={startNewGame}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            size="lg"
          >
            게임 시작
          </Button>
        </Card>
      )}

      {/* 게임 완료 메시지 */}
      {gameCompleted && (
        <Card className="p-6 text-center bounce-in bg-gradient-to-r from-success/10 to-primary/10">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">축하합니다!</h2>
          <p className="text-muted-foreground mb-2">
            {DIFFICULTY_LEVELS[difficulty].name} 난이도, {LEARNING_CATEGORIES[category].name} 카테고리
          </p>
          <p className="text-muted-foreground mb-2">
            {moves}번의 시도로 {formatTime(time)}만에 게임을 완료했습니다!
          </p>
          <p className="text-xl font-bold text-primary mb-4">
            최종 점수: {score.toLocaleString()}점
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={startNewGame}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              다시 도전
            </Button>
            <Button 
              onClick={() => setShowLeaderboard(true)}
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Trophy className="w-4 h-4 mr-1" />
              리더보드 보기
            </Button>
          </div>
        </Card>
      )}

      {/* 모달들 */}
      <PlayerNameModal 
        isOpen={showNameModal}
        onClose={handlePlayerNameSubmit}
      />
      
      <CategorySelector
        isOpen={showCategory}
        onSelect={handleCategorySelect}
        categories={LEARNING_CATEGORIES}
      />
      
      <DifficultySelector
        isOpen={showDifficulty}
        onSelect={handleDifficultySelect}
        difficulties={DIFFICULTY_LEVELS}
      />
      
      <Leaderboard 
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        refreshTrigger={leaderboardRefresh}
      />
    </div>
  );
};

export default MemoryGame;