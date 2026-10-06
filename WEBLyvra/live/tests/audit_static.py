"""Statische Integritäts- und lokale HTTP-Prüfung; kein visueller Browsertest."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
from urllib.request import urlopen
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import re, json, subprocess, threading, functools
root=Path(__file__).resolve().parents[1]; web=root/'dist'
class Page(HTMLParser):
    def __init__(self): super().__init__(); self.ids=[]; self.refs=[]; self.images=[]; self.frames=[]; self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for k in ['src','href']:
            if k in a:self.refs.append(a[k])
        if tag=='img':self.images.append(a)
        if tag=='iframe':self.frames.append(a)
        if tag=='a':self.links.append(a)
parsed={}
for path in web.rglob('*.html'):
    page=Page();page.feed(path.read_text());assert len(set(page.ids))==len(page.ids),path
    assert all('alt' in im and im.get('width') and im.get('height') for im in page.images)
    assert all('noopener' in a.get('rel','') and 'noreferrer' in a.get('rel','') for a in page.links if a.get('target')=='_blank')
    parsed[path]=page
# Topic transition videos are release-required assets; an HTML-only build is insufficient.
for name in ('topic-banner-start.mp4', 'topic-banner-end.mp4'):
    item=web/'assets'/name
    assert item.is_file() and item.stat().st_size>1000, f'Missing topic animation: {name}'
# LYVRA Cyber Intro HUD v1.9: static safety/continuity checks (visual browser acceptance remains separate).
boot_js=web/'cyber-boot.js';boot_css=web/'cyber-boot.css'
assert boot_js.is_file() and boot_css.is_file(), 'Missing LYVRA cyber-intro assets'
boot=boot_js.read_text(); boot_style=boot_css.read_text()
assert "import './cyber-boot.js';" in (web/'app.js').read_text(), 'Cyber intro module not imported'
for name in ('intro-background.jpg','intro-brand.png','center-emblem.png'):
    item=web/'assets'/'cyber-intro'/name
    assert item.is_file() and item.stat().st_size>1000, f'Missing cyber-intro artwork: {name}'
assert "cyber-intro-v1.9-r2-20261006" in boot, 'Cyber intro release token missing'
assert 'sessionStorage' not in boot, 'Cyber intro must run on every full page load'
assert "css.addEventListener('load'" in boot and "if(!cssReady) return" in boot, 'Cyber intro must wait for stylesheet'
assert all(x in boot for x in ('4200','1100','5400','2000','18000')), 'Cyber intro timing contract incomplete'
assert all(x in boot for x in ('SYSTEM ONLINE','system-online-sequence','lyvra:system-start')), 'Cyber intro handoff contract incomplete'
assert 'hudSystemOnlineTripleFade' in boot_style and '5.4s ease-in-out 1 forwards' in boot_style, 'SYSTEM ONLINE triple-fade missing'
assert './assets/cyber-intro/' in boot and './assets/cyber-intro/intro-background.jpg' in boot_style, 'Cyber intro must use local assets'
assert 'lyvra-visual-loop.mp4' not in boot, 'Cyber intro must not control existing intro media'
assert 'lyvra-boot-skip' not in boot, 'Old simple boot UI leaked into v1.9 replacement'
# Dashboard integration freeze checks.
dashboard=web/'dashboard'/'index.html'
assert dashboard.is_file(), 'Dashboard entry missing'
dash_text=dashboard.read_text()
assert dashboard.stat().st_size < 100_000, 'Dashboard regressed to oversized inline build'
assert 'data:image' not in dash_text, 'Dashboard must keep images as local files'
assert 'https://webradio.666soundsdesign-broadcaster.com/embed/miniplayer.html' in dash_text, 'Dashboard radio iframe changed'
assert 'href="https://dashboard.666soundsdesign-broadcaster.com/"' in (web/'index.html').read_text(), 'Main site dashboard domain link missing'
dashboard_assets=[
    'assets/lyvra-identity/666soundsdesign-neon.png',
    'assets/lyvra-identity/lyvra-core.png',
    'assets/lyvra-identity/lyvra-neutral.png',
    'assets/lyvra-identity/lyvra-versus-fraggle.png',
    'assets/lyvra-identity/lyvra-wordmark.png',
    'assets/runtime-visuals/dashboard-brand.png',
    'assets/runtime-visuals/lyvra-avatar-angle-a.png',
    'assets/runtime-visuals/lyvra-avatar-angle-b.png',
    'assets/runtime-visuals/lyvra-avatar-front.png',
    'assets/runtime-visuals/lyvra-avatar-turnaround.png',
]
for rel in dashboard_assets:
    item=web/'dashboard'/rel
    assert item.is_file() and item.stat().st_size>1000, f'Missing dashboard asset: {rel}'
main=parsed[web/'index.html'];privacy=parsed[web/'privacy/index.html']
assert all(i in main.ids for i in ['home','identity','universe','sound','lab','world','radio','evolution','lyvra-system-evolution','lyvra-chat-demo'])
assert len(main.frames)==2 and not privacy.frames
assert all(f['src']=='https://webradio.666soundsdesign-broadcaster.com/embed/miniplayer.html' for f in main.frames)
assert any(a.get('href')=='/privacy' for a in main.links)
assert sum(a.get('href')=='https://chatgpt.com/g/g-6abe79b4637481919e42d6085ccdbac3-l-y-v-r-a' for a in main.links)==2
checked=set()
for name in ['brand-chrome-emblem','brand-cosmos-mascot','brand-alien-emblem','mascot-life-tree','mascot-resonance']:
    image=web/'assets'/(name+'.webp');assert image.is_file();checked.add(str(image.relative_to(web)))
def resolve(value,path):
    u=urlsplit(value)
    if u.scheme or u.netloc or value.startswith('data:'):return
    target=web/u.path.lstrip('/') if value.startswith('/') else path.parent/u.path
    if not u.path:target=path
    if target.is_dir():target=target/'index.html'
    assert target.is_file(),(path,value)
    if u.fragment and target.suffix=='.html':assert u.fragment in parsed[target].ids,(path,value)
    checked.add(str(target.relative_to(web)))
for path,page in parsed.items():
    for value in page.refs:resolve(value,path)
for path in web.rglob('*.css'):
    for value in re.findall(r'url\([\'\"]?([^\)\'\"]+)',path.read_text()):resolve(value,path)
for path in web.rglob('*.js'):
    subprocess.run(['node','--check',str(path)],check=True,capture_output=True)
    for value in re.findall(r"from\s+['\"]([^'\"]+)",path.read_text()):resolve(value,path)
    assert not re.search(r'sk-(?:proj-)?[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN .*PRIVATE KEY',path.read_text()),path
policy=(web/'privacy/privacy-data.js').read_text()
assert policy.count('dirk.meereis@icloud.com')==2
assert 'oben auszufüllenden' not in policy and 'contact to be completed' not in policy
assert 'Hellenstr. 16, 59955 Winterberg, Deutschland' in policy and 'Hellenstr. 16, 59955 Winterberg, Germany' in policy
assert not re.search(r'\b(fetch|XMLHttpRequest|WebSocket)\b',(web/'chat-demo.js').read_text())
assert 'prefers-reduced-motion' in (web/'styles.css').read_text()
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(web)))
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
try:
    for path in ['','privacy']+sorted(checked):
        with urlopen(f'http://127.0.0.1:{server.server_port}/{path}') as response:assert response.status==200; response.read()
finally:server.shutdown();server.server_close();thread.join()
print(json.dumps({'status':'PASS','html_pages':len(parsed),'local_files_checked':len(checked),'javascript_syntax':'PASS','local_http':'PASS','controller_DE_EN':'PASS','radio_embeds_preserved':2,'browser_visual_audio_screenreader':'NOT_VERIFIED'}))
