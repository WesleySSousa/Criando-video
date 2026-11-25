import { Stack } from 'expo-router';

import { C } from '@/lib/theme';

export const unstable_settings = { initialRouteName: 'entrar' };

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right' }} />;
}
