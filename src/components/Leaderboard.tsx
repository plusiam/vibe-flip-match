import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GameRecord {
  id: string;
  player_name: string;
  score: number;
  time_seconds: number;
  moves: number;
  created_at: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger?: number;
}

const Leaderboard = ({ isOpen, onClose, refreshTrigger }: LeaderboardProps) => {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_records')
        .select('*')
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(10);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('리더보드 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, refreshTrigger]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500'; // 금메달
      case 1: return 'text-gray-400';   // 은메달
      case 2: return 'text-amber-600';  // 동메달
      default: return 'text-muted-foreground';
    }
  };

  const getRankIcon = (index: number) => {
    if (index < 3) {
      return <Trophy className={`w-5 h-5 ${getRankColor(index)}`} />;
    }
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
      {index + 1}
    </span>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🏆 리더보드
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">로딩 중...</div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              아직 기록이 없습니다. 첫 번째 플레이어가 되어보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record, index) => (
                <div
                  key={record.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border transition-colors
                    ${index < 3 
                      ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20' 
                      : 'bg-muted/20 border-border'
                    }
                  `}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg truncate">
                      {record.player_name}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(record.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-lg font-bold text-primary">
                      <Trophy className="w-4 h-4" />
                      {record.score.toLocaleString()}점
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(record.time_seconds)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {record.moves}번
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t">
          <Button 
            onClick={onClose} 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            닫기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;