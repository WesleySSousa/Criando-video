import { Stack } from 'expo-router';

import { C } from '@/lib/theme';

export const unstable_settings = { initialRouteName: 'inicio' };

export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right' }} />;
}
