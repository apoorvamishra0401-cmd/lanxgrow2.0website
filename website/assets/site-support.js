(() => {
 const links=[['Home','/'],['Meet our Lan-X AI','/smart-ai'],['About','/about'],['Services','/services'],['Interview Prep','/interview-prep'],['FAQ','/faq'],['Privacy','/privacy'],['Terms','/terms'],['Sign In','/signin']];
 const footer=document.querySelector('footer');
 if(footer){
  const nav=footer.querySelector('nav[aria-label="Footer"]')||footer.querySelector('#footer-signin');
  if(nav){
   if(nav.id==='footer-signin'){nav.setAttribute('role','navigation');nav.setAttribute('aria-label','Footer');nav.classList.add('site-footer-restored');}
   const list=nav.querySelector('ul');
   for(const [label,href] of links){
    if(nav.querySelector('a[href="'+href+'"]'))continue;
    const a=document.createElement('a');a.href=href;a.textContent=label;
    if(list){const li=document.createElement('li');li.append(a);list.append(li);}else nav.append(a);
   }
  }
 }
 if(document.querySelector('.support-floating'))return;
 const a=document.createElement('a');a.className='support-floating';a.href='https://wa.me/919826365691?text='+encodeURIComponent('Hi, I want to learn more about English learning with LanXgrow.');a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Chat with LanXgrow on WhatsApp');
 a.innerHTML='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M27 15.5a11 11 0 0 1-16.2 9.7L5 27l1.8-5.6A11 11 0 1 1 27 15.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.5c-.6-.6-1.5-.2-2 .5-.8 1.2-.4 3.2.8 5.1 1.8 2.8 4.6 5 7.4 5.5 1.2.2 2.8-.6 3-1.7.1-.4-.1-.7-.5-.9l-2.6-1.3c-.4-.2-.7-.1-1 .3l-.8 1c-1.8-.7-3.3-2.1-4.1-3.8l.8-.9c.3-.3.4-.6.2-1l-1.2-2.8Z" fill="currentColor"/></svg><span class="support-tooltip">Let’s talk English</span>';
 document.body.append(a);
})();
