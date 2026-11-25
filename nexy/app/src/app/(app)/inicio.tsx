import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Brand, Button, Notice, Screen, Title, s } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { flow } from '@/lib/flow';
import { fromE164 } from '@/lib/phone';
import { supabase } from '@/lib/supabase';
import { C } from '@/lib/theme';

type Profile = { nome: string | null; email: string | null; telefone: string | null; criado_em: string };

export default function Inicio() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saindo, setSaindo] = useState(false);
  const user = session?.user;

  useEffect(() => {
    if (flow.pendingRecovery) {
      flow.pendingRecovery = false;
      router.push('/nova-senha');
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('nome,email,telefone,criado_em')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  const nome = profile?.nome ?? (user?.user_metadata?.nome as string | undefined) ?? '';
  const email = profile?.email ?? (user?.user_metadata?.email as string | undefined) ?? '';

  return (
    <Screen>
      <Brand />
      <Title sub="Sua conta está criada e o celular foi confirmado.">Olá{nome ? `, ${nome.split(' ')[0]}` : ''}!</Title>

      <View style={{ backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 18, gap: 14 }}>
        <Linha rotulo="Nome" valor={nome || '—'} />
        <Linha rotulo="Celular" valor={`+55 ${fromE164(user?.phone ? `+${user.phone}` : '')}`} selo={user?.phone_confirmed_at ? 'Verificado' : undefined} />
        <Linha rotulo="E-mail" valor={email || '—'} />
      </View>

      <Notice>As listas, a IA e a câmera entram nas próximas etapas. Esta versão já tem conta, login e verificação por SMS funcionando de verdade.</Notice>

      <View style={{ flex: 1 }} />
      <Button title="Trocar senha" variant="glass" onPress={() => router.push('/nova-senha')} />
      <Button
        title="Sair"
        variant="glass"
        loading={saindo}
        onPress={async () => {
          setSaindo(true);
          await supabase.auth.signOut();
        }}
      />
    </Screen>
  );
}

function Linha({ rotulo, valor, selo }: { rotulo: string; valor: string; selo?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={[s.sub, { width: 70, fontSize: 14 }]}>{rotulo}</Text>
      <Text style={{ color: C.fg, fontSize: 15, flex: 1 }} numberOfLines={1}>
        {valor}
      </Text>
      {selo ? (
        <Text style={{ color: C.ok, fontSize: 11, fontWeight: '700', backgroundColor: 'rgba(52,211,153,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: 'hidden' }}>
          {selo}
        </Text>
      ) : null}
    </View>
  );
}
