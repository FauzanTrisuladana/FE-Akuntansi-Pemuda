import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/laporan-keuangan")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/laporan-keuangan"!</div>;
}
