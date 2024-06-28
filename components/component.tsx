/**
 * v0 by Vercel.
 * @see https://v0.dev/t/bWEOjuXXqgQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { SVGProps } from "react"

export default function Component() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center justify-between h-16 px-4 border-b bg-background shrink-0 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="font-bold text-lg" prefetch={false}>
            초금비 노래책
          </Link>
        </div>
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="노래제목, 아티스트명을 검색하세요" className="pl-8 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="w-5 h-5" />
                <span className="sr-only">로그인/회원가입</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">어서오세요 초금비 노래책 입니다.</h4>
                <div className="space-y-2">
                  <Button className="w-full">
                    로그인
                  </Button>
                  <Button variant="outline" className="w-full">
                    회원가입
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <LayoutGridIcon className="w-5 h-5" />
                <span className="sr-only">카테고리</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">카테고리</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Pop
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Rock
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Hip Hop
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    R&B
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Country
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Electronic
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UsersIcon className="w-5 h-5" />
                <span className="sr-only">아티스트</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">아티스트</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Adele
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Ed Sheeran
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Taylor Swift
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Drake
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Beyoncé
                  </Link>
                  <Link
                    href="#"
                    className="bg-muted/50 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    prefetch={false}
                  >
                    Kendrick Lamar
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <AlignRightIcon className="w-5 h-5" />
                <span className="sr-only">Align</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>제목 오름차순</DropdownMenuItem>
              <DropdownMenuItem>제목 내림차순</DropdownMenuItem>
              <DropdownMenuItem>아티스트명 오름차순</DropdownMenuItem>
              <DropdownMenuItem>아티스트명 내림차순</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoonIcon className="w-5 h-5" />
                <span className="sr-only">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex items-center">
                  <SunIcon className="w-4 h-4 mr-2" />
                  라이트 모드
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center">
                  <MoonIcon className="w-4 h-4 mr-2" />
                  다크 모드
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/1755/175550.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Chasing Pavements</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Adele</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/6118/611813.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Shape of You</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Ed Sheeran</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/4596/459688.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Blank Space</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Taylor Swift</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/7307/730712.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">God's Plan</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Drake</span>
                  <span>·</span>
                  <span>Hip Hop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/40885/4088574.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Super Shy</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>NewJeans</span>
                  <span>·</span>
                  <span>dance/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/200402/20040257.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">기다린 만큼, 더</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>검정치마</span>
                  <span>·</span>
                  <span>indie/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/1755/175550.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Chasing Pavements</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Adele</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/6118/611813.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Shape of You</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Ed Sheeran</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/4596/459688.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Blank Space</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Taylor Swift</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/7307/730712.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">God's Plan</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Drake</span>
                  <span>·</span>
                  <span>Hip Hop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/40885/4088574.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Super Shy</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>NewJeans</span>
                  <span>·</span>
                  <span>dance/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/200402/20040257.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">기다린 만큼, 더</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>검정치마</span>
                  <span>·</span>
                  <span>indie/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/1755/175550.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Chasing Pavements</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Adele</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/6118/611813.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Shape of You</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Ed Sheeran</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/4596/459688.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Blank Space</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Taylor Swift</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/7307/730712.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">God's Plan</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Drake</span>
                  <span>·</span>
                  <span>Hip Hop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/40885/4088574.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Super Shy</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>NewJeans</span>
                  <span>·</span>
                  <span>dance/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/200402/20040257.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">기다린 만큼, 더</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>검정치마</span>
                  <span>·</span>
                  <span>indie/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/1755/175550.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Chasing Pavements</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Adele</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/6118/611813.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Shape of You</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Ed Sheeran</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/4596/459688.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Blank Space</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Taylor Swift</span>
                  <span>·</span>
                  <span>Pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/7307/730712.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">God's Plan</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>Drake</span>
                  <span>·</span>
                  <span>Hip Hop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/40885/4088574.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Super Shy</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>NewJeans</span>
                  <span>·</span>
                  <span>dance/pop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View Song</span>
            </Link>
            <img
              src="https://image.bugsm.co.kr/album/images/original/200402/20040257.jpg?version=undefined"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">기다린 만큼, 더</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>검정치마</span>
                  <span>·</span>
                  <span>indie/pop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 13.5a5 5 0 100-10 5 5 0 000 10zm3.284-1.784a7 7 0 111.414-1.414l3.25 3.25a1 1 0 01-1.414 1.414l-3.25-3.25z"
    />
  </svg>
)

const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="7" r="5" />
    <path d="M12 14c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z" />
  </svg>
)

const LayoutGridIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M3 3h7v7H3z" />
    <path d="M14 3h7v7h-7z" />
    <path d="M14 14h7v7h-7z" />
    <path d="M3 14h7v7H3z" />
  </svg>
)

const UsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M20 21v-2a4 4 0 00-3-3.87" />
    <path d="M20 8a4 4 0 11-8 0" />
  </svg>
)

const AlignRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M21 10H7" />
    <path d="M21 6H3" />
    <path d="M21 14H3" />
    <path d="M21 18H7" />
  </svg>
)

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M21.05 12.31A9 9 0 1111.69 2.95 7 7 0 0021.05 12.31z" />
  </svg>
)

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="M4.22 4.22l1.42 1.42" />
    <path d="M18.36 18.36l1.42 1.42" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
    <path d="M4.22 19.78l1.42-1.42" />
    <path d="M18.36 5.64l1.42-1.42" />
  </svg>
)