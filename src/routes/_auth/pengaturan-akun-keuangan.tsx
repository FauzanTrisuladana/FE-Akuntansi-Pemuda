import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/pengaturan-akun-keuangan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/pengaturan-akun-keuangan"!</div>
}
