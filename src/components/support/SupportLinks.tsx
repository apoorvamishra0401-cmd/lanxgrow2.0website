import { contactChannels } from '@/config/site';
import './SupportLinks.css';

export const whatsappUrl = `https://wa.me/${contactChannels.whatsapp}?text=${encodeURIComponent('Hi, I want to learn more about English learning with LanXgrow.')}`;

export function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M27 15.5a11 11 0 0 1-16.2 9.7L5 27l1.8-5.6A11 11 0 1 1 27 15.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9.5c-.6-.6-1.5-.2-2 .5-.8 1.2-.4 3.2.8 5.1 1.8 2.8 4.6 5 7.4 5.5 1.2.2 2.8-.6 3-1.7.1-.4-.1-.7-.5-.9l-2.6-1.3c-.4-.2-.7-.1-1 .3l-.8 1c-1.8-.7-3.3-2.1-4.1-3.8l.8-.9c.3-.3.4-.6.2-1l-1.2-2.8Z" fill="currentColor"/></svg>;
}
export function EmailIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>; }
export function FloatingWhatsApp() { return <a className="support-floating" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with LanXgrow on WhatsApp"><WhatsAppIcon/><span className="support-tooltip">Let’s talk English</span></a>; }
export function EmailLink() { return <a className="support-email" href={`mailto:${contactChannels.email}?subject=${encodeURIComponent('English learning with LanXgrow')}`}><EmailIcon/><span>{contactChannels.email}</span><span aria-hidden="true">↗</span></a>; }
export function LoginSupport() { return <div className="login-support"><p>Need a little help getting started?</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>WhatsApp</a><EmailLink/></div>; }
