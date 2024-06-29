/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IKoNrpTXmwa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [artistSearchTerm, setArtistSearchTerm] = useState("")
  const [selectedArtists, setSelectedArtists] = useState([])
  const handleCategorySearch = (e) => {
    setCategorySearchTerm(e.target.value)
  }
  const handleCategorySelect = (category) => {
    setSelectedCategories([...selectedCategories, category])
    setCategorySearchTerm("")
  }
  const handleCategoryRemove = (index) => {
    const updatedCategories = [...selectedCategories]
    updatedCategories.splice(index, 1)
    setSelectedCategories(updatedCategories)
  }
  const handleArtistSearch = (e) => {
    setArtistSearchTerm(e.target.value)
  }
  const handleArtistSelect = (artist) => {
    setSelectedArtists([...selectedArtists, artist])
    setArtistSearchTerm("")
  }
  const handleArtistRemove = (index) => {
    const updatedArtists = [...selectedArtists]
    updatedArtists.splice(index, 1)
    setSelectedArtists(updatedArtists)
  }
  const filteredCategories = categorySearchTerm
    ? ["랩", "댄스", "J-팝", "발라드", "인디", "힙합", "팝", "K-팝"].filter((category) =>
        category.toLowerCase().includes(categorySearchTerm.toLowerCase()),
      )
    : []
  const filteredArtists = artistSearchTerm
    ? ["아이유", "빅뱅", "방탄소년단", "뉴진스", "에스파", "검정치마", "김광석", "김필"].filter((artist) =>
        artist.toLowerCase().includes(artistSearchTerm.toLowerCase()),
      )
    : []
  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-primary text-primary-foreground px-8 py-3 shadow-md">
        <div className="text-lg font-bold">초금비 MUSIC-BOOK</div>
        <div className="relative flex-1 max-w-md mx-8">
          <Input
            type="search"
            placeholder="Search music..."
            className="w-full rounded-full bg-primary-foreground/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-full">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </header>
      <div className="container mx-auto px-12 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="bg-muted rounded-lg overflow-hidden group cursor-pointer">
            <div className="relative aspect-square">
              <img
                src="https://image.bugsm.co.kr/album/images/original/40885/4088574.jpg?version=undefined"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-3">
              <div className="text-lg font-bold">Super Shy</div>
              <div className="text-sm text-muted-foreground">
                New Jeans  | K-POP 
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} side="right" className="bg-background text-foreground">
        <SheetContent>
          <div className="flex flex-col items-start gap-6 p-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </Button>
              <Button variant="outline" onClick={() => setIsSignupModalOpen(true)}>
                Signup
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="category">Category</Label>
            </div>
            <div className="w-full">
              <Input
                id="category"
                type="text"
                placeholder="Search category"
                value={categorySearchTerm}
                onChange={handleCategorySearch}
                className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {categorySearchTerm && (
                <div className="mt-2 space-y-2">
                  {filteredCategories.map((category) => (
                    <div
                      key={category}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span>{category}</span>
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedCategories.length > 0 && (
              <div className="w-full">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleCategoryRemove(index)}
                    >
                      <span>{category}</span>
                      <XIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Label htmlFor="artist">Artist</Label>
            </div>
            <div className="w-full">
              <Input
                id="artist"
                type="text"
                placeholder="Search artist"
                value={artistSearchTerm}
                onChange={handleArtistSearch}
                className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {artistSearchTerm && (
                <div className="mt-2 space-y-2">
                  {filteredArtists.map((artist) => (
                    <div
                      key={artist}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleArtistSelect(artist)}
                    >
                      <span>{artist}</span>
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedArtists.length > 0 && (
              <div className="w-full">
                <div className="flex flex-wrap gap-2">
                  {selectedArtists.map((artist, index) => (
                    <div
                      key={index}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleArtistRemove(index)}
                    >
                      <span>{artist}</span>
                      <XIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span className="sr-only">Dark Mode</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Switch>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-background text-foreground p-8 rounded-lg shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Enter your credentials to access your account.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent className="bg-background text-foreground p-8 rounded-lg shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Signup</DialogTitle>
            <DialogDescription>Create a new account to access the music book.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" />
            </div>
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function XIcon(props) {
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
  )
}