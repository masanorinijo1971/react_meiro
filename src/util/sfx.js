import Sound from "react-native-sound";

// SFX from http://www.kurage-kosho.info/system.html
function sfxPlay(error, sound) {
  if (error) {
    console.error(error);
    return false;
  }
  sound.play(() => {
    sound.release();
  });
}

export function playButtonTouch() {
  const sound = new Sound("select_a.mp3", Sound.MAIN_BUNDLE, (error) =>
    sfxPlay(error, sound)
  );
}
