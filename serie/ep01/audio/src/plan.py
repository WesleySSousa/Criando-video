import json
A=json.load(open("ana.json"))
# sequencia de falas (ordem do roteiro rev3: L2 -> P1 -> P2 -> L3 -> L4 ...)
SEQ=['l%02d'%i for i in (1,2)]+['p01_pai','p02_mae']+['l%02d'%i for i in range(3,28)]
dur={k:v['dur'] for k,v in A.items()}
P_A=A
# pausa ANTES de cada fala (padrao 0,32 s; regras do roteiro)
gap={k:.32 for k in SEQ}
gap.update({'l04':.55,'l05':.65,'l09':.6,'l10':1.2,'l16':.45,'l17':.8,'l18':.6,'l19':.4,'l20':.6,'l21':.4,
            'l23':.5,'l24':.45,'l26':.6,'l27':.5,'p01_pai':.4,'p02_mae':.3,'l03':.5})
S={'l01':.2}
for a,b in zip(SEQ,SEQ[1:]): S[b]=S[a]+dur[a]+gap[b]
E={k:S[k]+dur[k] for k in S}
if __name__=='__main__':
    for k in SEQ: print(k, round(S[k],2), round(E[k],2))
    print('T_fala', round(E['l27'],2))
