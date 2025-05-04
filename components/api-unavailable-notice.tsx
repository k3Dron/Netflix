export default function ApiUnavailableNotice() {
  return (
    <div className="bg-red-900/20 border border-red-700 rounded-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-red-500 mb-2">API Connection Issue</h3>
      <p className="text-sm text-gray-300">
        We're currently unable to connect to the movie database API. You're seeing sample data instead of live content.
      </p>
      <p className="text-sm text-gray-300 mt-2">
        The application is using the OMDB API with the key provided in the code.
      </p>
    </div>
  )
}
