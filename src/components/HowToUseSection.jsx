function HowToUseSection(props) {
  return (
    <div class="mt-8 text-right">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">كيفية الاستخدام</h2>
      <ol class="list-decimal pr-6 space-y-4">
        <li>
          <strong>إدخال النص:</strong>
          <p>
            عند فتح التطبيق، ستجد مربع نص كبير في وسط الصفحة. أدخل النص العربي الذي ترغب في
            معالجته. النص في هذا المربع لن يتم تغييره بعد ذلك.
          </p>
        </li>
        <li>
          <strong>اختيار العملية:</strong>
          <p>
            أسفل مربع النص، ستجد أزرارًا لكل من: تحويل النص إلى كلام، تشكيل النص، تصحيح النص،
            إعادة صياغة النص. اختر العملية التي ترغب في تطبيقها على النص.
          </p>
        </li>
        <li>
          <strong>عرض النتائج:</strong>
          <p>
            بعد اختيار العملية، سيتم نقلك إلى صفحة جديدة تعرض: النص الناتج، أزرار النسخ والتنزيل،
            زر الاستماع، أزرار التحكم في الصوت.
          </p>
        </li>
        <li>
          <strong>التحكم في الصوت:</strong>
          <p>
            بعد بدء التشغيل التلقائي للصوت، يمكنك: إيقاف الاستماع، متابعة الاستماع، إعادة
            الاستماع، تحميل الصوت.
          </p>
        </li>
        <li>
          <strong>العودة إلى الصفحة الرئيسية:</strong>
          <p>
            في أي وقت، يمكنك الضغط على زر "العودة" للرجوع إلى الصفحة الرئيسية وإدخال نص جديد أو
            اختيار عملية أخرى.
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