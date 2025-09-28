import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Timer, Target, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  time_seconds: number;
  moves: number;
  difficulty?: string;
  category?: string;
  created_at: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger?: number;
}

const Leaderboard = ({ isOpen, onClose, refreshTrigger = 0 }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, refreshTrigger, filterDifficulty, filterCategory]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('game_records')
        .select('*')
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(20);

      if (filterDifficulty !== 'all') {
        query = query.eq('difficulty', filterDifficulty);
      }
      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('리더보드 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-muted-foreground">{index + 1}</span>;
    }
  };

  const getDifficultyBadge = (difficulty?: string) => {
    const badges = {
      easy: { label: '쉬움', variant: 'secondary' as const, icon: '😊' },
      medium: { label: '보통', variant: 'default' as const, icon: '😎' },
      hard: { label: '어려움', variant: 'destructive' as const, icon: '🔥' },
      expert: { label: '전문가', variant: 'outline' as const, icon: '💎' },
    };
    
    const badge = badges[difficulty as keyof typeof badges] || badges.medium;
    return (
      <Badge variant={badge.variant}>
        {badge.icon} {badge.label}
      </Badge>
    );
  };

  const getCategoryBadge = (category?: string) => {
    const categories = {
      emoji: { label: '이모지', color: 'bg-purple-500/10 text-purple-700' },
      math: { label: '수학', color: 'bg-blue-500/10 text-blue-700' },
      english: { label: '영어', color: 'bg-green-500/10 text-green-700' },
      science: { label: '과학', color: 'bg-orange-500/10 text-orange-700' },
      history: { label: '역사', color: 'bg-red-500/10 text-red-700' },
    };
    
    const cat = categories[category as keyof typeof categories] || categories.emoji;
    return (
      <Badge className={cat.color}>
        {cat.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            리더보드
          </DialogTitle>
          <DialogDescription>
            최고 점수를 기록한 플레이어들
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 카테고리</SelectItem>
              <SelectItem value="emoji">😊 이모지</SelectItem>
              <SelectItem value="math">🔢 수학</SelectItem>
              <SelectItem value="english">🔤 영어</SelectItem>
              <SelectItem value="science">🔬 과학</SelectItem>
              <SelectItem value="history">📚 역사</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="난이도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 난이도</SelectItem>
              <SelectItem value="easy">😊 쉬움</SelectItem>
              <SelectItem value="medium">😎 보통</SelectItem>
              <SelectItem value="hard">🔥 어려움</SelectItem>
              <SelectItem value="expert">💎 전문가</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            로딩 중...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            아직 기록이 없습니다. 첫 번째 플레이어가 되어보세요!
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-12">순위</TableHead>
                  <TableHead>플레이어</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>난이도</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-4 h-4" />
                      점수
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Timer className="w-4 h-4" />
                      시간
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Target className="w-4 h-4" />
                      시도
                    </div>
                  </TableHead>
                  <TableHead>날짜</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow 
                    key={entry.id}
                    className={index < 3 ? 'bg-muted/30' : ''}
                  >
                    <TableCell className="font-medium">
                      {getRankIcon(index)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {entry.player_name}
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(entry.category)}
                    </TableCell>
                    <TableCell>
                      {getDifficultyBadge(entry.difficulty)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {entry.score.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTime(entry.time_seconds)}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.moves}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;