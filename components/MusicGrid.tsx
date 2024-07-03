interface MusicData {
    id: string;
    albumCover: string;
    musicName: string;
    author: { authorName: string };
    category: { categoryName: string };
  }
  
  interface MusicGridProps {
    musicData: MusicData[];
  }
  
  export default function MusicGrid({ musicData }: MusicGridProps) {
    return (
      <div className="container mx-auto px-12 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {musicData.map((music) => (
          <div key={music.id} className="bg-muted rounded-lg overflow-hidden group cursor-pointer">
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
                {music.author.authorName} | {music.category.categoryName}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }