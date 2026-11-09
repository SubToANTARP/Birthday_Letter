/* Stage 2: the approved Stage 1 artwork stays intact until activation.
   One requestAnimationFrame loop unfurls SVG contours; no network dependency. */
const frame = document.querySelector('.botanical-frame');
const svgNS = 'http://www.w3.org/2000/svg';
const border = document.createElementNS(svgNS, 'svg');
border.setAttribute('viewBox', '0 0 1000 700');
border.setAttribute('preserveAspectRatio', 'none');
border.classList.add('frame-vines');
let vines = `<path d="M38 681Q5 673 15 625C28 523 0 428 16 339S6 171 17 69Q15 15 65 21C277 5 418 31 578 17S846 23 939 18Q989 15 982 70C970 228 997 331 982 453S992 608 980 657Q981 686 941 681C710 697 570 676 393 689S129 681 38 681Z" fill="none" stroke="#71845d" stroke-width="2.2"/>
<path d="M38 674Q-6 541 25 428T21 175Q2 27 75 29C290 13 436 36 606 25S879 38 948 25Q974 20 972 80C960 227 986 368 974 473S995 668 935 674C715 685 555 669 390 680S119 676 38 674Z" fill="none" stroke="#a5ad82" stroke-width="1.2"/>`;
// Paired, asymmetric lanceolate leaves along the outer frame, never flowers.
for(let i=0;i<23;i++){
 const y=46+i*27;
 for(const side of [0,1]){
  const x=side?979:19, direction=side?-1:1, sign=i%2?1:-1;
  vines+=`<g transform="translate(${x} ${y}) scale(${direction} 1)"><path d="M0 0Q${sign*20} -7 ${sign*25} -23Q${sign*5} -24 0 0" fill="${i%3?'#87966c':'#a2ad82'}" stroke="#6e815b" stroke-width=".6"/><path d="M0 0 ${sign*19} -18" stroke="#c4c9a3" stroke-width=".6"/></g>`;
 }
}
for(let i=0;i<29;i++){
 const x=55+i*32, y=20+Math.sin(i*.7)*5;
 vines+=`<g transform="translate(${x} ${y}) rotate(${i%2?25:155})"><path d="M0 0Q12 -21 30 -18Q23 -1 0 0" fill="${i%3?'#87966c':'#a6b08a'}" stroke="#72815e" stroke-width=".6"/><path d="M0 0 24 -15" stroke="#c4c9a3" stroke-width=".6"/></g>`;
}
border.innerHTML=vines;
frame.append(border);
const positions=[
 ['top',29,0,-9],['top',43,0,8],['top',57,0,-5],['top',71,0,10],
 ['left',3,26,-12],['left',3,43,7],['left',3,60,-8],['left',3,77,9],
 ['right',97,26,12],['right',97,43,-7],['right',97,60,8],['right',97,77,-9]
];
positions.forEach(([side,x,y,angle],i)=>{
 const rose=document.createElementNS(svgNS,'svg');
 rose.setAttribute('viewBox','0 0 90 150');
 rose.classList.add('rose',side);
 rose.dataset.rose=String(i+1);
 rose.style.left=`${x}%`;rose.style.top=`${y}%`;
 const pink=i%3===1;
 rose.innerHTML=`<defs><linearGradient id="bud-${i}" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="${pink?'#e4a0a1':'#c56b74'}"/><stop offset=".48" stop-color="${pink?'#c77384':'#a13b51'}"/><stop offset="1" stop-color="${pink?'#99485e':'#702a40'}"/></linearGradient><linearGradient id="petal-${i}"><stop stop-color="${pink?'#edb4af':'#d58386'}"/><stop offset="1" stop-color="${pink?'#b45e77':'#962e47'}"/></linearGradient></defs>
 <g transform="rotate(${angle} 45 25)">
 <path d="M45 0C25 17 65 28 43 48S28 68 44 83" fill="none" stroke="#75865e" stroke-width="2"/>
 <path d="M44 57Q62 35 73 44Q65 62 44 57" fill="#8e9c70" stroke="#73835c" stroke-width=".7"/><path d="M45 57 67 46" fill="none" stroke="#c1c7a1" stroke-width=".7"/>
 <path d="M42 73Q17 70 15 52Q36 50 42 73" fill="#7d9064" stroke="#687e55" stroke-width=".7"/><path d="M39 70 20 56" stroke="#b8c49a" stroke-width=".7"/>
 <g class="bud-petals">
 <path class="petal back" d="M44 78C23 79 27 102 35 114Q44 126 54 113C68 95 61 78 44 78Z" fill="url(#bud-${i})" stroke="#8e4054" stroke-width=".7"/>
 <path class="petal left" d="M32 85C32 74 44 77 47 83C55 96 48 112 44 120C31 112 25 97 32 85Z" fill="url(#petal-${i})" stroke="${pink?'#be7885':'#af5466'}" stroke-width=".7"/>
 <path class="petal right" d="M53 79C66 85 59 107 44 120C46 110 42 100 47 91C50 86 54 84 53 79Z" fill="url(#bud-${i})" stroke="${pink?'#db9d9e':'#c4777d'}" stroke-width=".8"/>
 <path d="M37 82Q35 99 43 110" fill="none" stroke="${pink?'#f2c6bb':'#e4a09b'}" stroke-width="1" opacity=".7"/>
 </g>
 <path d="M43 78 30 75Q31 90 37 94L43 86 49 94Q58 85 58 76L47 79 44 70Z" fill="#718459" stroke="#64764f" stroke-width=".6"/>
 <path d="M43 80 43 90M48 81 51 87" stroke="#a7b287" stroke-width=".7" fill="none"/>
 </g>`;
 frame.append(rose);
});

