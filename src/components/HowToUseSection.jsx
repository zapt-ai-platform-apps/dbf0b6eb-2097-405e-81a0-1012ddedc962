function HowToUseSection(props) {
  return (
    <div class="mt-8 text-right">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">كيفية الاستخدام</h2>
      <ol class="list-decimal pr-6 space-y-4">
        <li>
          <strong>إدخال النص:</strong>
          <p>
            عند فتح التطبيق، ستجد مربع نص في وسط الصفحة. أدخل النص العربي الذي ترغب في
            معالجته. النص المدخل سيظل دون تغيير.
          </p>
        </li>
        <li>
          <strong>اختيار العملية:</strong>
          <p>
            أسفل مربع النص، ستجد أزرارًا لكل من: تحويل النص إلى كلام، تشكيل النص، تصحيح النص،
            إعادة صياغة النص. اختر العملية التي ترغب في تطبيقها.
          </p>
        </li>
        <li>
          <strong>عرض النتائج:</strong>
          <p>
            بعد اختيار العملية، ستظهر لك النتائج مع خيارات إضافية مثل النسخ، التنزيل، والاستماع.
          </p>
        </li>
        <li>
          <strong>التحكم في الصوت:</strong>
          <p>
            يمكنك إيقاف، استئناف، أو إعادة تشغيل الصوت، بالإضافة إلى إمكانية تنزيله.
          </p>
        </li>
        <li>
          <strong>العودة:</strong>
          <p>
            للرجوع وإجراء عملية جديدة، اضغط على زر "العودة" في أسفل الصفحة.
          </p>
        </li>
      </ol>
      <div class="flex justify-center mt-4">
        <button
          onClick={() => {
            props.setCurrentSection('');
          }}
          class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-4"
        >
          العودة
        </button>
      </div>
    </div>
  );
}

export default HowToUseSection;