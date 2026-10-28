/* Huxcasti Universe: globo giratorio independiente; insignia fija.
   Sin peticiones de red: se genera la textura localmente en el navegador. */
(() => {
  'use strict';
  const root = document.querySelector('#fallback .hx-portfolio .f-core.hx-minimal-core');
  const original = root?.querySelector('.hx-core-planet-logo');
  const layer = root?.querySelector('.hx-core-globe-canvas');
  if (!root || !original || !layer) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const SIZE = 232, MID = SIZE / 2, RADIUS = 111;
  layer.width = layer.height = SIZE;
  const context = layer.getContext('2d', {alpha:true});
  if (!context) return;

  // Ruido orgánico determinista: nubes y relieve azul, nunca letras repetidas.
  function hash(x,y) { let z = Math.sin(x*127.1+y*311.7)*43758.5453; return z-Math.floor(z); }
  function noise(x,y) {
    let i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j;
    fx=fx*fx*(3-2*fx); fy=fy*fy*(3-2*fy);
    let a=hash(i,j)*(1-fx)+hash(i+1,j)*fx;
    let b=hash(i,j+1)*(1-fx)+hash(i+1,j+1)*fx;
    return a*(1-fy)+b*fy;
  }
  const TW=512,TH=256,tex=new Uint8ClampedArray(TW*TH*3);
  for (let y=0;y<TH;y++) for(let x=0;x<TW;x++) {
    const u=x/TW,v=y/TH;
    const sweep=Math.sin(u*18+v*21)*0.06 + Math.sin(u*34-v*19)*0.035;
    const n=noise(u*8+2,v*5)+0.48*noise(u*19+6,v*12+3)+0.25*noise(u*46,v*30);
    const mist=noise(u*34+3,v*23+2)*0.63+noise(u*68,v*48)*0.37;
    const land=Math.max(0,Math.min(1,(n/1.73-0.34+sweep)*3.6));
    const clouds=Math.max(0,Math.min(1,(mist-0.57)*2.9));
    const wave=Math.max(0,Math.min(1,noise(u*90+11,v*56+8)-0.54));
    const k=(y*TW+x)*3;
    tex[k]  =6+land*15+clouds*50+wave*25;
    tex[k+1]=22+land*66+clouds*108+wave*45;
    tex[k+2]=52+land*115+clouds*134+wave*65;
  }
  // La H y HUXCASTI se extraen del archivo original una sola vez.
  // Se guardan en una capa inmóvil, sin la fotografía del planeta detrás.
  function emblemFrom(originalImage) {
    const c=document.createElement('canvas'); c.width=c.height=SIZE;
    const cx=c.getContext('2d',{willReadFrequently:true});
    cx.drawImage(originalImage,0,0,SIZE,SIZE);
    const pixels=cx.getImageData(0,0,SIZE,SIZE);
    const d=pixels.data;
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++) {
      const i=(y*SIZE+x)*4, X=x*280/SIZE, Y=y*280/SIZE;
      const r=d[i],g=d[i+1],b=d[i+2];
      const inH=X>=79&&X<=208&&Y>=58&&Y<=184;
      const inName=X>=34&&X<=248&&Y>=187&&Y<=215;
      let a=0;
      if(inH) {
        const amount=Math.min(1,Math.max(0,(g-110)/75));
        a=amount*Math.min(1,Math.max(0,(b-r-14)/36));
      } else if(inName) {
        a=Math.min(1,Math.max(0,(g-99)/67))*Math.min(1,Math.max(0,(b-r-5)/36));
      }
      d[i+3]=Math.round(d[i+3]*a);
    }
    cx.putImageData(pixels,0,0);
    return c;
  }
  let emblem;
  const geometry=[];
  const frame=context.createImageData(SIZE,SIZE),dst=frame.data;
  for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
    const dx=(x+0.5-MID)/RADIUS,dy=(y+0.5-MID)/RADIUS;
    const rr=dx*dx+dy*dy, dest=(y*SIZE+x)*4;
    if(rr>1){dst[dest+3]=0;continue;}
    const z=Math.sqrt(Math.max(0,1-rr));
    const longitude=Math.atan2(dx,z)/(2*Math.PI);
    const latitude=Math.asin(dy)/Math.PI+0.5;
    const light=Math.max(0.28,Math.min(1.12,0.60+0.23*z-0.13*dx-0.10*dy));
    const edge=Math.pow(Math.max(0,1-Math.sqrt(rr)),0.14);
    geometry.push({dest,longitude,latitude,light,edge});
    dst[dest+3]=255;
  }
  function paint(phase){
    dst.fill(0);
    for(const p of geometry){
      const u=(p.longitude+phase+1)%1;
      const xx=Math.min(TW-1,Math.floor(u*TW));
      const yy=Math.min(TH-1,Math.floor(p.latitude*TH));
      const ti=(yy*TW+xx)*3,k=p.dest;
      const rim=Math.pow(1-p.edge,8)*0.8;
      dst[k]  =Math.min(255,tex[ti]*p.light+29*rim);
      dst[k+1]=Math.min(255,tex[ti+1]*p.light+144*rim);
      dst[k+2]=Math.min(255,tex[ti+2]*p.light+207*rim);
      dst[k+3]=255;
    }
    context.putImageData(frame,0,0);
    context.drawImage(emblem,0,0,SIZE,SIZE);
  }
  let raf=0,last=0,phase=0;
  function draw(now){
    raf=0;
    if(document.hidden)return;
    if(!last)last=now;
    const elapsed=Math.min(110,now-last);
    last=now;
    if(!reduced.matches)phase=(phase+elapsed/75000)%1;
    paint(phase);
    if(!reduced.matches)raf=requestAnimationFrame(draw);
  }
  function start(){
    cancelAnimationFrame(raf);raf=0;last=0;
    if(!document.hidden)raf=requestAnimationFrame(draw);
  }
  function ready(){
    try{
      emblem=emblemFrom(original);
      // Primera imagen renderizada antes de ocultar el recurso anterior.
      paint(0);
      root.classList.add('hx-globe-ready');
      start();
    }catch(err){ console.warn('Huxcasti: se mantiene el logo original.',err); }
  }
  if(original.complete&&original.naturalWidth)ready();
  else original.addEventListener('load',ready,{once:true});
  document.addEventListener('visibilitychange',start);
  reduced.addEventListener?.('change',start);
})();
