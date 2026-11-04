/** Re-check standalone launches; do not carry a requested desktop viewport into a phone PWA. */
export function configureInstalledViewport(){
 const standalone=window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
 if(!standalone||navigator.maxTouchPoints<1)return;
 // outerWidth remains a physical CSS-window hint on browsers that expose a virtual desktop viewport.
 const candidates=[window.outerWidth,screen.availWidth,screen.availHeight].filter(n=>Number.isFinite(n)&&n>0);
 const width=Math.min(...candidates);
 if(width>600||width<240)return; // Keep tablets and desktop installations responsive.
 document.querySelector('meta[name="viewport"]')?.setAttribute('content',`width=${Math.round(width)}, initial-scale=1, viewport-fit=cover`);
}
configureInstalledViewport();
window.addEventListener('pageshow',configureInstalledViewport);
window.matchMedia('(display-mode: standalone)').addEventListener('change',configureInstalledViewport);