// Every morph uses M + four cubic curves + Z, so control points interpolate
// continuously. Converting quadratics exactly preserves the original buds.
function cubicContour(path) {
 const tokens = path.match(/[MCQZ]|-?\d*\.?\d+/gi);
 const points = [];
 let cursor = 0, x = 0, y = 0;
 while (cursor < tokens.length) {
  const command = tokens[cursor++].toUpperCase();
  if (command === 'Z') break;
  if (command === 'M') {
   x = Number(tokens[cursor++]); y = Number(tokens[cursor++]);
   points.push(x, y);
  } else if (command === 'C') {
   const curve = tokens.slice(cursor, cursor + 6).map(Number);
   points.push(...curve); cursor += 6;
   x = curve[4]; y = curve[5];
  } else if (command === 'Q') {
   const [qx, qy, endX, endY] = tokens.slice(cursor, cursor + 4).map(Number);
   points.push(x + (qx - x) * 2 / 3, y + (qy - y) * 2 / 3,
    endX + (qx - endX) * 2 / 3, endY + (qy - endY) * 2 / 3, endX, endY);
   cursor += 4; x = endX; y = endY;
  } else {
   throw new Error(`Unsupported petal contour command: ${command}`);
  }
 }
 // Split the first cubic using de Casteljau; this changes no visible geometry.
 if (points.length === 20) {
  const [x0,y0,x1,y1,x2,y2,x3,y3] = points;
  const ax=(x0+x1)/2, ay=(y0+y1)/2;
  const bx=(x1+x2)/2, by=(y1+y2)/2;
  const cx=(x2+x3)/2, cy=(y2+y3)/2;
  const dx=(ax+bx)/2, dy=(ay+by)/2;
  const ex=(bx+cx)/2, ey=(by+cy)/2;
  points.splice(2,6,ax,ay,dx,dy,(dx+ex)/2,(dy+ey)/2,ex,ey,cx,cy,x3,y3);
 }
 return points;
}

function contourPath(points) {
 let result = `M${points[0].toFixed(3)} ${points[1].toFixed(3)}`;
 for (let i = 2; i < points.length; i += 6) {
  result += `C${points.slice(i, i + 6).map(n => n.toFixed(3)).join(' ')}`;
 }
 return result + 'Z';
}

// A cupped, asymmetrical petal with a rolled lip. Orientation is baked into
// its coordinates, never animated as a rigid rotation or a scaled image.
function unfoldedPetal(angle, radius, centerX = 44, centerY = 101) {
 const shape = [-5,5, -13,3,-20,-12,-13,-20,
  -7,-29,3,-25,7,-24, 20,-26,21,-8,12,1,
  8,7,1,9,-5,5];
 const radians = angle * Math.PI / 180;
 return shape.map((value, index) => {
  const pair = index - index % 2;
  const px = shape[pair] * radius / 28;
  const py = shape[pair + 1] * radius / 28;
  return index % 2
   ? centerY + px * Math.sin(radians) + py * Math.cos(radians)
   : centerX + px * Math.cos(radians) - py * Math.sin(radians);
 });
}

function mixPoints(from, to, amount) {
 return from.map((value, index) => value + (to[index] - value) * amount);
}

