import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">403</h1>
        <p className="text-lg text-slate-600">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          to="/dashboard"
          className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
