import Song from '../models/song.model.js';

export const getAllSongs = async (req, res, next) => {
  try {
    //-1 => Descending=> newest-> oldest
    //1 => Aescending=>oldest ->  newest

    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    console.log('error in getAllSongs', error);
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    //fetch 6 random songs using mongodb aggregation pipeline

    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.status(200).json(songs);
  } catch (error) {
    console.log('error in getFeaturedSong', error);
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    //fetch 4 random songs using mongodb aggregation pipeline

    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.status(200).json(songs);
  } catch (error) {
    console.log('error in getTrendingSongs', error);
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    //fetch 6 random songs using mongodb aggregation pipeline

    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.status(200).json(songs);
  } catch (error) {
    console.log('error in getMadeForYouSongs', error);
    next(error);
  }
};