const flowers = [...frame.querySelectorAll('.rose')].map((rose, index) => {
 const petals = rose.querySelector('.bud-petals');
 const morphs = [];
 const extra = document.createElementNS(svgNS, 'g');
 extra.classList.add('unfurling-petals');
 // Hidden until activation: the initial Stage 1 rendering is unchanged.
 extra.setAttribute('visibility', 'hidden');
 petals.prepend(extra);
 const addMorph = (element, closed, open, delay) => {
  // An intermediate cupped shape lets the lip loosen before the petal spreads.
  const cupped = mixPoints(closed, open, .3).map((value, i) =>
   i % 2 ? value + (i > 1 ? 1.5 : 0) : value);
  morphs.push({element, closed, cupped, open, delay});
 };
 // Outer and middle whorls sit behind the three existing bud petals.
 for (let layer = 0; layer < 2; layer++) {
  const count = layer ? 5 : 7;
  for (let petalIndex = 0; petalIndex < count; petalIndex++) {
   const angle = petalIndex * 360 / count + (layer ? 24 : 0) + index % 3 * 4;
   const open = unfoldedPetal(angle, (layer ? 20 : 29) + Math.sin(petalIndex * 2 + index) * 1.4);
   const closed = open.map((value, i) => i % 2
    ? 99 + (value - 101) * .24 : 44 + (value - 44) * .15);
   const element = document.createElementNS(svgNS, 'path');
   element.setAttribute('d', contourPath(closed));
   element.setAttribute('fill', `url(#${petalIndex % 3 ? 'petal' : 'bud'}-${index})`);
   element.setAttribute('stroke', index % 3 === 1 ? '#be7885' : '#af5466');
   element.setAttribute('stroke-width', '.7');
   extra.append(element);
   addMorph(element, closed, open, layer * 160 + petalIndex * 13);
  }
 }
 // Existing petals become the tightly nested heart of the open rose.
 petals.querySelectorAll('.petal').forEach((element, petalIndex) => {
  const closed = cubicContour(element.getAttribute('d'));
  const open = unfoldedPetal(petalIndex * 120 + 35, 12 - petalIndex * 1.5, 44, 100);
  if (closed.length !== open.length) throw new Error('Petal contour mismatch');
  addMorph(element, closed, open, 220 + petalIndex * 80);
 });
 // Keep the original painted highlight attached to its unfolding petal.
 const highlight = petals.querySelector(':scope > path:not(.petal)');
 const highlightClosed = [37,82,35,99,43,110];
 const highlightOpen = [42,94,38,99,45,102];
 return {rose, extra, morphs, highlight, highlightClosed, highlightOpen};
});

const envelope = document.querySelector('.envelope');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Top left-to-right, then a wave alternating down the two sides.
const bloomOrder = [0,1,2,3,4,8,5,9,6,10,7,11];
const bloomDelay = new Map(bloomOrder.map((flowerIndex, order) => [flowerIndex, order * 190]));
const petalDuration = 1250;
const totalDuration = 11 * 190 + 380 + petalDuration; // 3.72 seconds
let hasBloomed = false;
let animationFrame = null;

function easeInOut(value) {
 return value * value * (3 - 2 * value);
}

function paintBloom(elapsed, complete = false) {
 flowers.forEach((flower, index) => {
  const localTime = elapsed - bloomDelay.get(index);
  if (!complete && localTime < 0) return;
  flower.extra.removeAttribute('visibility');
  flower.morphs.forEach(({element, closed, cupped, open, delay}) => {
   const progress = complete ? 1 : Math.max(0, Math.min(1, (localTime - delay) / petalDuration));
   const points = progress < .32
    ? mixPoints(closed, cupped, easeInOut(progress / .32))
    : mixPoints(cupped, open, easeInOut((progress - .32) / .68));
   element.setAttribute('d', contourPath(points));
  });
  const progress = complete ? 1 : easeInOut(Math.max(0, Math.min(1, (localTime - 300) / petalDuration)));
  const highlight = mixPoints(flower.highlightClosed, flower.highlightOpen, progress);
  flower.highlight.setAttribute('d', `M${highlight[0]} ${highlight[1]}Q${highlight.slice(2).join(' ')}`);
  if (complete) flower.rose.dataset.bloomed = 'true';
 });
}

function finishBloom() {
 if (animationFrame !== null) cancelAnimationFrame(animationFrame);
 animationFrame = null;
 paintBloom(totalDuration, true);
 envelope.dataset.bloomState = 'complete';
 envelope.setAttribute('aria-label', 'All twelve birthday roses are fully open');
}

