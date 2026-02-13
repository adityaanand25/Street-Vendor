import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg">
          <Compass size={28} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-600 mb-8">
          We could not find that page. Head back home or jump into the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            <ArrowLeft size={18} />
            Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition"
          >
            <Home size={18} />
            Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-orange-200 text-orange-700 font-semibold hover:bg-orange-50 transition"
          >
            <Compass size={18} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
