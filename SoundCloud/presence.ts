var presence = new Presence({
  clientId: '607697998490894356',
  mediaKeys: true
});
var strings = presence.getStrings({
  play: 'presence.playback.playing',
  pause: 'presence.playback.paused'
});

presence.on('UpdateData', async () => {
  var player = document.querySelector('.playControls__elements');

  if (player) {
    var player_button: HTMLButtonElement = document.querySelector(
      '.playControls__play'
    );

    var paused = player_button.classList.contains('playing') === false;

    try {
      var title = document.querySelector(
        '.playbackSoundBadge__titleLink > span:nth-child(1)'
      ).textContent;
      var author = document.querySelector('.playbackSoundBadge__lightLink')
        .textContent;
      var audioTime = document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div > div > div > div.playbackTimeline__timePassed > span:nth-child(2)").textContent;
      var audioDuration = document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div > div > div > div.playbackTimeline__duration > span:nth-child(2)").textContent;
      var timestamps = getTimestamps(audioTime, audioDuration);
    } catch (err) {}

    var data: presenceData = {
      details: title,
      state: author,
      largeImageKey: 'soundcloud',
      smallImageKey: paused ? 'pause' : 'play',
      smallImageText: paused ? (await strings).pause : (await strings).play,
      startTimestamp: timestamps[0],
      endTimestamp: timestamps[1]
    };

    if (paused) {
      delete data.startTimestamp;
      delete data.endTimestamp;
    }

    if (title !== null && author !== null) {
      presence.setActivity(data, !paused);
    }
  } else {
    presence.clearActivity();
  }
});

presence.on('MediaKeys', (key: string) => {
  switch (key) {
    case 'pause':
      var pause_button: HTMLButtonElement = document.querySelector(
        '.playControls__play'
      );
      pause_button.click();
      break;
    case 'nextTrack':
      var next_button: HTMLButtonElement = document.querySelector(
        '.skipControl__next'
      );
      next_button.click();
      break;
    case 'previousTrack':
      var prev_button: HTMLButtonElement = document.querySelector(
        '.skipControl__previous'
      );
      prev_button.click();
      break;
  }
});

function getTimestamps(audioTime: string, audioDuration: string) {
  var splitAudioTime = audioTime.split(':').reverse();
  var splitAudioDuration = audioDuration.split(':').reverse();

  var parsedAudioTime = getTime(splitAudioTime);
  var parsedAudioDuration = getTime(splitAudioDuration);

  var startTime = Date.now();
  var endTime =
    Math.floor(startTime / 1000) - parsedAudioTime + parsedAudioDuration;
  return [Math.floor(startTime / 1000), endTime];
}

function getTime(list: string[]) {
  var ret = 0;
  for (let index = list.length - 1; index >= 0; index--) {
    ret += parseInt(list[index]) * 60 ** index;
  }
  return ret;
}
