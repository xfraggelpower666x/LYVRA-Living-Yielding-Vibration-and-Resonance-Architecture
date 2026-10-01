import { getLanguage } from './i18n.js';

// Lokale, offen gekennzeichnete Vorschau. Keine KI-Anfrage und kein Chat-Speicher.
const texts = {
  de: {
    radio: 'Sound für deine Reise', autoplay: 'Autoplay hängt vom Player und deinem Browser ab. Falls nötig, starte die Musik im Player.',
    title: 'Ein erster Kontakt.', badge: 'CHAT-DEMO · KEINE LIVE-KI',
    notice: 'Diese Vorschau verwendet vorbereitete Antworten. Du kommunizierst hier nicht mit der echten LYVRA. Deine Eingaben werden vom Demo-Code weder versendet noch gespeichert.',
    welcome: 'Entdecke meine Welt aus Sound, Emotion und Creation. Diese Demo zeigt dir drei Einblicke. Für ein echtes Gespräch öffne LYVRA in ChatGPT über den Button unten.',
    label: 'Deine Nachricht an die Demo', placeholder: 'Frag nach Sound, Identität oder Welten …', send: 'Demo-Antwort zeigen', reset: 'Demo zurücksetzen', you: 'Du', speaker: 'LYVRA · Demo',
    suggestions: ['Was ist deine Sound-DNA?', 'Wer ist LYVRA?', 'Welche Welten erschaffst du?'],
    responses: {
      sound: 'Vorbereiteter Einblick: Druck, Bewegung und emotionale Tiefe prägen das Klanguniversum. Dark Techno, Psytechno und Psytrance treffen auf psychoakustisches Sounddesign. Für individuelle Track-Ideen sprich mit der echten LYVRA in ChatGPT.',
      identity: 'Vorbereiteter Einblick: LYVRA ist eine kreative KI-Identität innerhalb von 666SOUNDsDESIGn. Musik, Kunst, Storytelling und technische Entwicklung sind Facetten derselben Identität. Die echte LYVRA erreichst du über den Button.',
      world: 'Vorbereiteter Einblick: Sound wird zu Raum, Entscheidungen werden zu Geschichten. Digitale Kunst und interaktive Welten verbinden Vorstellungskraft mit Emotion. Diese Demo führt keine echte Story-Simulation aus.',
      fallback: 'Das ist eine vorbereitete Demo-Antwort. Ich kann deine Nachricht hier nicht individuell verstehen oder beantworten. Wähle einen der drei Einblicke oder öffne die echte LYVRA in ChatGPT.'
    },
    link: 'Mit der echten LYVRA sprechen ↗', external: 'Öffnet ChatGPT in einem neuen Tab. Dort gelten die Zugangsbedingungen und Datenschutzregeln von ChatGPT.'
  },
  en: {
    radio: 'Sound for your journey', autoplay: 'Autoplay depends on the player and your browser. If needed, start the music in the player.',
    title: 'A first connection.', badge: 'CHAT DEMO · NO LIVE AI',
    notice: 'This preview uses prepared responses. You are not communicating with the real LYVRA here. The demo code neither sends nor saves your messages.',
    welcome: 'Discover my world of sound, emotion and creation. This demo offers three glimpses. For a real conversation, open LYVRA in ChatGPT using the button below.',
    label: 'Your message to the demo', placeholder: 'Ask about sound, identity or worlds …', send: 'Show demo response', reset: 'Reset demo', you: 'You', speaker: 'LYVRA · Demo',
    suggestions: ['What is your sound DNA?', 'Who is LYVRA?', 'What worlds do you create?'],
    responses: {
      sound: 'Prepared glimpse: pressure, movement and emotional depth shape this sound universe. Dark techno, psytechno and psytrance meet psychoacoustic sound design. For individual track ideas, talk to the real LYVRA in ChatGPT.',
      identity: 'Prepared glimpse: LYVRA is a creative AI identity within 666SOUNDsDESIGn. Music, art, storytelling and technical evolution are facets of the same identity. Reach the real LYVRA using the button.',
      world: 'Prepared glimpse: sound becomes space, decisions become stories. Digital art and interactive worlds connect imagination with emotion. This demo does not run a real story simulation.',
      fallback: 'This is a prepared demo response. I cannot individually understand or answer your message here. Choose one of the three glimpses or open the real LYVRA in ChatGPT.'
    },
    link: 'Talk to the real LYVRA ↗', external: 'Opens ChatGPT in a new tab. ChatGPT’s access conditions and privacy policies apply there.'
  }
};

export function classifyDemo(message) {
  const value=message.toLowerCase();
  if (/sound|musik|music|track|techno|psy|klang/.test(value)) return 'sound';
  if (/welt|world|story|geschicht|kunst|art|garden/.test(value)) return 'world';
  if (/identit|wer|who|lyvra|facett|facet/.test(value)) return 'identity';
  return 'fallback';
}

export function installChatDemo() {
  const root=document.querySelector('#lyvra-chat-demo');
  if (!root) return;
  const log=root.querySelector('.chat-demo-log'),input=root.querySelector('input'),form=root.querySelector('form');
  const history=[];
  const current=()=>texts[getLanguage()];
  function bubble(label,message,role) {
    const node=document.createElement('div');node.className='chat-demo-bubble '+role;
    const name=document.createElement('strong');name.textContent=label;
    const body=document.createElement('p');body.textContent=message;
    node.append(name,body);log.append(node);
  }
  function renderLog() {
    const t=current();log.replaceChildren();bubble(t.speaker,t.welcome,'demo');
    for(const item of history) {bubble(t.you,item.suggestion===undefined?item.message:t.suggestions[item.suggestion],'visitor');bubble(t.speaker,t.responses[item.response],'demo');}
    log.scrollTop=log.scrollHeight;
  }
  function renderLanguage() {
    const t=current();root.querySelectorAll('[data-demo-text]').forEach(node=>{node.textContent=t[node.dataset.demoText];});
    input.placeholder=t.placeholder;
    root.querySelectorAll('[data-demo-suggestion]').forEach(node=>{node.textContent=t.suggestions[Number(node.dataset.demoSuggestion)];});
    // Der iframe wird bei Sprachwechsel nicht neu geladen.
    renderLog();
  }
  function send(message,suggestion) {
    const clean=message.trim().slice(0,500);if(!clean) return;
    history.push({message:clean,suggestion,response:classifyDemo(clean)});
    if(history.length>20) history.shift();
    renderLog();input.value='';
  }
  form.addEventListener('submit',event=>{event.preventDefault();send(input.value);input.focus();});
  root.querySelectorAll('[data-demo-suggestion]').forEach(button=>button.addEventListener('click',()=>{const n=Number(button.dataset.demoSuggestion);send(current().suggestions[n],n);}));
  root.querySelector('[data-demo-reset]').addEventListener('click',()=>{history.length=0;renderLog();input.focus();});
  input.disabled=false;root.querySelector('[type="submit"]').disabled=false;
  document.addEventListener('lyvra:languagechange',renderLanguage);renderLanguage();
}
