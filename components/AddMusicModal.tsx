import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from '../hooks/useAuth';

interface AddMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAlbumArtUrl: string;
  handleMusicAdded: (music: MusicData) => void;
  selectedMusic: MusicData | null;
}

const AddMusicModal: React.FC<AddMusicModalProps> = ({
  isOpen,
  onClose,
  selectedAlbumArtUrl,
  handleMusicAdded,
  selectedMusic
}) => {
  const { user, fetchUser } = useAuth();
  const [albumCover, setAlbumCover] = useState(selectedAlbumArtUrl || "");
  const [musicName, setMusicName] = useState(selectedMusic ? selectedMusic.musicName : "");
  const [authorName, setAuthorName] = useState(selectedMusic ? selectedMusic.author.authorName : "");
  const [categoryName, setCategoryName] = useState(selectedMusic ? selectedMusic.category.categoryName : "");
  const [categoryColor, setCategoryColor] = useState(selectedMusic ? selectedMusic.category.categoryColor : "");
  const [isLoading, setIsLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const fetchAuthorsAndCategories = useCallback(async () => {
    try {
      const [authorRes, categoryRes] = await Promise.all([
        axios.get("https://www.chogeumbi.kr/api/v1/authors"),
        axios.get("https://www.chogeumbi.kr/api/v1/categories")
      ]);
      setAuthors(authorRes.data.data.authorList);
      setCategories(categoryRes.data.data.categoryList);
    } catch (error) {
      console.error("Failed to fetch authors or categories:", error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAuthorsAndCategories();
    }
  }, [isOpen, fetchAuthorsAndCategories]);

  useEffect(() => {
    if (selectedMusic) {
      setAlbumCover(selectedMusic.albumCover);
      setMusicName(selectedMusic.musicName);
      setAuthorName(selectedMusic.author.authorName);
      setCategoryName(selectedMusic.category.categoryName);
      setCategoryColor(selectedMusic.category.categoryColor);
    } else {
      setAlbumCover(selectedAlbumArtUrl);
      setMusicName("");
      setAuthorName("");
      setCategoryName("");
      setCategoryColor("");
    }
  }, [selectedMusic, selectedAlbumArtUrl]);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    try {
      const response = await axios.post(
        "https://www.chogeumbi.kr/api/v1/music",
        {
          albumCover,
          musicName,
          authorName,
          categoryName,
          categoryColor,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      handleMusicAdded(response.data.data);
      onClose();
    } catch (error) {
      console.error("Failed to add music:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{selectedMusic ? "Edit Music" : "Add Music"}</h2>
        <label>
          Album Cover URL:
          <input
            type="text"
            value={albumCover}
            onChange={(e) => setAlbumCover(e.target.value)}
          />
        </label>
        <label>
          Music Name:
          <input
            type="text"
            value={musicName}
            onChange={(e) => setMusicName(e.target.value)}
          />
        </label>
        <label>
          Author Name:
          <select
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          >
            {authors.map((author) => (
              <option key={author.id} value={author.authorName}>
                {author.authorName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category Name:
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category Color:
          <input
            type="color"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit} disabled={isLoading}>
          {selectedMusic ? "Update Music" : "Add Music"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddMusicModal;
