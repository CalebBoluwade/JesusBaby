export default function MessagePage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h2 className="text-4xl font-bold text-blue-800 mb-6">
        Jesus Christ: Our Deliverer and Hope
      </h2>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
        In a world filled with struggles, we find ultimate deliverance and new
        life through Jesus Christ. He offers freedom from the chains of
        addiction, the darkness of depression, and a path to true purpose.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-2xl font-semibold text-yellow-600 mb-3">
            Deliverance from Addiction
          </h3>
          <p className="italic text-gray-700 mb-2">
            &#34;Therefore, if anyone is in Christ, he is a new creation. The
            old has passed away; behold, the new has come.&#34;
          </p>
          <p className="font-bold text-yellow-700">2 Corinthians 5:17</p>
          <p className="mt-4 text-gray-600">
            Through Christ, we are given the power to break free from habits and
            strongholds that once controlled us.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-2xl font-semibold text-green-600 mb-3">
            Freedom from Depression
          </h3>
          <p className="italic text-gray-700 mb-2">
            &#34;The Lord is close to the brokenhearted and saves those who are
            crushed in spirit.&#34;
          </p>
          <p className="font-bold text-green-700">Psalm 34:18</p>
          <p className="mt-4 text-gray-600">
            God offers comfort, peace, and hope to those struggling with
            depression, leading them into light.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <img
          src="/jesus_christ_light.png"
          alt="Jesus Christ with open arms in light"
          className="mx-auto rounded-lg shadow-xl max-w-md"
        />
        <p className="text-sm text-gray-500 mt-4">
          &#34;Come to me, all who labor and are heavy laden, and I will give
          you rest.&#34; - Matthew 11:28
        </p>
      </div>
    </div>
  );
}
