import { createSignal } from 'solid-js';
import { createEvent } from '../supabaseClient';

function InputSection(props) {
  const [loading, setLoading] = createSignal(false);
  const [diacriticsLoading, setDiacriticsLoading] = createSignal(false);
  const [correctionLoading, setCorrectionLoading] = createSignal(false);
  const [rephraseLoading, setRephraseLoading] = createSignal(false);

  const handleTextCorrection = async () => {
    if (!props.inputText()) return;
    setCorrectionLoading(true);
    try {
      const correctionResult = await createEvent('chatgpt_request', {
        prompt: `قم بتصحيح النص التالي: "${props.inputText()}". أعد النص المصحح فقط.`,
        response_type: 'text',
      });
      props.setCorrectedText(correctionResult.trim());
      props.setCurrentSection('corrected');
    } catch (error) {
      console.error('Error correcting text:', error);
    } finally {
      setCorrectionLoading(false);
    }
  };

  const handleAddDiacritics = async () => {
    if (!props.inputText()) return;
    setDiacriticsLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `قم بتشكيل النص التالي: "${props.inputText()}". أعد النص المشكَّل فقط.`,
        response_type: 'text',
      });
      props.setDiacritizedText(result.trim());
      props.setCurrentSection('diacritized');
    } catch (error) {
      console.error('Error adding diacritics:', error);
    } finally {
      setDiacriticsLoading(false);
    }
  };

  const handleRephraseText = async () => {
    if (!props.inputText()) return;
    setRephraseLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `أعد صياغة النص التالي: "${props.inputText()}". أعد النص المعاد صياغته فقط.`,
        response_type: 'text',
      });
      props.setRephrasedText(result.trim());
      props.setCurrentSection('rephrased');
    } catch (error) {
      console.error('Error rephrasing text:', error);
    } finally {
      setRephraseLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!props.inputText()) return;
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: props.inputText().trim(),
        format: 'mp3',
      });
      props.setAudioData({
        url: result,
        isPlaying: true,
        showReplayButton: false,
      });
      props.setCurrentSection('audio');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <textarea
        placeholder="أدخل النص هنا..."
        value={props.inputText()}
        onInput={(e) => props.setInputText(e.target.value)}
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
  );
}

export default InputSection;