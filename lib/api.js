import axios from 'axios';

export const getAllMusic = async () => {
  try {
    const response = await axios.get('http://www.chogeumbi.kr/api/v1/music/all');
    return response.data.data.musicList;
  } catch (error) {
    console.error('Error fetching music list:', error);
    return [];
  }
};