function bloomRoses() {
 if (hasBloomed) return;
 hasBloomed = true;
 envelope.setAttribute('aria-disabled', 'true');
 envelope.setAttribute('aria-label', 'All twelve birthday roses are blooming');
 envelope.dataset.bloomState = 'blooming';
 if (reducedMotion.matches) { finishBloom(); return; }
 const start = performance.now();
 const tick = now => {
  const elapsed = now - start;
  if (elapsed >= totalDuration) { finishBloom(); return; }
  paintBloom(elapsed);
  animationFrame = requestAnimationFrame(tick);
 };
 animationFrame = requestAnimationFrame(tick);
}

envelope.addEventListener('click', openBirthdayLetter);
envelope.addEventListener('keydown', event => {
 if (event.key === 'Enter' || event.key === ' ') {
  event.preventDefault();
  openBirthdayLetter();
 }
});
reducedMotion.addEventListener('change', event => {
 if (event.matches && hasBloomed) finishBloom();
});

/* Stage 3 owns only the envelope and letter. The Stage 2 rose artwork,
   interpolation, timings and animation loop above are deliberately unchanged. */
const storybook = document.querySelector('.storybook');
const envelopeScene = document.querySelector('.envelope-scene');
const letter = document.querySelector('#birthday-letter');
const letterScroll = letter.querySelector('.letter-scroll');
const flap = envelope.querySelector('.envelope-flap');
const seal = envelope.querySelector('.heart-seal');
const flapClosedPath = flap.getAttribute('d');
const flapMotion = {progress:0};
let openingTimeline = null;
let letterStarted = false;

// A foreground pocket provides real occlusion as the folded sheet rises.
// Copy existing artwork and reuse its gradients; add no replacement envelope.
const envelopeSvg = envelope.querySelector('svg');
// Animate matching HTML containers, rather than an HTML envelope and a root
// SVG: SVG transform origins can differ when its viewBox starts above zero.
const pocket = document.createElement('div');
const pocketSvg = document.createElementNS(svgNS, 'svg');
// Keep both layers aligned when the envelope's framing is adjusted for phones.
pocketSvg.setAttribute('viewBox', envelopeSvg.getAttribute('viewBox'));
pocket.setAttribute('aria-hidden', 'true');
pocket.classList.add('envelope-pocket-overlay');
pocket.setAttribute('hidden', '');
pocketSvg.innerHTML = `<defs><clipPath id="pocket-occlusion"><path d="M20 40L220 190L420 40V286H20Z"/></clipPath></defs>`;
const pocketPaint = document.createElementNS(svgNS, 'g');
pocketPaint.setAttribute('clip-path', 'url(#pocket-occlusion)');
// Existing rect, bottom fold, seam highlights and addressee lettering.
const pocketSourceParts = [];
['rect', 'path:nth-of-type(2)', 'path:nth-of-type(4)', 'text'].forEach(selector => {
 const source = envelopeSvg.querySelector(`:scope > ${selector}`);
 pocketPaint.append(source.cloneNode(true));
 if (selector !== 'rect') pocketSourceParts.push(source);
});
pocketSvg.append(pocketPaint);
pocket.append(pocketSvg);
envelopeScene.append(pocket);

function renderFlap() {
 // Project the hinged paper in depth: the tip passes through edge-on before
 // revealing the reverse. No sudden image or path replacement is involved.
 const projection = Math.cos(flapMotion.progress * Math.PI);
 const y = value => 40 + (value - 40) * projection;
 flap.setAttribute('d', `M21 ${y(47)}L209 ${y(183)}Q220 ${y(193)} 231 ${y(183)}L419 ${y(47)}Q420 40 413 40H27Q20 40 21 ${y(47)}Z`);
}

function finishLetterReveal() {
 storybook.dataset.letterState = 'open';
 pocket.setAttribute('hidden', '');
 pocketSourceParts.forEach(part => part.style.removeProperty('visibility'));
 gsap.set(envelopeScene, {clearProps:'left,transform'});
 gsap.set(letter, {clearProps:'left,top,bottom,width,height,maxHeight,transform',visibility:'visible'});
 gsap.set(letterScroll, {opacity:1});
 gsap.set('.letter-fold', {display:'none'});
 letter.removeAttribute('inert');
 envelope.setAttribute('aria-expanded', 'true');
 envelope.setAttribute('aria-label', 'Your birthday letter is open');
 envelope.tabIndex = -1;
 letter.focus({preventScroll:true});
}

