import { createLazyFileRoute } from '@tanstack/react-router'
import Login from '@/pages/login';

export const Route = createLazyFileRoute('/')({
  component: Login
})
