import json,re
R='/home/user/Criando-video/serie/ep01/'
VO=json.load(open(R+'audio/vo_times.json'));ana=json.load(open(R+'audio/src/ana.json'))
def fmt(s):
    ms=int(round(max(0,s)*1000));return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
cues=[]
for v in VO['lines']:
    txt=v['texto']; i=v['arquivo']; spk=v.get('speaker')
    segs=[p.strip() for p in re.findall(r'[^.:?]+[.:?]?',txt) if p.strip()]
    sp=[]
    for g in segs:
        if len(g.split())>8 and ',' in g:
            a_,b_=g.split(',',1);sp+=[a_.strip()+',',b_.strip()]
        else: sp.append(g)
    sp2=[]
    for g in sp:
        w=g.split()
        if len(w)>8:
            k=(len(w)+1)//2;sp2+=[' '.join(w[:k]),' '.join(w[k:])]
        else: sp2.append(g)
    sp=sp2
    blocks=[];cur=[]
    for g in sp:
        n=len(g.split())
        if cur and sum(len(q.split()) for q in cur)+n>8: blocks.append(cur);cur=[]
        cur.append(g)
    if cur: blocks.append(cur)
    if len(blocks)>1 and len(' '.join(blocks[-1]).split())<=2 and len(' '.join(blocks[-2]+blocks[-1]).split())<=9:
        blocks[-2]+=blocks[-1];blocks.pop()
    fin=[]
    for b in blocks:
        w=' '.join(b).split()
        if len(w)>9:
            k=(len(w)+1)//2;fin.append([' '.join(w[:k]),' '.join(w[k:])])
        elif len(b)>=2:
            # quebra de linha na fronteira de frase mais proxima do meio
            best=min(range(1,len(b)),key=lambda k:abs(len(' '.join(b[:k]).split())-len(' '.join(b[k:]).split())))
            fin.append([' '.join(b[:best]),' '.join(b[best:])])
        else:
            if len(w)>4:
                m=re.match(r'(.+?,)\s(.+)',b[0])
                if m and len(m.group(1).split())>=2: fin.append([m.group(1),m.group(2)])
                else: k=(len(w)+1)//2;fin.append([' '.join(w[:k]),' '.join(w[k:])])
            else: fin.append([b[0]])
    chars=[len(' '.join(b))+1 for b in fin];tot=sum(chars);t0=v['t'];d=v['dur']
    pos=0
    for b,c in zip(fin,chars):
        a=t0+d*pos/tot;e=t0+d*(pos+c)/tot;pos+=c
        # snap ao fim em pausa interna
        for pc,pd in ana[i]['pauses']:
            tp=t0+pc
            if abs(tp-e)<.4 and pd>=.25: e=tp-pd/2+.05
            if abs(tp-a)<.4 and pd>=.25: a=tp+pd/2-.05
        if spk: b[0]=spk+': '+b[0]
        b='\n'.join(b)
        if v.get('who')=='S': b='\n'.join('<i>'+x+'</i>' for x in b.split('\n'))
        cues.append(dict(t0=a,t1=e+.15,text=b,l=v['id']))
# garante ordem, sem sobreposicao, duracao minima legivel
cues.sort(key=lambda c:c['t0'])
for k,c in enumerate(cues):
    if k+1<len(cues): c['t1']=min(c['t1'],cues[k+1]['t0']-.02)
    c['t1']=max(c['t1'],c['t0']+.6) if k+1==len(cues) or c['t0']+.6<cues[k+1]['t0'] else c['t1']
open(R+'audio/legenda.srt','w',encoding='utf-8').write('\n'.join(f"{k+1}\n{fmt(c['t0'])} --> {fmt(c['t1'])}\n{c['text']}\n" for k,c in enumerate(cues)))
json.dump(cues,open(R+'audio/src/cues.json','w'),ensure_ascii=False)
print(len(cues),max(len(c['text'].replace('<i>','').replace('</i>','').split()) for c in cues))
