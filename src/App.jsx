import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

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
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">تسجيل الدخول باستخدام ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                تعرف على المزيد حول ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
              />
            </div>
          </div>
        }
      >
        <div class="max-w-3xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">تحويل النص إلى كلام</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              تسجيل الخروج
            </button>
          </div>

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
      </Show>
    </div>
  );
}

export default App;