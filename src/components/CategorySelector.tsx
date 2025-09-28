import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface Category {
  name: string;
  icon: string;
  pairs: Array<{ front: string; back: string }>;
}

interface CategorySelectorProps {
  isOpen: boolean;
  onSelect: (category: string) => void;
  categories: Record<string, Category>;
}

const CategorySelector = ({ isOpen, onSelect, categories }: CategorySelectorProps) => {
  const categoryColors = {
    emoji: "from-purple-500 to-pink-500",
    math: "from-blue-500 to-cyan-500",
    english: "from-green-500 to-emerald-500",
    science: "from-orange-500 to-yellow-500",
    history: "from-red-500 to-rose-500",
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">학습 카테고리 선택</DialogTitle>
          <DialogDescription className="text-center">
            원하는 학습 주제를 선택하세요
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {Object.entries(categories).map(([key, category]) => (
            <Card
              key={key}
              className="relative overflow-hidden cursor-pointer hover:scale-105 transition-all group"
              onClick={() => onSelect(key)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[key as keyof typeof categoryColors]} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="relative p-4 text-center">
                <div className="text-5xl mb-2">{category.icon}</div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.pairs.length}개 학습 세트
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-4">
          <Card className="p-3 bg-muted/50">
            <p className="text-sm text-center text-muted-foreground">
              <span className="font-semibold">💡 팁:</span> 각 카테고리는 교육적 내용을 담고 있어 
              게임을 즐기면서 자연스럽게 학습할 수 있습니다!
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySelector;