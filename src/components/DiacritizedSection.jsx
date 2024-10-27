import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import AudioPlayer from './AudioPlayer';

function DiacritizedSection(props) {
  const [copySuccess, setCopySuccess] = createSignal(false);
  const [audioData, setAudioData] = createSignal({
    url: '',
    isPlaying: false,
    showReplayButton: false,
  });
  const [loading, setLoading] = createSignal(false);

  const handleCopyText = () => {
    if (props.diacritizedText()) {
      navigator.clipboard
        .writeText(props.diacritizedText())
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch((err) => {
          console.error('Could not copy text:', err);
        });
    }
  };

  const handleDownloadText = () => {
    if (!props.diacritizedText()) return;
    const blob = new Blob([props.diacritizedText()], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diacritized_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleTextToSpeech = async () => {
    if (!props.diacritizedText()) return;
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: props.diacritizedText().trim(),
        format: 'mp3',
      });
      setAudioData({
        url: result,
        isPlaying: true,
        showReplayButton: false,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="mt-8">
      <h3 class="text-xl font-bold mb-2 text-purple-600">النص المشكَّل</h3>
      <div class="bg-gray-100 p-4 rounded-lg text-right">
        <p>{props.diacritizedText()}</p>
      </div>
      <Show when={copySuccess()}>
        <p class="text-green-600 mt-2">تم نسخ النص المشكَّل إلى الحافظة</p>
      </Show>
      <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
        <button
          onClick={handleCopyText}
          class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
        >
          نسخ النص المشكَّل
        </button>
        <button
          onClick={handleDownloadText}
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
        >
          تحميل النص المشكَّل بصيغة TXT
        </button>
        <button
          onClick={handleTextToSpeech}
          class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading()}
        >
          {loading() ? 'جاري تحويل النص المشكَّل...' : 'استماع للنص المشكَّل'}
        </button>
      </div>

      <Show when={audioData().url}>
        <AudioPlayer audioData={audioData} setAudioData={setAudioData} />
      </Show>

      <div class="flex justify-center mt-4">
        <button
          onClick={() => {
            props.setCurrentSection('');
            props.setDiacritizedText('');
          }}
          class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-4"
        >
          العودة
        </button>
      </div>
    </div>
  );
}

export default DiacritizedSection;