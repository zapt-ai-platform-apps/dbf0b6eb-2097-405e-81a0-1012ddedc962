import { createSignal } from 'solid-js';
import InputSection from './components/InputSection';
import CorrectedSection from './components/CorrectedSection';
import DiacritizedSection from './components/DiacritizedSection';
import RephrasedSection from './components/RephrasedSection';
import AudioSection from './components/AudioSection';
import HowToUseSection from './components/HowToUseSection';

function App() {
  const [inputText, setInputText] = createSignal('');
  const [currentSection, setCurrentSection] = createSignal('');
  const [correctedText, setCorrectedText] = createSignal('');
  const [diacritizedText, setDiacritizedText] = createSignal('');
  const [rephrasedText, setRephrasedText] = createSignal('');
  const [audioData, setAudioData] = createSignal({
    url: '',
    isPlaying: false,
    showReplayButton: false,
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-3xl mx-auto h-full">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">تحويل النص إلى كلام</h1>
          <button
            onClick={() => setCurrentSection('howToUse')}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            كيفية الاستخدام
          </button>
        </div>

        {currentSection() === '' && (
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            setCurrentSection={setCurrentSection}
            setCorrectedText={setCorrectedText}
            setDiacritizedText={setDiacritizedText}
            setRephrasedText={setRephrasedText}
            setAudioData={setAudioData}
            originalText={inputText}
          />
        )}

        {currentSection() === 'corrected' && (
          <CorrectedSection
            correctedText={correctedText}
            setCurrentSection={setCurrentSection}
            originalText={inputText}
          />
        )}

        {currentSection() === 'diacritized' && (
          <DiacritizedSection
            diacritizedText={diacritizedText}
            setCurrentSection={setCurrentSection}
            originalText={inputText}
          />
        )}

        {currentSection() === 'rephrased' && (
          <RephrasedSection
            rephrasedText={rephrasedText}
            setCurrentSection={setCurrentSection}
            originalText={inputText}
          />
        )}

        {currentSection() === 'audio' && (
          <AudioSection
            audioData={audioData}
            setAudioData={setAudioData}
            setCurrentSection={setCurrentSection}
          />
        )}

        {currentSection() === 'howToUse' && (
          <HowToUseSection setCurrentSection={setCurrentSection} />
        )}
      </div>
    </div>
  );
}

export default App;