import { createSignal, Show } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');

  const handleTextToSpeech = async () => {
    if (!inputText()) return;
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: inputText()
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold text-purple-600 mb-8 text-center">تحويل النص إلى كلام</h1>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <textarea
            placeholder="أدخل النص هنا..."
            value={inputText()}
            onInput={(e) => setInputText(e.target.value)}
            class="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-right"
          ></textarea>
          <button
            onClick={handleTextToSpeech}
            class={`mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            {loading() ? 'جاري التحويل...' : 'تحويل النص إلى كلام'}
          </button>
        </div>

        <Show when={audioUrl()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">النص المحول إلى صوت</h3>
            <audio controls src={audioUrl()} class="w-full" />
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;