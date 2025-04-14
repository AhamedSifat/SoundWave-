import Song from './../models/song.model.js';
import Album from '../models/album.model.js';
import cloudinary from '../utils/cloudinary.js';

const uploadToCloudinary = async (file) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'auto',
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.log('Error in uploadToCloudinary', error);
    throw new Error('error uploading to cloudinary');
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({
        message: 'Please Upload all files',
      });
    }

    const { title, artist, album, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = await Song.create({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: album || null,
    });

    if (album) {
      await Album.findByIdAndUpdate(album, {
        $push: {
          songs: song._id,
        },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    //if song belog to a album then update the Album
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: {
          songs: song._id,
        },
      });
    }

    await Song.findByIdAndDelete(id);
    res.status(200).json({
      message: 'Song deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);
    const album = await Album.create({
      title,
      artist,
      imageUrl,
      releaseYear,
    });
    res.status(201).json(album);
  } catch (error) {
    console.log('Error in createAlbum', error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findOneAndDelete(id);

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.log('Error in deleteAlbum', error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({
    admin: true,
  });
};
