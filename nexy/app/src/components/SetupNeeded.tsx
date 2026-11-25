import { Text, View } from 'react-native';

import { Brand, Notice, Screen, Title } from '@/components/ui';
import { C } from '@/lib/theme';

/** Aparece quando o arquivo .env ainda não tem as chaves do Supabase. */
export default function SetupNeeded() {
  return (
    <Screen>
      <Brand />
      <Title sub="Falta conectar o app ao Supabase, que guarda as contas e envia os SMS.">Quase lá</Title>
      <Notice tone="info">
        Crie o arquivo <Text style={{ fontWeight: '700' }}>.env</Text> na pasta do app (copie o .env.example), preencha
        EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY e reinicie com “npx expo start”.
      </Notice>
      <View style={{ gap: 6 }}>
        <Text style={{ color: C.muted, fontSize: 14, lineHeight: 20 }}>
          O passo a passo completo está no README.md da pasta nexy/app.
        </Text>
      </View>
    </Screen>
  );
}
