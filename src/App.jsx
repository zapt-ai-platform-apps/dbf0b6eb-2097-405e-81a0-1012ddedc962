import { createSignal } from 'solid-js';
import InputSection from './components/InputSection';
import CorrectedSection from './components/CorrectedSection';
import DiacritizedSection from './components/DiacritizedSection';
import RephrasedSection from './components/RephrasedSection';
import AudioSection from './components/AudioSection';

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
        <h1 class="text-4xl font-bold text-purple-600 mb-8 text-center">تحويل النص إلى كلام</h1>

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
      </div>
    </div>
  );
}

export default App;