import React, { useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface MusicData {
  id: string;
  albumCover: string;
  musicName: string;
  author: { authorName: string };
  category: { categoryName: string; categoryColor: string };
}

interface MusicGridProps {
  musicData: MusicData[];
  onCopy: (musicName: string, authorName: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (music: MusicData) => void;
  onDelete: (musicId: string, musicName: string) => void;
}

export default function MusicGrid({ 
  musicData, 
  onCopy, 
  loadMore, 
  hasMore, 
  isLoading, 
  isAdmin,
  onEdit,
  onDelete
}: MusicGridProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMusicElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, loadMore, isLoading]);

  function getContrastColor(hexColor: string): string {
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1, 7) : hexColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  const handleClick = (music: MusicData) => {
    onCopy(music.musicName, music.author.authorName);
  };

  return (
    <div className="container mx-auto px-12 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {musicData.map((music, index) => (
        <div 
          key={music.id} 
          ref={index === musicData.length - 1 ? lastMusicElementRef : null}
          className="bg-muted rounded-lg overflow-hidden group cursor-pointer relative"
        >
          <div onClick={() => handleClick(music)}>
            <div className="relative aspect-square">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  src={music.albumCover}
                  alt={music.musicName}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-3">
              <div className="text-lg font-bold truncate">{music.musicName}</div>
              <div className="text-sm text-muted-foreground truncate">
                {music.author.authorName}
              </div>
              <div 
                className="mt-2 inline-block px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `#${music.category.categoryColor}`,
                  color: getContrastColor(music.category.categoryColor)
                }}
              >
                {music.category.categoryName}
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <Button 
                size="sm"
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(music);
                }}
              >
                수정
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(music.id, music.musicName);
                }}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="col-span-full flex justify-center items-center py-4">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}