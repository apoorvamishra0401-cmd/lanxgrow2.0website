import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../public/founder-homepage.html',import.meta.url),'utf8');
const fn=html.match(/function endInterview\(reason='finished'\)\{[\s\S]*?(?=\nfunction )/)[0];
for(const audience of ['student','fresher','professional'])for(const answers of [[],['Synthetic answer']])for(const reason of ['finished','time']){
 const nodes=new Map();const el=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,textContent:'',replaceChildren(){},focus(){}});return nodes.get(id)};
 const ctx={ended:false,answers,preferredName:'',interviewAudience:audience,interviewQuestions:{[audience]:['Question']},collectAnswer(){},stopTimer(){},$:el,document:{createElement(){return {textContent:'',append(){}}}},dialog:{scrollTop:0},requestAnimationFrame(f){f()}};
 vm.createContext(ctx);vm.runInContext(fn+`;endInterview('${reason}');`,ctx);
 assert.equal(el('#interviewFlow').hidden,false);assert.equal(el('#interviewComplete').hidden,false);assert.equal(el('#activeInterview').hidden,true);
}
console.log('PASS: 12 completion cases preserve visible report/Google gate (DOM fixture, not browser evidence)');
