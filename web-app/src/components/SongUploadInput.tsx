type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function SongUploadInput({ onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="song-upload-form">
      <h2 className="song-list-title">Upload a Song</h2>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Song Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter song name"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="song_file" className="form-label">
          Song File
        </label>
        <input
          type="file"
          id="song_file"
          name="song_file"
          accept="audio/*"
          className="form-input"
        />
      </div>
      <button type="submit" className="upload-button">
        Upload Song
      </button>
    </form>
  );
}
