import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GameCard from './GameCard';
import { useToast } from '@/hooks/use-toast';

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
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  // Initialize game
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
    setTime(0);
    setIsGameActive(true);
    setGameCompleted(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !gameCompleted) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameCompleted]);

  // Handle card click
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

  // Check for match
  const checkForMatch = (flippedCardIds: number[]) => {
    const [first, second] = flippedCardIds;
    const firstCard = cards.find(card => card.id === first);
    const secondCard = cards.find(card => card.id === second);

    if (firstCard?.emoji === secondCard?.emoji) {
      // Match found
      setCards(cards => 
        cards.map(card => 
          flippedCardIds.includes(card.id) 
            ? { ...card, isMatched: true } 
            : card
        )
      );
      toast({
        title: "매칭 성공! 🎉",
        description: "카드 한 쌍을 찾았습니다!",
      });
    } else {
      // No match
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

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameActive(false);
      setGameCompleted(true);
      toast({
        title: "게임 완료! 🎊",
        description: `${moves}번의 시도로 ${Math.floor(time / 60)}분 ${time % 60}초만에 완료했습니다!`,
      });
    }
  }, [cards, moves, time, toast]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
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
        <p className="text-muted-foreground">같은 카드를 찾아 모든 쌍을 완성하세요!</p>
      </div>

      {/* Game Stats */}
      <Card className="game-header px-6 py-4 rounded-xl">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">시간</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{moves}</div>
            <div className="text-sm text-muted-foreground">시도</div>
          </div>
          <Button 
            onClick={initializeGame}
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            다시 시작
          </Button>
        </div>
      </Card>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-4 p-6 bg-muted/20 rounded-2xl backdrop-blur-sm">
        {cards.map(card => (
          <GameCard
            key={card.id}
            id={card.id}
            emoji={card.emoji}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={handleCardClick}
            disabled={flippedCards.length === 2}
          />
        ))}
      </div>

      {/* Completion Message */}
      {gameCompleted && (
        <Card className="p-6 text-center bounce-in bg-gradient-to-r from-success/10 to-primary/10">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">축하합니다!</h2>
          <p className="text-muted-foreground mb-4">
            {moves}번의 시도로 {formatTime(time)}만에 게임을 완료했습니다!
          </p>
          <Button 
            onClick={initializeGame}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            새 게임 시작
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MemoryGame;