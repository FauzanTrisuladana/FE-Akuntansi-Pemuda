import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/history-riil')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/history-riil"!</div>
}
