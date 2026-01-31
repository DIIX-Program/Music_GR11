-- Create Database
-- CREATE DATABASE music_stream;
-- GO
-- USE music_stream;
-- GO

-- 1. Users Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'ARTIST')),
        avatar NVARCHAR(255),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Artists Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='artists' AND xtype='U')
BEGIN
    CREATE TABLE artists (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        bio NVARCHAR(MAX),
        verified BIT DEFAULT 0,
        total_plays BIGINT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
END
GO

-- 3. Albums Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='albums' AND xtype='U')
BEGIN
    CREATE TABLE albums (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(100) NOT NULL,
        artist_id INT NOT NULL,
        cover_image NVARCHAR(255),
        release_date DATETIME DEFAULT GETDATE(),
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
    );
END
GO

-- 4. Genres Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='genres' AND xtype='U')
BEGIN
    CREATE TABLE genres (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL UNIQUE,
        slug NVARCHAR(50) NOT NULL UNIQUE
    );
END
GO

-- 5. Tracks (Songs) Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tracks' AND xtype='U')
BEGIN
    CREATE TABLE tracks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(100) NOT NULL,
        artist_id INT,
        artist_name NVARCHAR(100),
        album_id INT,
        genre_id INT NOT NULL,
        duration INT NOT NULL, -- in seconds
        file_path NVARCHAR(255) NOT NULL,
        cover_image NVARCHAR(255),
        plays INT DEFAULT 0,
        status NVARCHAR(20) DEFAULT 'APPROVED',
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (artist_id) REFERENCES artists(id),
        FOREIGN KEY (album_id) REFERENCES albums(id),
        FOREIGN KEY (genre_id) REFERENCES genres(id)
    );
END
GO

-- 6. Playlists Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='playlists' AND xtype='U')
BEGIN
    CREATE TABLE playlists (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX),
        is_public BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
END
GO

-- 7. Playlist Songs (Details) Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='playlist_tracks' AND xtype='U')
BEGIN
    CREATE TABLE playlist_tracks (
        playlist_id INT NOT NULL,
        track_id INT NOT NULL,
        added_at DATETIME DEFAULT GETDATE(),
        PRIMARY KEY (playlist_id, track_id),
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
    );
END
GO

-- Extra: Favorites
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='favorites' AND xtype='U')
BEGIN
    CREATE TABLE favorites (
        user_id INT NOT NULL,
        track_id INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        PRIMARY KEY (user_id, track_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- No Action if cycle causes issues, but Cascade usually ok here
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
    );
END
GO
