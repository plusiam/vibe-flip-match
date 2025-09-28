import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PlayerNameModalProps {
  isOpen: boolean;
  onClose: (playerName: string) => void;
}

const PlayerNameModal = ({ isOpen, onClose }: PlayerNameModalProps) => {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // 로컬 스토리지에서 이전에 저장된 이름 불러오기
      const savedName = localStorage.getItem('memory-game-player-name') || '';
      setPlayerName(savedName);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      // 로컬 스토리지에 이름 저장
      localStorage.setItem('memory-game-player-name', playerName.trim());
      onClose(playerName.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            플레이어 이름 입력
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">이름</Label>
            <Input
              id="playerName"
              type="text"
              placeholder="이름을 입력하세요"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              className="text-center"
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={!playerName.trim()}
          >
            게임 시작!
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerNameModal;