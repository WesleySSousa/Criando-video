import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth';

/** Porta de entrada: manda para o início se estiver logado, senão para "Entrar". */
export default function Index() {
  const { session } = useAuth();
  return <Redirect href={session ? '/inicio' : '/entrar'} />;
}
