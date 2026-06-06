import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/transaksi-keuangan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/transaksi-keuangan"!</div>
}
