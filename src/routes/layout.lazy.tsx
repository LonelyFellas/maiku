import { createLazyFileRoute } from '@tanstack/react-router'
import Layout from '@/pages/layout';

export const Route = createLazyFileRoute('/layout')({
  component: Layout
})
