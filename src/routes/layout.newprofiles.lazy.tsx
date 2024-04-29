import { createLazyFileRoute } from '@tanstack/react-router';
import NewProfiles from '@/pages/primary/profiles/new-profiles';

export const Route = createLazyFileRoute('/layout/newprofiles')({
  component: NewProfiles,
});
