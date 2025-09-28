import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface GameCardProps {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
  category?: string;
}

const GameCard = ({ 
  id, 
  content, 
  isFlipped, 
  isMatched, 
  onClick, 
  disabled,
  category = 'emoji'
}: GameCardProps) => {
  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id);
    }
  };

  const isEmoji = category === 'emoji' && content.length <= 2 && /\p{Emoji}/u.test(content);

  return (
    <div className="card-container">
      <Card
        onClick={handleClick}
        className={cn(
          "card-flip relative w-24 h-24 cursor-pointer transition-all duration-300 preserve-3d",
          isFlipped || isMatched ? "flipped" : "",
          isMatched && "matched-card",
          !disabled && !isMatched && "hover:scale-105 hover:shadow-lg",
          disabled && !isMatched && "cursor-not-allowed"
        )}
      >
        {/* 카드 뒷면 */}
        <div className={cn(
          "card-face card-back absolute inset-0 flex items-center justify-center rounded-lg backface-hidden",
          isMatched 
            ? "bg-gradient-to-br from-green-400 to-green-600" 
            : "bg-gradient-to-br from-primary to-accent"
        )}>
          <div className="text-4xl text-white">
            {isMatched ? "✓" : "?"}
          </div>
        </div>
        
        {/* 카드 앞면 */}
        <div className={cn(
          "card-face card-front absolute inset-0 flex items-center justify-center rounded-lg rotate-y-180 backface-hidden border-2",
          isMatched 
            ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-500 shadow-green-200 shadow-lg" 
            : "bg-gradient-to-br from-background to-muted border-border"
        )}>
          {/* 매칭 성공 아이콘 */}
          {isMatched && (
            <CheckCircle className="absolute top-1 right-1 w-5 h-5 text-green-600 animate-bounce-in" />
          )}
          
          <div className={cn(
            isEmoji ? "text-4xl" : "text-lg font-bold text-center px-2",
            isMatched && "text-green-700 scale-110 transition-all duration-300"
          )}>
            {content}
          </div>
          
          {/* 매칭 성공 효과 */}
          {isMatched && (
            <div className="absolute inset-0 rounded-lg animate-pulse-success pointer-events-none" />
          )}
        </div>
      </Card>
    </div>
  );
};

export default GameCard;