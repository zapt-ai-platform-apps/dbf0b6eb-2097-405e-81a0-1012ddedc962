import { createEffect, createSignal, Show } from 'solid-js';

function AudioPlayer(props) {
  let audioRef;
  const [isPlaying, setIsPlaying] = createSignal(props.audioData().isPlaying);
  const [showReplayButton, setShowReplayButton] = createSignal(props.audioData().showReplayButton);

  createEffect(() => {
    if (props.audioData().url && audioRef) {
      audioRef.play();
      setIsPlaying(true);
      setShowReplayButton(false);
    }
  });

  const handlePause = () => {
    if (audioRef) {
      audioRef.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioRef) {
      audioRef.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setShowReplayButton(true);
  };

  const handleReplay = () => {
    if (audioRef) {
      audioRef.currentTime = 0;
      audioRef.play();
      setIsPlaying(true);
      setShowReplayButton(false);
    }
  };

  const handleDownload = async () => {
    if (!props.audioData().url) return;
    try {
      const response = await fetch(props.audioData().url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'output.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={props.audioData().url}
        class="w-full"
        autoplay
        onEnded={handleAudioEnded}
      />
      <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
        <Show when={!showReplayButton()}>
          <Show when={isPlaying()}>
            <button
              onClick={handlePause}
              class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
            >
              إيقاف الاستماع
            </button>
          </Show>
          <Show when={!isPlaying()}>
            <button
              onClick={handleResume}
              class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
            >
              متابعة الاستماع
            </button>
          </Show>
        </Show>
        <Show when={showReplayButton()}>
          <button
            onClick={handleReplay}
            class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
          >
            إعادة الاستماع
          </button>
        </Show>
        <button
          onClick={handleDownload}
          class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
        >
          تحميل الصوت بصيغة MP3
        </button>
      </div>
    </div>
  );
}

export default AudioPlayer;