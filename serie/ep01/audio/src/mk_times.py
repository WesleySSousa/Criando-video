import json,re,sys
sys.path.insert(0,'.')
import plan as P
R='/home/user/Criando-video/serie/ep01/'
txt=open(R+'ROTEIRO.md',encoding='utf-8').read().split('## Linhas faladas')[1].split('Linhas sem tag')[0]
lines={int(m.group(1)):m.group(2).strip() for m in re.finditer(r'^(\d+)\. (.+)$',txt,re.M)}
S,E,shots,T=P.S,P.E,P.shots,round(P.T,2)
for s in shots: s['dur']=round(s['fim']-s['ini'],2)
roteiro_falas={1:'1',2:'2,3',3:'3,4',4:'5',5:'6,7',6:'7,8',7:'8,9,10',8:'10,11',9:'11',10:'12,13',11:'13,14',12:'14,15,16,17',13:'17,18',14:'18,19,20',15:'20,21',16:'22',17:'23,24',18:'25',19:'26',20:'27,28',21:'28',22:'29,30',23:'31,32',24:'33,34',25:'35,36',26:'37,38',27:'38,39,40'}
vl=[]
for i in range(1,28):
    ini,fim=S[i],E[i]
    ov=[s['id'] for s in shots if s['ini']<fim-0.05 and s['fim']>ini+0.05]
    tag=re.match(r'\[(\w+)\]',lines[i]); 
    d=dict(id=f'l{i:02d}',linha=i,shot=ov[0],shots=ov,t=round(ini,2),dur=round(P.dur[i],2),end=round(fim,2),
        t_arquivo=round(ini-P.lead[i],2),who='S' if i in(4,9) else 'N',tom=tag.group(1) if tag else 'padrao',
        texto=re.sub(r'\[\w+\]\s*','',lines[i]))
    if i in(4,9): d['lowpass_hz']=7000; d['em_cena']=True
    vl.append(d)
json.dump(dict(dur=T,note='t = inicio audivel da fala (s); t_arquivo = onde o mp3 comeca (t - silencio inicial); dur = fala sem silencios das pontas; tempos de voz/duracoes.txt',lines=vl),open(R+'audio/vo_times.json','w'),ensure_ascii=False,indent=1)
ev={'2':[(0.15,'titulo LOGADO entra (2,6 s)')],'7':[(0.1,'cartao Nivel 1 entra (2,0 s)')],
'9':[(0.5,'golpe 3'),(1.1,'golpe 2'),(1.7,'erro'),(2.2,'+1 cura')],
'10':[(0.3,'golpe 4'),(1.0,'slime acerta -4 (36/40)'),(2.0,'golpe 3')],
'11':[(0.15,'erro'),(0.3,'+1 cura'),(0.4,'slime acerta -4 (32/40)')],
'12':[(0.2,'golpe 3'),(0.45,'golpe 4'),(0.7,'golpe 3'),(0.85,'estouro, cronometro para em 0:13'),(1.12,'gosma salta da poca (L10 comeca em 32,62)')],
'15':[(0.0,'65% entra')],'28':[(0.4,'golpes 5,4,5,6'),(1.9,'estouro'),(2.6,'selo vira 3, HP 56/56')],
'34':[(1.5,'1 da Carta vira fixo')]}
sh=[]
for s in shots:
    d=dict(id=s['id'],plano=s['plano'],ini=s['ini'],fim=s['fim'],dur=s['dur'])
    if s['id'] in('25a','25b'): d['nota']='plano 25 dividido em 2 (fala L18 de 3,75 s + folga passaria de 4 s); mesmo momento, mesma cena'
    d['falas']=[v['id'] for v in vl if s['id'] in v['shots']]
    if s['id'] in ev: d['eventos']=[dict(t=round(s['ini']+o,2),o=o,desc=x) for o,x in ev[s['id']]]
    sh.append(d)
# abs events fixes
for d in sh:
    if d['id']=='33': d['eventos']=[dict(t=round(S[24]+1.85,2),o=round(S[24]+1.85-d['ini'],2),desc='icone de Carta pisca 1 (sino)')]
json.dump(dict(dur=T,fps_nota='tempos em segundos; planos contiguos; plano final (40) = quadro do plano 1 (loop)',n_planos=40,n_entradas=len(sh),planos=sh),open(R+'filme/tempos.json','w'),ensure_ascii=False,indent=1)
# TEMPOS.md
rot={}
rows=['| Plano | Início | Fim | Dur | Fala(s) (início audível) | Roteiro (s) | Δ |','|---|---|---|---|---|---|---|']
rt=[(0,2.8),(2.8,5.6),(5.6,9.4),(9.4,13.2),(13.2,16.8),(16.8,19.8),(19.8,22.0),(22,25),(25,28),(28,31),(31,34),(34,36),(36,39),(39,42),(42,45),(45,48),(48,51),(51,53),(53,56),(56,59),(59,61.8),(61.8,63.6),(63.6,66.6),(66.6,69.6),(69.6,72.6),(72.6,75),(75,77.5),(77.5,80.5),(80.5,83.5),(83.5,85.5),(85.5,88.5),(88.5,91.5),(91.5,94.5),(94.5,97.5),(97.5,100.5),(100.5,103.5),(103.5,106.5),(106.5,109.5),(109.5,113),(113,116)]
for d in sh:
    f=', '.join(f"{v['id'].upper()}@{v['t']:.2f}" for v in vl if v['shot']==d['id'])
    cont=', '.join(v['id'].upper() for v in vl if d['id'] in v['shots'] and v['shot']!=d['id'])
    if cont: f+=(' ' if f else '')+f'(cont. {cont})'
    r=rt[d['plano']-1]
    rows.append(f"| {d['id']} | {d['ini']:.2f} | {d['fim']:.2f} | {d['dur']:.2f} | {f or '—'} | {r[0]}–{r[1]} | {d['ini']-r[0]:+.1f} |")
open('/tmp/rows.txt','w').write('\n'.join(rows))
print(T,len(sh),max(s['dur'] for s in sh),min(s['dur'] for s in sh))
