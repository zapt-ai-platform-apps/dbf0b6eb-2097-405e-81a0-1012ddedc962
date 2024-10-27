import { createSignal, Show, createEffect } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [diacriticsLoading, setDiacriticsLoading] = createSignal(false);
  const [correctionLoading, setCorrectionLoading] = createSignal(false);
  const [rephraseLoading, setRephraseLoading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [correctedText, setCorrectedText] = createSignal('');
  const [diacritizedText, setDiacritizedText] = createSignal('');
  const [rephrasedText, setRephrasedText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [showReplayButton, setShowReplayButton] = createSignal(false);
  const [isAudioPlaying, setIsAudioPlaying] = createSignal(true);
  const [showControlButtons, setShowControlButtons] = createSignal(true);

  const [correctedAudioUrl, setCorrectedAudioUrl] = createSignal('');
  const [showCorrectedReplayButton, setShowCorrectedReplayButton] = createSignal(false);
  const [correctedAudioLoading, setCorrectedAudioLoading] = createSignal(false);
  const [isCorrectedAudioPlaying, setIsCorrectedAudioPlaying] = createSignal(true);
  const [showCorrectedControlButtons, setShowCorrectedControlButtons] = createSignal(true);

  const [diacritizedAudioUrl, setDiacritizedAudioUrl] = createSignal('');
  const [showDiacritizedReplayButton, setShowDiacritizedReplayButton] = createSignal(false);
  const [diacritizedAudioLoading, setDiacritizedAudioLoading] = createSignal(false);
  const [isDiacritizedAudioPlaying, setIsDiacritizedAudioPlaying] = createSignal(true);
  const [showDiacritizedControlButtons, setShowDiacritizedControlButtons] = createSignal(true);

  const [rephrasedAudioUrl, setRephrasedAudioUrl] = createSignal('');
  const [showRephrasedReplayButton, setShowRephrasedReplayButton] = createSignal(false);
  const [rephrasedAudioLoading, setRephrasedAudioLoading] = createSignal(false);
  const [isRephrasedAudioPlaying, setIsRephrasedAudioPlaying] = createSignal(true);
  const [showRephrasedControlButtons, setShowRephrasedControlButtons] = createSignal(true);

  const [copyCorrectedSuccess, setCopyCorrectedSuccess] = createSignal(false);
  const [copyDiacritizedSuccess, setCopyDiacritizedSuccess] = createSignal(false);
  const [copyRephrasedSuccess, setCopyRephrasedSuccess] = createSignal(false);

  const [currentSection, setCurrentSection] = createSignal('');

  let audioRef;
  let correctedAudioRef;
  let diacritizedAudioRef;
  let rephrasedAudioRef;

  const handleTextCorrection = async () => {
    if (!inputText()) return;
    setCorrectionLoading(true);
    try {
      const correctionResult = await createEvent('chatgpt_request', {
        prompt: `قم بتصحيح النص التالي: "${inputText()}". أعد النص المصحح فقط.`,
        response_type: 'text',
      });
      setCorrectedText(correctionResult.trim());
      setCurrentSection('corrected');
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
      setCurrentSection('diacritized');
    } catch (error) {
      console.error('Error adding diacritics:', error);
    } finally {
      setDiacriticsLoading(false);
    }
  };

  const handleRephraseText = async () => {
    const textToUse = correctedText() || inputText();
    if (!textToUse) return;
    setRephraseLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `أعد صياغة النص التالي: "${textToUse}". أعد النص المعاد صياغته فقط.`,
        response_type: 'text',
      });
      setRephrasedText(result.trim());
      setCurrentSection('rephrase');
    } catch (error) {
      console.error('Error rephrasing text:', error);
    } finally {
      setRephraseLoading(false);
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
      setCurrentSection('audio');
      setIsAudioPlaying(true);
      setShowControlButtons(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeechForCorrectedText = async () => {
    if (!correctedText()) return;
    setCorrectedAudioLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: correctedText().trim(),
        format: 'mp3',
      });
      setCorrectedAudioUrl(result);
      setShowCorrectedReplayButton(false);
      setIsCorrectedAudioPlaying(true);
      setShowCorrectedControlButtons(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCorrectedAudioLoading(false);
    }
  };

  const handleTextToSpeechForDiacritizedText = async () => {
    if (!diacritizedText()) return;
    setDiacritizedAudioLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: diacritizedText().trim(),
        format: 'mp3',
      });
      setDiacritizedAudioUrl(result);
      setShowDiacritizedReplayButton(false);
      setIsDiacritizedAudioPlaying(true);
      setShowDiacritizedControlButtons(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDiacritizedAudioLoading(false);
    }
  };

  const handleTextToSpeechForRephrasedText = async () => {
    if (!rephrasedText()) return;
    setRephrasedAudioLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: rephrasedText().trim(),
        format: 'mp3',
      });
      setRephrasedAudioUrl(result);
      setShowRephrasedReplayButton(false);
      setIsRephrasedAudioPlaying(true);
      setShowRephrasedControlButtons(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRephrasedAudioLoading(false);
    }
  };

  const handleCopyCorrectedText = () => {
    if (correctedText()) {
      navigator.clipboard
        .writeText(correctedText())
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
      navigator.clipboard
        .writeText(diacritizedText())
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

  const handleCopyRephrasedText = () => {
    if (rephrasedText()) {
      navigator.clipboard
        .writeText(rephrasedText())
        .then(() => {
          setCopyRephrasedSuccess(true);
          setTimeout(() => setCopyRephrasedSuccess(false), 2000);
        })
        .catch((err) => {
          console.error('Could not copy text:', err);
        });
    }
  };

  const handleDownloadRephrasedText = () => {
    if (!rephrasedText()) return;
    const blob = new Blob([rephrasedText()], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rephrased_text.txt';
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

  const handleDownloadCorrectedAudio = async () => {
    if (!correctedAudioUrl()) return;
    try {
      const response = await fetch(correctedAudioUrl());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'corrected_audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  const handleDownloadDiacritizedAudio = async () => {
    if (!diacritizedAudioUrl()) return;
    try {
      const response = await fetch(diacritizedAudioUrl());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diacritized_audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  const handleDownloadRephrasedAudio = async () => {
    if (!rephrasedAudioUrl()) return;
    try {
      const response = await fetch(rephrasedAudioUrl());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rephrased_audio.mp3';
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

  createEffect(() => {
    if (correctedAudioUrl() && correctedAudioRef) {
      correctedAudioRef.play();
    }
  });

  createEffect(() => {
    if (diacritizedAudioUrl() && diacritizedAudioRef) {
      diacritizedAudioRef.play();
    }
  });

  createEffect(() => {
    if (rephrasedAudioUrl() && rephrasedAudioRef) {
      rephrasedAudioRef.play();
    }
  });

  const handleAudioEnded = () => {
    setShowReplayButton(true);
    setShowControlButtons(false);
  };

  const handleCorrectedAudioEnded = () => {
    setShowCorrectedReplayButton(true);
    setShowCorrectedControlButtons(false);
  };

  const handleDiacritizedAudioEnded = () => {
    setShowDiacritizedReplayButton(true);
    setShowDiacritizedControlButtons(false);
  };

  const handleRephrasedAudioEnded = () => {
    setShowRephrasedReplayButton(true);
    setShowRephrasedControlButtons(false);
  };

  const handlePauseAudio = () => {
    if (audioRef) {
      audioRef.pause();
      setIsAudioPlaying(false);
    }
  };

  const handleResumeAudio = () => {
    if (audioRef) {
      audioRef.play();
      setIsAudioPlaying(true);
    }
  };

  const handlePauseCorrectedAudio = () => {
    if (correctedAudioRef) {
      correctedAudioRef.pause();
      setIsCorrectedAudioPlaying(false);
    }
  };

  const handleResumeCorrectedAudio = () => {
    if (correctedAudioRef) {
      correctedAudioRef.play();
      setIsCorrectedAudioPlaying(true);
    }
  };

  const handlePauseDiacritizedAudio = () => {
    if (diacritizedAudioRef) {
      diacritizedAudioRef.pause();
      setIsDiacritizedAudioPlaying(false);
    }
  };

  const handleResumeDiacritizedAudio = () => {
    if (diacritizedAudioRef) {
      diacritizedAudioRef.play();
      setIsDiacritizedAudioPlaying(true);
    }
  };

  const handlePauseRephrasedAudio = () => {
    if (rephrasedAudioRef) {
      rephrasedAudioRef.pause();
      setIsRephrasedAudioPlaying(false);
    }
  };

  const handleResumeRephrasedAudio = () => {
    if (rephrasedAudioRef) {
      rephrasedAudioRef.play();
      setIsRephrasedAudioPlaying(true);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-3xl mx-auto h-full">
        <h1 class="text-4xl font-bold text-purple-600 mb-8 text-center">تحويل النص إلى كلام</h1>

        <Show when={currentSection() === ''}>
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

              <button
                onClick={handleRephraseText}
                class={`w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer ${
                  rephraseLoading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={rephraseLoading()}
              >
                {rephraseLoading() ? 'جاري إعادة الصياغة...' : 'إعادة صياغة النص'}
              </button>
            </div>
          </div>
        </Show>

        {/* Corrected Text Section */}
        <Show when={currentSection() === 'corrected'}>
          {/* Existing corrected text code */}
          {/* ... */}
        </Show>

        {/* Diacritized Text Section */}
        <Show when={currentSection() === 'diacritized'}>
          {/* Existing diacritized text code */}
          {/* ... */}
        </Show>

        {/* Rephrased Text Section */}
        <Show when={currentSection() === 'rephrase'}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">النص بعد إعادة الصياغة</h3>
            <div class="bg-gray-100 p-4 rounded-lg text-right">
              <p>{rephrasedText()}</p>
            </div>
            <Show when={copyRephrasedSuccess()}>
              <p class="text-green-600 mt-2">تم نسخ النص المعاد صياغته إلى الحافظة</p>
            </Show>
            <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
              <button
                onClick={handleCopyRephrasedText}
                class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
              >
                نسخ النص المعاد صياغته
              </button>
              <button
                onClick={handleDownloadRephrasedText}
                class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer"
              >
                تحميل النص المعاد صياغته بصيغة TXT
              </button>
              <button
                onClick={handleTextToSpeechForRephrasedText}
                class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mt-4 cursor-pointer ${
                  rephrasedAudioLoading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={rephrasedAudioLoading()}
              >
                {rephrasedAudioLoading() ? 'جاري تحويل النص المعاد صياغته...' : 'استماع للنص المعاد صياغته'}
              </button>
            </div>

            {/* Rephrased Audio Section */}
            <Show when={rephrasedAudioUrl()}>
              <div class="mt-4">
                <audio
                  ref={rephrasedAudioRef}
                  src={rephrasedAudioUrl()}
                  class="w-full"
                  autoplay
                  onEnded={handleRephrasedAudioEnded}
                />
                <div class="flex flex-col md:flex-row md:space-x-4 mt-4">
                  <Show when={showRephrasedControlButtons()}>
                    <Show when={isRephrasedAudioPlaying()}>
                      <button
                        onClick={handlePauseRephrasedAudio}
                        class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
                      >
                        إيقاف الاستماع
                      </button>
                    </Show>
                    <Show when={!isRephrasedAudioPlaying()}>
                      <button
                        onClick={handleResumeRephrasedAudio}
                        class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
                      >
                        متابعة الاستماع
                      </button>
                    </Show>
                  </Show>
                  <Show when={showRephrasedReplayButton()}>
                    <button
                      onClick={() => {
                        rephrasedAudioRef.currentTime = 0;
                        rephrasedAudioRef.play();
                        setShowRephrasedReplayButton(false);
                        setShowRephrasedControlButtons(true);
                        setIsRephrasedAudioPlaying(true);
                      }}
                      class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
                    >
                      إعادة الاستماع
                    </button>
                  </Show>
                  <button
                    onClick={handleDownloadRephrasedAudio}
                    class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-2 md:mt-0"
                  >
                    تحميل الصوت بصيغة MP3
                  </button>
                </div>
              </div>
            </Show>

            <div class="flex justify-center mt-4">
              <button
                onClick={() => {
                  setCurrentSection('');
                  setRephrasedText('');
                  setRephrasedAudioUrl('');
                  setShowRephrasedControlButtons(true);
                  setIsRephrasedAudioPlaying(true);
                }}
                class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-4"
              >
                العودة
              </button>
            </div>
          </div>
        </Show>

        {/* Original Audio Section */}
        <Show when={currentSection() === 'audio'}>
          {/* Existing audio playback code */}
          {/* ... */}
        </Show>
      </div>
    </div>
  );
}

export default App;