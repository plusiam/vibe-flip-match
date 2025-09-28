import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Timer, Target } from "lucide-react";

interface DifficultyLevel {
  name: string;
  pairs: number;
  timeBonus: number;
  scoreMultiplier: number;
  icon: string;
}

interface DifficultySelectorProps {
  isOpen: boolean;
  onSelect: (difficulty: string) => void;
  difficulties: Record<string, DifficultyLevel>;
}

const DifficultySelector = ({ isOpen, onSelect, difficulties }: DifficultySelectorProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">난이도 선택</DialogTitle>
          <DialogDescription className="text-center">
            자신의 실력에 맞는 난이도를 선택하세요
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(difficulties).map(([key, level]) => (
            <Card
              key={key}
              className="p-4 cursor-pointer hover:border-primary transition-all hover:scale-105 group"
              onClick={() => onSelect(key)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{level.icon}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {level.name}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{level.pairs}쌍</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span>{Math.floor(level.timeBonus / 60)}분</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>×{level.scoreMultiplier}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          💡 높은 난이도일수록 더 많은 점수를 획득할 수 있습니다!
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DifficultySelector;