import { useState } from 'react';

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
}

export default function MusicGrid({ musicData, onCopy }: MusicGridProps) {
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
      {musicData.map((music) => (
        <div 
          key={music.id} 
          className="bg-muted rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => handleClick(music)}
        >
          <div className="relative aspect-square">
            <img
              src={music.albumCover}
              alt={music.musicName}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-3">
            <div className="text-lg font-bold">{music.musicName}</div>
            <div className="text-sm text-muted-foreground">
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
      ))}
    </div>
  );
}