const songs = [
  {
    name: "song1.mp3",
    title: "Lo-Fi Dreams",
    artist: "Chill Master",
    cover: "images/song1.svg"
  },
  {
    name: "song2.mp3",
    title: "Jazz in the Night",
    artist: "Sax Soul",
    cover: "images/song2.svg"
  },
  {
    name: "song3.mp3",
    title: "Energy Pulse",
    artist: "DJ Booster",
    cover: "images/song3.svg"
  },
  {
    name: "song4.mp3",
    title: "Ocean Breeze",
    artist: "Nature Vibes",
    cover: "images/song4.svg"
  }
];

let songIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

let isPlaying = false;
let isShuffled = false;
let isRepeating = false;

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = `music/${song.name}`;
  
  // Show loading state
  title.style.opacity = "0.5";
  artist.style.opacity = "0.5";
  
  // Handle image loading errors
  cover.onerror = () => {
    console.warn(`Failed to load cover image: ${song.cover}`);
    // Create a simple fallback cover
    cover.src = "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#cccccc"/>
        <text x="150" y="140" font-family="Arial" font-size="20" fill="white" text-anchor="middle">♪</text>
        <text x="150" y="170" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${song.title}</text>
        <text x="150" y="190" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${song.artist}</text>
      </svg>
    `);
  };
  
  // Handle audio loading
  audio.onloadstart = () => {
    console.log("Loading started for:", song.name);
  };
  
  audio.oncanplaythrough = () => {
    console.log("Can play through:", song.name);
    title.style.opacity = "1";
    artist.style.opacity = "1";
  };
  
  // Handle audio loading errors
  audio.onerror = () => {
    console.error(`Failed to load audio: ${song.name}`);
    title.style.opacity = "1";
    artist.style.opacity = "1";
    alert(`Sorry, could not load ${song.title}. Please check if the audio file exists.`);
  };
}

function playSong() {
  isPlaying = true;
  audio.play().catch(error => {
    console.error("Error playing audio:", error);
    isPlaying = false;
    playBtn.innerHTML = "▶";
  });
  playBtn.innerHTML = "⏸";
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = "▶";
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  updatePlaylistHighlight();
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  updatePlaylistHighlight();
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;
  
  if (!isNaN(duration)) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    function formatTime(sec) {
      if (isNaN(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? "0" + s : s}`;
    }

    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
  } else {
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    progress.style.width = "0%";
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener("ended", nextSong);

function createPlaylist() {
  playlistEl.innerHTML = ''; // Clear existing playlist
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.setAttribute('data-index', index);
    
    // Highlight current song
    if (index === songIndex) {
      li.classList.add('active');
    }
    
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      updatePlaylistHighlight();
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const playlistItems = playlistEl.querySelectorAll('li');
  playlistItems.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Add audio loading event listeners
audio.addEventListener("loadstart", () => {
  console.log("Started loading audio");
});

audio.addEventListener("canplaythrough", () => {
  console.log("Audio can play through");
});

audio.addEventListener("error", (e) => {
  console.error("Audio error:", e);
});

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  switch(e.code) {
    case "Space":
      e.preventDefault();
      isPlaying ? pauseSong() : playSong();
      break;
    case "ArrowLeft":
      e.preventDefault();
      prevSong();
      break;
    case "ArrowRight":
      e.preventDefault();
      nextSong();
      break;
    case "ArrowUp":
      e.preventDefault();
      volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
      audio.volume = volumeSlider.value;
      break;
    case "ArrowDown":
      e.preventDefault();
      volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
      audio.volume = volumeSlider.value;
      break;
  }
});

// Initial setup
loadSong(songs[songIndex]);
createPlaylist();