const song = document.getElementById('song');
const nextSong = document.querySelector('.music-next-song span:last-child');
const songImage = document.querySelector('.music-thumb img');
const songName = document.querySelector('.music-name');
const songArtist = document.querySelector('.music-artist');
const rangeBar = document.querySelector('.range');
const playBtn = document.querySelector('.player-inner');
const nextBtn = document.querySelector('.play-forward');
const prevBtn = document.querySelector('.play-back');
const playRepeat = document.querySelector('.play-repeat');
const playInfinite = document.querySelector('.play-infinite');
const playIcon = document.querySelector('.play-icon');
const durationTime = document.querySelector('.duration');
const remainingTime = document.querySelector('.remaining');

let isRepeat = false;
let repeatCount = 0;
let isRepeatInfinite = false;

let indexSong = 0;

const musicsApi = './musics.json';

getMusics(app);

function getMusics(callback) {
  fetch(musicsApi)
    .then((res) => res.json())
    .then(callback);
}

function app(musics) {
  displayTimer();
  let timer = setInterval(displayTimer, 500);
  // Config controller btn
  nextBtn.addEventListener('click', function () {
    changeSong(1);
    displayTimer();
  });
  prevBtn.addEventListener('click', function () {
    changeSong(-1);
    displayTimer();
  });

  playRepeat.addEventListener('click', function () {
    if (isRepeatInfinite) {
      isRepeatInfinite = false;
      playInfinite.removeAttribute('style');
    }
    if (isRepeat) {
      isRepeat = false;
      playRepeat.removeAttribute('style');
    } else {
      isRepeat = true;
      repeatCount = 1;
      playRepeat.style.color = '#2cccff';
    }
  });
  playInfinite.addEventListener('click', function () {
    if (isRepeat) {
      if (repeatCount) {
        repeatCount = 0;
      }
      isRepeat = false;
      playRepeat.removeAttribute('style');
    }
    if (isRepeatInfinite) {
      isRepeatInfinite = false;
      playInfinite.removeAttribute('style');
    } else {
      isRepeatInfinite = true;
      playInfinite.style.color = '#2cccff';
    }
  });
  song.addEventListener('ended', function () {
    if (isRepeat) {
      if (repeatCount && isRepeat) {
        song.play();
        repeatCount = 0;
      } else {
        if (isRepeat && !repeatCount) {
          repeatCount = 1;
        }
        changeSong(1);
        song.play();
      }
    } else if (isRepeatInfinite) {
      if (isRepeatInfinite) {
        song.play();
      }
    } else {
      changeSong(1);
      song.play();
    }

    displayTimer();
  });

  function changeSong(dir) {
    if (dir === 1) {
      if (indexSong < musics.length - 1) {
        indexSong++;
      } else {
        indexSong = 0;
      }
    } else if (dir === -1) {
      if (indexSong > 0) {
        indexSong--;
      } else {
        indexSong = musics.length - 1;
      }
    }

    init();
  }

  function playPause() {
    if (song.paused) {
      // @ts-ignore
      song.play();
      playIcon.setAttribute('name', 'pause');
      songImage.classList.add('playing');
      timer = setInterval(displayTimer, 500);
    } else {
      // @ts-ignore
      song.pause();
      playIcon.setAttribute('name', 'play');
      songImage.classList.remove('playing');
      clearInterval(timer);
    }
  }

  playBtn.addEventListener('click', playPause);

  // Load timer
  function displayTimer() {
    const { duration, currentTime } = song;

    rangeBar.max = duration;
    rangeBar.value = currentTime;

    function formatTimer(timer) {
      const minutes = Math.floor(timer / 60);
      const seconds = Math.floor(timer - minutes * 60);

      return `${minutes < 10 ? '0' + minutes : minutes}:${seconds}`;
    }

    if (!duration) durationTime.textContent = '00:00';
    else durationTime.textContent = formatTimer(duration);

    if (!duration) remainingTime.textContent = '-00:00';
    else remainingTime.textContent = '-' + formatTimer(duration - currentTime);
  }

  function handleChangeBar() {
    song.currentTime = rangeBar.value;
  }
  rangeBar.addEventListener('change', handleChangeBar);

  function init() {
    let isPlaying = false;
    if (!song.paused) isPlaying = true;
    song.setAttribute('src', `${musics[indexSong].file}`);
    if (isPlaying) song.play();

    songName.textContent = musics[indexSong].name;
    if (musics[indexSong].artist) {
      songArtist.textContent = musics[indexSong].artist;
    } else {
      songArtist.textContent = 'Unknown';
    }
    if (musics[indexSong].image) {
      songImage.setAttribute('src', musics[indexSong].image);
    } else {
      songImage.setAttribute(
        'src',
        'https://media.istockphoto.com/photos/black-and-white-photo-of-man-playing-guitar-picture-id178628010?b=1&k=20&m=178628010&s=170667a&w=0&h=57s8DuvYFfDEo93JDUtfw8y3skJVsnsZYULerlgx_vw='
      );
    }
    if (musics.length - 1 > indexSong) {
      nextSong.textContent = musics[indexSong + 1].name;
    } else {
      nextSong.textContent = musics[0].name;
    }
  }

  displayTimer();
  init();
}
