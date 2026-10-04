#!/usr/bin/env python3
"""Validate additive LYVRA Dashboard visual identity after assets are uploaded."""
from pathlib import Path
from html.parser import HTMLParser
import sys

EXPECTED = {
 "lyvra-neutral.jpeg", "lyvra-core.jpeg", "lyvra-wordmark.jpeg",
 "lyvra-versus-fraggle.jpeg", "666soundsdesign-neon.jpeg"
}
class Scan(HTMLParser):
 def __init__(self):
  super().__init__(); self.sections=0; self.images=[]
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if tag=="section" and "lyvraVisualIdentity" in a.get("class","").split(): self.sections+=1
  if tag=="img" and a.get("src","").startswith("assets/lyvra-identity/"):
   self.images.append((a.get("src",""),a.get("alt","")))

def validate(path):
 text=path.read_text(encoding="utf-8")
 s=Scan();s.feed(text)
 assert text.count('id="lyvra-identity-extension-style"')==1,"Missing/duplicate style"
 assert s.sections==1,"Missing/duplicate visual section"
 assert {src.rsplit("/",1)[-1] for src,_ in s.images}==EXPECTED,"Wrong image set"
 assert len(s.images)==5,"Duplicate images"
 for src,alt in s.images:
  assert alt.strip(),f"Missing accessible alt: {src}"
  target=path.parent/src
  assert target.is_file() and target.stat().st_size>1000,f"Missing/empty: {target}"
 print("PASS: LYVRA visual section, style, five images and accessibility")

if __name__=="__main__":
 try: validate(Path(sys.argv[1]) if len(sys.argv)>1 else Path("WEBLyvra/live/dist/dashboard/index.html"))
 except Exception as e: print("FAIL:",str(e),file=sys.stderr);sys.exit(1)
