import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, RotateCcw } from 'lucide-react';
import GameCard from './GameCard';
import PlayerNameModal from './PlayerNameModal';
import Leaderboard from './Leaderboard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GameCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎵', '🎸', '⚽'];

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
  const { toast } = useToast();

  // 점수 계산 함수
  const calculateScore = (timeElapsed: number, moves: number) => {
    const baseScore = 1000; // 기본 점수
    const timeBonus = Math.max(0, 300 - timeElapsed); // 시간 보너스 (5분 이내)
    const movePenalty = moves * 5; // 시도 횟수 패널티
    const matchBonus = 100; // 매칭 보너스
    
    return Math.max(100, baseScore + timeBonus - movePenalty + matchBonus);
  };

  // 게임 초기화
  const initializeGame = () => {
    const cardPairs = [...CARD_EMOJIS, ...CARD_EMOJIS];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTime(0);
    setIsGameActive(true);
    setGameCompleted(false);
  };

  // 새 게임 시작
  const startNewGame = () => {
    setShowNameModal(true);
  };

  const handlePlayerNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameModal(false);
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

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    setCards(cards => 
      cards.map(card => 
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

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

    if (firstCard?.emoji === secondCard?.emoji) {
      // 매칭 성공
      setCards(cards => 
        cards.map(card => 
          flippedCardIds.includes(card.id) 
            ? { ...card, isMatched: true } 
            : card
        )
      );
      
      // 점수 추가
      const matchScore = calculateScore(time, moves);
      setScore(prevScore => prevScore + Math.floor(matchScore / 8)); // 8쌍이므로 나누기 8
      
      toast({
        title: "매칭 성공! 🎉",
        description: `+${Math.floor(matchScore / 8)}점 획득!`,
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
        });

      if (error) throw error;

      setLeaderboardRefresh(prev => prev + 1);
      
      toast({
        title: "게임 완료! 🎊",
        description: `${moves}번의 시도로 ${Math.floor(time / 60)}분 ${time % 60}초만에 ${finalScore.toLocaleString()}점 획득!`,
      });
    } catch (error) {
      console.error('게임 기록 저장 중 오류:', error);
      toast({
        title: "기록 저장 실패",
        description: "게임 기록을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 컴포넌트 마운트시 로컬 스토리지 확인
  useEffect(() => {
    const savedName = localStorage.getItem('memory-game-player-name');
    if (!savedName) {
      setShowNameModal(true);
    } else {
      setPlayerName(savedName);
      setShowNameModal(true); // 저장된 이름이 있어도 게임 시작전 확인
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          메모리 카드 게임
        </h1>
        <p className="text-muted-foreground">같은 카드를 찾아 최고 점수를 달성하세요!</p>
        {playerName && (
          <p className="text-sm text-primary font-semibold mt-1">플레이어: {playerName}</p>
        )}
      </div>

      {/* 게임 통계 */}
      <Card className="game-header px-6 py-4 rounded-xl">
        <div className="flex items-center gap-6">
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
          <div className="flex gap-2">
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
        <div className="grid grid-cols-4 gap-4 p-6 bg-muted/20 rounded-2xl backdrop-blur-sm">
          {cards.map(card => (
            <GameCard
              key={card.id}
              id={card.id}
              emoji={card.emoji}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={handleCardClick}
              disabled={flippedCards.length === 2 || !isGameActive}
            />
          ))}
        </div>
      )}

      {/* 게임 시작 안내 */}
      {cards.length === 0 && !showNameModal && (
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">게임을 시작해보세요!</h2>
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
      
      <Leaderboard 
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        refreshTrigger={leaderboardRefresh}
      />
    </div>
  );
};

export default MemoryGame;