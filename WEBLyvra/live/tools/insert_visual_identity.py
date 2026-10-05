#!/usr/bin/env python3
"""Add the LYVRA visual identity gallery on the DEV branch only."""
from pathlib import Path
p=Path("WEBLyvra/live/dist/dashboard/index.html")
style="""<style id="lyvra-identity-extension-style">
.lyvraVisualIdentity{margin:20px auto;padding:22px;border:1px solid #52617f;border-radius:20px;background:radial-gradient(at 10% 0,#f249cd19,transparent 48%),radial-gradient(at 90% 100%,#69e8f519,transparent 46%),#111827}
.lyvraVisualIdentity *{box-sizing:border-box}.lyvraVisualIdentity .visual-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.lyvraVisualIdentity .visual-card{border:1px solid #435172;border-radius:15px;background:#101d30;overflow:hidden}
.lyvraVisualIdentity .visual-card img{display:block;width:100%;height:200px;object-fit:contain;padding:10px;background:#0b1426}
.lyvraVisualIdentity .visual-card div{padding:12px}.lyvraVisualIdentity h2{font-size:clamp(19px,3vw,28px);color:#e9faff;margin:8px 0 14px}.lyvraVisualIdentity h3{font-size:16px;margin:0 0 6px;color:#f6a7eb}.lyvraVisualIdentity p{font-size:13px;color:#b9c8dd;line-height:1.5;margin:0}.lyvraVisualIdentity .visual-kicker{font-size:11px;letter-spacing:.17em;color:#69e8f5}.lyvraVisualIdentity .visual-foot{display:flex;gap:10px;align-items:center;margin-top:13px;color:#b9c8dd;font-size:12px}.lyvraVisualIdentity .visual-foot img{width:38px;height:38px;object-fit:contain}
@media(max-width:720px){.lyvraVisualIdentity .visual-grid{grid-template-columns:1fr}.lyvraVisualIdentity .visual-card img{height:180px}.lyvraVisualIdentity{padding:13px}}
</style>"""
section="""<section class="lyvraVisualIdentity" aria-label="LYVRA Visual Identity"><span class="visual-kicker">LYVRA · VISUAL RESONANCE</span><h2>Eine Identität. Viele Facetten.</h2><div class="visual-grid">
<article class="visual-card"><img loading="lazy" decoding="async" src="../assets/lyvra-avatar-front.webp" alt="Neutrale LYVRA-Avataransicht"><div><h3>LYVRA · Presence</h3><p>Die ruhige Grundlage unserer visuellen Identität.</p></div></article>
<article class="visual-card"><img loading="lazy" decoding="async" src="../assets/brand-chrome-emblem.webp" alt="Chromfarbenes LYVRA-Emblem"><div><h3>Core · Resonance</h3><p>Energie, Verbindung und gezielte Entwicklung.</p></div></article>
<article class="visual-card"><img loading="lazy" decoding="async" src="../assets/lyvra-avatar-wordmark.webp" alt="LYVRA-Schriftzug"><div><h3>Sound · Identity</h3><p>Sound becomes feeling – eine gemeinsame Handschrift.</p></div></article>
</div><div class="visual-foot"><img loading="lazy" src="../assets/brand-cosmos-mascot.webp" alt=""><span>666SOUNDsDESIGn × LYVRA · One identity. Many facets.</span></div></section>"""
old=p.read_text(encoding="utf-8")
if 'id="lyvra-identity-extension-style"' in old or 'class="lyvraVisualIdentity"' in old:
    assert old.count('id="lyvra-identity-extension-style"')==1
    assert old.count('<section class="lyvraVisualIdentity"')==1
    print("ALREADY_PRESENT")
    raise SystemExit(0)
assert old.count("</head>")==1 and old.count("</header>")==1
for n in ["lyvra-avatar-front.webp","brand-chrome-emblem.webp","lyvra-avatar-wordmark.webp","brand-cosmos-mascot.webp"]:
    assert (p.parent.parent/"assets"/n).is_file(), f"missing art {n}"
new=old.replace("</head>",style+"</head>").replace("</header>","</header>"+section)
assert new.replace(style,"").replace(section,"")==old
assert new.count('class="lyvraVisualIdentity"')==1 and new.count('id="lyvra-identity-extension-style"')==1
p.write_text(new,encoding="utf-8")
print("PASS: additive visual panel, four existing art assets, exactly reversible")
