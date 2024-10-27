import { createSignal, Show, createEffect } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [diacriticsLoading, setDiacriticsLoading] = createSignal(false);
  const [correctionLoading, setCorrectionLoading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [correctedText, setCorrectedText] = createSignal('');
  const [diacritizedText, setDiacritizedText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showReplayButton, setShowReplayButton] = createSignal(false);
  const [copyCorrectedSuccess, setCopyCorrectedSuccess] = createSignal(false);
  const [copyDiacritizedSuccess, setCopyDiacritizedSuccess] = createSignal(false);
  let audioRef;

  const handleTextCorrection = async () => {
    if (!inputText()) return;
    setCorrectionLoading(true);
    try {
      const correctionResult = await createEvent('chatgpt_request', {
        prompt: `قم بتصحيح النص التالي: "${inputText()}". أعد النص المصحح فقط.`,
        response_type: 'text',
      });
      setCorrectedText(correctionResult.trim());
    } catch (error) {
      console.error('Error correcting text:', error);
    } finally {
      setCorrectionLoading(false);
    }
  };

  const handleAddDiacritics = async () => {
    const textToUse = correctedText() || inputText();
    if (!textToUse) return;
    setDiacriticsLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `قم بتشكيل النص التالي: "${textToUse}". أعد النص المشكَّل فقط.`,
        response_type: 'text',
      });
      setDiacritizedText(result.trim());
    } catch (error) {
      console.error('Error adding diacritics:', error);
    } finally {
      setDiacriticsLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    const textToUse = correctedText() || inputText();
    if (!textToUse) return;
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: textToUse.trim(),
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

  const handleCopyCorrectedText = () => {
    if (correctedText()) {
      navigator.clipboard.writeText(correctedText())
        .then(() => {
          setCopyCorrectedSuccess(true);
          setTimeout(() => setCopyCorrectedSuccess(false), 2000);
        })
        .catch((err) => {
          console.error('Could not copy text:', err);
        });
    }
  };

  const handleDownloadCorrectedText = () => {
    if (!correctedText()) return;
    const blob = new Blob([correctedText()], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'corrected_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleCopyDiacritizedText = () => {
    if (diacritizedText()) {
      navigator.clipboard.writeText(diacritizedText())
        .then(() => {
          setCopyDiacritizedSuccess(true);
          setTimeout(() => setCopyDiacritizedSuccess(false), 2000);
        })
        .catch((err) => {
          console.error('Could not copy text:', err);
        });
    }
  };

  const handleDownloadDiacritizedText = () => {
    if (!diacritizedText()) return;
    const blob = new Blob([diacritizedText()], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diacritized_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
    <div class="h-full bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-3xl mx-auto h-full">
        <h1 class="text-4xl font-bold text-purple-600 mb-8 text-center">تحويل النص إلى كلام</h1>

        <div class="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
          <textarea
            placeholder="أدخل النص هنا..."
            value={inputText()}
            onInput={(e) => setInputText(e.target.value)}
            class="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-right flex-grow"
          ></textarea>

          <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
            <button
              onClick={handleTextToSpeech}
              class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer ${
                loading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading()}
            >
              {loading() ? 'جاري التحويل...' : 'تحويل النص إلى كلام'}
            </button>

            <button
              onClick={handleAddDiacritics}
              class={`w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer ${
                diacriticsLoading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={diacriticsLoading()}
            >
              {diacriticsLoading() ? 'جاري التشكيل...' : 'تشكيل النص'}
            </button>

            <button
              onClick={handleTextCorrection}
              class={`w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer ${
                correctionLoading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={correctionLoading()}
            >
              {correctionLoading() ? 'جاري التصحيح...' : 'تصحيح النص'}
            </button>
          </div>
        </div>

        <Show when={correctedText()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">النص بعد التصحيح</h3>
            <div class="bg-gray-100 p-4 rounded-lg text-right">
              <p>{correctedText()}</p>
            </div>
            <Show when={copyCorrectedSuccess()}>
              <p class="text-green-600 mt-2">تم نسخ النص المصحح إلى الحافظة</p>
            </Show>
            <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
              <button
                onClick={handleCopyCorrectedText}
                class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
              >
                نسخ النص المصحح
              </button>
              <button
                onClick={handleDownloadCorrectedText}
                class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
              >
                تحميل النص المصحح بصيغة TXT
              </button>
            </div>
          </div>
        </Show>

        <Show when={diacritizedText()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">النص بعد التشكيل</h3>
            <div class="bg-gray-100 p-4 rounded-lg text-right">
              <p>{diacritizedText()}</p>
            </div>
            <Show when={copyDiacritizedSuccess()}>
              <p class="text-green-600 mt-2">تم نسخ النص المشكَّل إلى الحافظة</p>
            </Show>
            <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
              <button
                onClick={handleCopyDiacritizedText}
                class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
              >
                نسخ النص المشكَّل
              </button>
              <button
                onClick={handleDownloadDiacritizedText}
                class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
              >
                تحميل النص المشكَّل بصيغة TXT
              </button>
            </div>
          </div>
        </Show>

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
              <Show when={!showReplayButton()}>
                <button
                  onClick={togglePlayPause}
                  class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
                >
                  {isPlaying() ? 'إيقاف الاستماع' : 'إكمال الاستماع'}
                </button>
              </Show>
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