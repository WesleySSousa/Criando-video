import numpy as np, subprocess, json
V='/home/user/Criando-video/serie/ep01/voz/'
SR=24000
KEYS=[f'l{i:02d}' for i in range(1,28)]+['p01_pai','p02_mae']
out={}
for k in KEYS:
    raw=subprocess.run(['ffmpeg','-v','quiet','-i',V+f'{k}.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    x=np.frombuffer(raw,dtype=np.float32)
    hop=240; n=len(x)//hop
    r=np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1))+1e-9
    db=20*np.log10(r); act=db>-42
    idx=np.where(act)[0]; a,b=idx[0],idx[-1]+1
    ps=[];s=None
    for q in range(a,b):
        if not act[q]:
            if s is None: s=q
        else:
            if s is not None:
                if (q-s)*0.01>=0.15: ps.append(((s+q)/2*0.01-a*0.01,(q-s)*0.01))
                s=None
    out[k]=dict(lead=a*.01,end=b*.01,dur=(b-a)*.01,full=len(x)/SR,pauses=[(round(p,2),round(d,2)) for p,d in ps])
    print(k,round(a*.01,2),round((b-a)*.01,2))
json.dump(out,open('ana.json','w'),indent=1)
print('soma L', round(sum(out[f"l{i:02d}"]['dur'] for i in range(1,28)),2))
