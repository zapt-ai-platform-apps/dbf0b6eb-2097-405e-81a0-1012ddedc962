import { createSignal, Show, createEffect } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [voiceOption, setVoiceOption] = createSignal('default');
  const [speed, setSpeed] = createSignal(1);
  let audioRef;

  const handleTextToSpeech = async () => {
    if (!inputText()) return;
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: inputText(),
        format: 'mp3',
        voice: voiceOption(),
        speed: speed(),
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
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

          <div class="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div class="flex-1 mb-4 md:mb-0">
              <label class="block text-gray-700 mb-2">اختر الصوت:</label>
              <select
                value={voiceOption()}
                onChange={(e) => setVoiceOption(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
              >
                <option value="default">افتراضي</option>
                <option value="male">صوت رجل</option>
                <option value="female">صوت امرأة</option>
                <option value="child">صوت طفل</option>
              </select>
            </div>

            <div class="flex-1">
              <label class="block text-gray-700 mb-2">سرعة القراءة:</label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speed()}
                onInput={(e) => setSpeed(parseFloat(e.target.value))}
                class="w-full cursor-pointer"
              />
              <div class="text-center mt-2">{`السرعة: ${speed()}x`}</div>
            </div>
          </div>

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
            <audio ref={audioRef} src={audioUrl()} controls class="w-full" />
            <button
              onClick={handleDownload}
              class="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              تحميل الصوت بصيغة MP3
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;