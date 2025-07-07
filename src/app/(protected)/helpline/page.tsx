export default function Helpline() {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-4">
      <div className="p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Helpline</h1>
        <p className="text-gray-700 text-center mb-6">
          Need assistance? Contact us anytime.
        </p>
        <div className="flex justify-center">
          <a
            href="tel:+1234567890"
            className="bg-[#13244f] hover:bg-[#2b3348] text-white font-semibold py-2 px-4 rounded"
          >
            Call Now: +91 9654941178
          </a>
        </div>
      </div>
    </div>
  );
}
