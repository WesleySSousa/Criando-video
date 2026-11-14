"""LOGADO ep01 (rev. narracao normal + pais): gera audio/vo_times.json e filme/tempos.json
a partir de voz/*.mp3 (medidos em ana.json). Planos ajustados a voz real; nenhum plano > 4 s."""
import json,sys
sys.path.insert(0,'.')
import plan as P
R='/home/user/Criando-video/serie/ep01/'
S,E=P.S,P.E
dur={k:round(P.dur[k],2) for k in P.dur}
T=round(E['l27']+2.4,2)   # cauda de pad/vento; plano 40 termina no quadro do plano 1 (loop)
# (id, plano, fim do plano em s). Cortes em pausas ou 0,2-0,3 s antes da fala seguinte.
cuts=[('1',1,S['l02']-.25),('2',2,S['l02']+2.4),('3a',3,S['p01_pai']-.25),('3b',3,S['p02_mae']-.25),
('3c',3,12.6),('3d',3,14.85),('4',4,18.5),('5a',5,20.2),('5b',5,S['l05']-.3),('6',6,S['l05']+1.5),
('7',7,S['l06']+.9),('8',8,S['l07']+.78),('9',9,S['l07']+3.4),('10',10,E['l08']+.05),('11',11,E['l09']+.08),
('12',12,S['l10']+1.1),('13',13,S['l11']+.88),('14',14,S['l12']+.85),('15',15,S['l12']+3.0),
('16',16,S['l13']-.25),('17',17,S['l13']+2.36),('18',18,S['l14']+.9),('19',19,S['l14']+3.98),
('20',20,S['l15']+2.49),('21',21,S['l16']-.25),('22',22,S['l17']-.25),('23',23,S['l17']+1.6),
('24',24,S['l18']-.25),('25a',25,S['l18']+1.25),('25b',25,S['l19']-.25),('26',26,S['l20']-.25),
('27',27,S['l20']+2.76),('28',28,S['l22']-.25),('29',29,S['l22']+2.1),('30',30,S['l23']-.25),
('31',31,S['l23']+2.7),('32',32,S['l24']-.25),('33',33,S['l24']+2.24),('34',34,S['l25']-.25),
('35',35,S['l25']+2.8),('36',36,S['l26']-.08),('37',37,E['l26']+.05),('38',38,S['l27']+3.5),
('39',39,S['l27']+6.45),('40',40,T)]
cuts=[(a,b,round(c,2)) for a,b,c in cuts]
ev={'2':[(0.15,'titulo LOGADO entra (2,6 s)')],'7':[(0.1,'cartao Nivel 1 entra (2,0 s)')],
'9':[(0.5,'golpe 3'),(1.1,'golpe 2'),(1.7,'erro'),(2.2,'+1 cura')],
'10':[(0.3,'golpe 4'),(1.0,'slime acerta -4 (36/40)'),(2.0,'golpe 3')],
'11':[(0.15,'erro'),(0.3,'+1 cura'),(0.4,'slime acerta -4 (32/40)')],
'12':[(0.2,'golpe 3'),(0.45,'golpe 4'),(0.7,'golpe 3'),(0.85,'estouro, cronometro para em 0:13'),(1.12,'gosma salta da poca (L10 comeca em 32,62)')],
'15':[(0.0,'65% entra')],'28':[(0.4,'golpes 5,4,5,6'),(1.9,'estouro'),(2.6,'selo vira 3, HP 56/56')],
'34':[(1.5,'1 da Carta vira fixo')]}
# planos: contiguos a partir de 0
shots=[];p=0.0
for id_,n,e in cuts:
    assert e>p, (id_,e,p)
    shots.append(dict(id=id_,plano=n,ini=round(p,2),fim=e,dur=round(e-p,2)));p=e
# vozes: falas com inicio audivel t e fim
vl=[]
seq=['l%02d'%i for i in (1,2)]+['p01_pai','p02_mae']+['l%02d'%i for i in range(3,28)]
PAIS={'p01_pai':('p01','ROGÉRIO','Desliga isso, Mateus. Jogo não paga conta.'),'p02_mae':('p02','SANDRA','Filho, sai um pouco dessa tela. Você nem almoçou.')}
import re
txt=open(R+'ROTEIRO.md',encoding='utf-8').read().split('## Linhas faladas')[1].split('Linhas sem tag')[0]
lines={int(m.group(1)):m.group(2).strip() for m in re.finditer(r'^(\d+)\. (.+)$',txt,re.M)}
for k in seq:
    ov=[s['id'] for s in shots if s['ini']<E[k]-0.05 and s['fim']>S[k]+0.05]
    if k in PAIS:
        id_,spk,texto=PAIS[k]
        d=dict(id=id_,linha=None,arquivo=k,speaker=spk,em_cena=True,lowpass_hz=12000,tom='padrao',texto=texto)
    else:
        i=int(k[1:]); tag=re.match(r'\[(\w+)\]',lines[i])
        d=dict(id='l%02d'%i,linha=i,arquivo=k,tom=tag.group(1) if tag else 'padrao',texto=re.sub(r'\[\w+\]\s*','',lines[i]))
        if i in(4,9): d.update(em_cena=True,lowpass_hz=7000,who='S')
    d.update(shot=ov[0],shots=ov,t=round(S[k],2),dur=dur[k],end=round(E[k],2),t_arquivo=round(S[k]-P.A[k]['lead'],2))
    vl.append(d)
json.dump(dict(dur=T,note='t = inicio audivel da fala (s); t_arquivo = onde o mp3 comeca; arquivo = nome em voz/ (sem .mp3); speaker = quem fala (sem campo = narracao do protagonista). Falas dos pais tocam em cena (ambiencia de cozinha).',lines=vl),
     open(R+'audio/vo_times.json','w'),ensure_ascii=False,indent=1)
sh=[]
for s in shots:
    d=dict(id=s['id'],plano=s['plano'],ini=s['ini'],fim=s['fim'],dur=s['dur'])
    if s['id'] in('3a','3b','3c','3d'): d['nota']='plano 3 dividido em 4: 3a fim da L2, 3b Rogerio (P1), 3c/3d Sandra (P2)'
    if s['id'] in('5a','5b'): d['nota']='plano 5 dividido em 2: 5a chegada a porta, 5b quadro-chave (S1 = L4)'
    if s['id'] in('25a','25b'): d['nota']='plano 25 dividido em 2 (fala L18 mais folga passaria de 4 s)'
    d['falas']=[v['id'] for v in vl if s['id'] in v['shots']]
    if s['id'] in ev: d['eventos']=[dict(t=round(s['ini']+o,2),o=o,desc=x) for o,x in ev[s['id']]]
    if s['id']=='33': d['eventos']=[dict(t=round(S['l24']+1.85,2),o=round(S['l24']+1.85-s['ini'],2),desc='icone de Carta pisca 1 (sino)')]
    sh.append(d)
json.dump(dict(dur=T,fps_nota='tempos em segundos; planos contiguos; plano 40 termina no quadro do plano 1 (loop)',n_planos=40,n_entradas=len(sh),planos=sh),open(R+'filme/tempos.json','w'),ensure_ascii=False,indent=1)
mx=max(s['dur'] for s in shots); print('T',T,'entradas',len(sh),'max dur',mx,'min',min(s['dur'] for s in shots))
for v in vl: print(v['id'],v['t'],v['end'],v['shots'])
