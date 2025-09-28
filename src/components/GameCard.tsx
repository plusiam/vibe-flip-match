import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
          isMatched && "opacity-80 cursor-not-allowed scale-95",
          !disabled && !isMatched && "hover:scale-105",
          disabled && !isMatched && "cursor-not-allowed"
        )}
      >
        {/* 카드 뒷면 */}
        <div className={cn(
          "card-face card-back absolute inset-0 flex items-center justify-center rounded-lg backface-hidden",
          "bg-gradient-to-br from-primary to-accent"
        )}>
          <div className="text-4xl text-white">?</div>
        </div>
        
        {/* 카드 앞면 */}
        <div className={cn(
          "card-face card-front absolute inset-0 flex items-center justify-center rounded-lg rotate-y-180 backface-hidden",
          "bg-gradient-to-br from-background to-muted border-2",
          isMatched ? "border-success bg-success/20" : "border-border"
        )}>
          <div className={cn(
            isEmoji ? "text-4xl" : "text-lg font-bold text-center px-2",
            isMatched && "animate-bounce-gentle"
          )}>
            {content}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameCard;