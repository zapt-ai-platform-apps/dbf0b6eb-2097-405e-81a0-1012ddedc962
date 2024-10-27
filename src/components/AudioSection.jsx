import { createEffect, Show } from 'solid-js';
import AudioPlayer from './AudioPlayer';

function AudioSection(props) {
  return (
    <div class="mt-8">
      <h3 class="text-xl font-bold mb-2 text-purple-600">الصوت المحول</h3>

      <AudioPlayer audioData={props.audioData} setAudioData={props.setAudioData} />

      <div class="flex justify-center mt-4">
        <button
          onClick={() => {
            props.setCurrentSection('');
            props.setAudioData({
              url: '',
              isPlaying: false,
              showReplayButton: false,
            });
          }}
          class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-4"
        >
          العودة
        </button>
      </div>
    </div>
  );
}

export default AudioSection;