import { createSignal, Show, createEffect } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showReplayButton, setShowReplayButton] = createSignal(false);
  let audioRef;

  const handleTextToSpeech = async () => {
    if (!inputText()) return;
    setLoading(true);
    try {
      // Correct the text first
      const correctionResult = await createEvent('chatgpt_request', {
        prompt: `قم بتصحيح النص التالي: "${inputText()}". أعد النص المصحح فقط.`,
        response_type: 'text',
      });
      // Now proceed to convert corrected text to speech
      const result = await createEvent('text_to_speech', {
        text: correctionResult.trim(),
        format: 'mp3',
      });
      setAudioUrl(result);
      setShowReplayButton(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!audioUrl()) return;
    try {
      const response = await fetch(audioUrl());
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

  createEffect(() => {
    if (audioUrl() && audioRef) {
      audioRef.play();
    }
  });

  const togglePlayPause = () => {
    if (isPlaying()) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setShowReplayButton(true);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-3xl mx-auto h-full">
        <h1 class="text-4xl font-bold text-purple-600 mb-8 text-center">تحويل النص إلى كلام</h1>

        <div class="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
          <textarea
            placeholder="أدخل النص هنا..."
            value={inputText()}
            onInput={(e) => setInputText(e.target.value)}
            class="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-right flex-grow"
          ></textarea>

          <button
            onClick={handleTextToSpeech}
            class={`mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 ${
              loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={loading()}
          >
            {loading() ? 'جاري التحويل...' : 'تحويل النص إلى كلام'}
          </button>
        </div>

        <Show when={audioUrl()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">النص المحول إلى صوت</h3>
            <audio
              ref={audioRef}
              src={audioUrl()}
              class="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleAudioEnded}
            />
            <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
              <button
                onClick={togglePlayPause}
                class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
              >
                {isPlaying() ? 'إيقاف الاستماع' : 'تشغيل الاستماع'}
              </button>
              <Show when={showReplayButton()}>
                <button
                  onClick={() => {
                    audioRef.currentTime = 0;
                    audioRef.play();
                    setShowReplayButton(false);
                  }}
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
        </Show>
      </div>
    </div>
  );
}

export default App;