function openBirthdayLetter() {
 if (letterStarted) return;
 letterStarted = true;
 bloomRoses(); // Reuse the original rose sequence, starting at the same click.
 storybook.dataset.letterState = 'opening';
 envelope.setAttribute('aria-label', 'Opening your birthday letter');
 letter.hidden = false;
 letter.setAttribute('inert', '');
 const rootRect = storybook.getBoundingClientRect();
 const finalRect = letter.getBoundingClientRect();
 // SVG bounds exclude the caption and retain the envelope's original angle.
 const envelopeRect = envelopeSvg.getBoundingClientRect();
 const sceneRect = envelopeScene.getBoundingClientRect();
 // Remove only the scene's centering transform during playback. Its measured
 // position stays identical, while the pocket can now sit in front of the
 // letter (a transformed parent would trap both envelope layers together).
 envelopeScene.style.left = `${sceneRect.left - rootRect.left}px`;
 envelopeScene.style.transform = 'none';
 const foldedWidth = envelopeRect.width * .74;
 const foldedHeight = Math.min(128, foldedWidth * .49);
 const startLeft = envelopeRect.left - rootRect.left + (envelopeRect.width - foldedWidth) / 2;
 const startTop = envelopeRect.top - rootRect.top + envelopeRect.height * .3;
 const unfolded = {
  left:finalRect.left-rootRect.left, top:finalRect.top-rootRect.top,
  width:finalRect.width, height:finalRect.height
 };
 gsap.set(letter, {left:startLeft,top:startTop,width:foldedWidth,height:foldedHeight,
  bottom:'auto',maxHeight:'none',x:0,xPercent:0,rotation:-3,visibility:'hidden'});
 gsap.set(letterScroll, {opacity:0});
 gsap.set(seal, {svgOrigin:'220 185'});
 pocket.removeAttribute('hidden');
 // Hand the front artwork to the overlay while the paper passes between
 // layers. Never paint a second address or second set of front folds below it.
 pocketSourceParts.forEach(part => { part.style.visibility = 'hidden'; });
 openingTimeline = gsap.timeline({defaults:{ease:'power2.inOut'},onComplete:finishLetterReveal});
 openingTimeline
  .to([envelope,pocket], {y:-12,scale:1.025,duration:.65,ease:'sine.inOut'}, .15)
  .to(seal, {scale:1.065,duration:.22,ease:'sine.out'}, .3)
  .to(seal, {scale:1,duration:.3,ease:'sine.inOut'}, .52)
  .to(seal, {y:-34,opacity:0,duration:.55,ease:'power1.in'}, .78)
  .to(flapMotion, {progress:1,duration:1.05,onUpdate:renderFlap,ease:'sine.inOut'}, .7)
  .to('.envelope-caption', {opacity:0,duration:.5}, .9)
  .to('.dedication', {opacity:0,y:-8,duration:.7,ease:'sine.inOut'}, 1.25)
  .set(letter, {visibility:'visible'}, 1.3)
  .to(letter, {top:startTop-foldedHeight-envelopeRect.height*.13,rotation:0,
   duration:1.05,ease:'power2.inOut'}, 1.3)
  // It clears the mouth before moving in front of the envelope to unfold.
  .set(letter, {zIndex:4}, 2.25)
  .to(letter, {...unfolded,rotation:0,duration:1.6,ease:'power2.inOut'}, 2.25)
  .to('.letter-fold-upper', {rotationX:-92,duration:1.1,ease:'sine.inOut'}, 2.3)
  .to('.letter-fold-lower', {rotationX:92,duration:1.15,ease:'sine.inOut'}, 2.48)
  .to(letterScroll, {opacity:1,duration:.7,ease:'sine.out'}, 2.95)
  .to([envelope,pocket], {y:60,scale:.72,rotation:0,duration:1.15,ease:'power2.inOut'}, 2.55)
  .to(letter, {boxShadow:'0 14px 32px #80644926, 0 2px 6px #80644915',duration:.4}, 3.85);
 if (reducedMotion.matches) openingTimeline.progress(1);
}

// Finishing on resize avoids a stale measured path on rotation. The settled
// letter returns to CSS sizing, so subsequent resizes need no JS layout work.
window.addEventListener('resize', () => {
 if (openingTimeline && storybook.dataset.letterState === 'opening') openingTimeline.progress(1);
});
reducedMotion.addEventListener('change', event => {
 if (event.matches && openingTimeline) openingTimeline.progress(1);
});
