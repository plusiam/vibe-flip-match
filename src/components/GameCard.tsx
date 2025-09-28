interface GameCardProps {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}

const GameCard = ({ id, emoji, isFlipped, isMatched, onClick, disabled }: GameCardProps) => {
  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <div
      className={`
        card-flip w-20 h-20 cursor-pointer select-none
        ${isFlipped || isMatched ? 'card-flipped' : ''}
        ${isMatched ? 'card-matched pulse-success' : ''}
        ${disabled ? 'cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-back">
          <div className="text-white text-xl font-bold">❓</div>
        </div>
        <div className="card-front">
          <div className="text-3xl">{emoji}</div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;