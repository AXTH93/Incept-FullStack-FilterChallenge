import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">
        Welcome to the Filter App
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Click the button below to select your filters.
      </p>
      <Link href="/filters">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200">
          Go to Filters
        </button>
      </Link>
    </div>
  );
}
