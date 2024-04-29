import { createFileRoute } from '@tanstack/react-router';
import Profiles from '../pages/primary/profiles';

export const Route = createFileRoute('/layout/profiles')({
  component: Profiles,
});
