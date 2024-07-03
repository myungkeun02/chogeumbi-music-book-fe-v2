import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchMusicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SearchMusicModal({ isOpen, onOpenChange }: SearchMusicModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Album Art</DialogTitle>
          <Button variant="ghost" onClick={() => onOpenChange(false)} aria-label="Close">
            <XIcon className="w-6 h-6" />
          </Button>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <Input type="text" placeholder="Search album art..." />
          <div className="grid grid-cols-3 gap-4">
            <div className="relative aspect-square bg-background rounded-lg overflow-hidden cursor-pointer">
              <img
                src="https://via.placeholder.com/300"
                alt="Album Art"
                className="object-cover w-full h-full"
              />
            </div>
            {/* 여기에 다른 검색 결과 이미지 추가 */}
          </div>
          <div className="flex justify-end gap-4">
            <Button>Search</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}