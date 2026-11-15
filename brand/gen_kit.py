# nook logo masters. Mark grid: 256 canvas, stroke 28, gap 16. Run: python3 brand/gen_kit.py
# Writes every SVG next to this script; see GUIDELINES.md for usage.
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L="M40 40H68V92H176V120H40Z"; R="M216 216H188V164H80V136H216Z"
# small-size cut, snapped to a 16 px grid (stroke 2 px, gap 2 px at 16 px)
Ls="M32 32H64V80H176V112H32Z"; Rs="M224 224H192V176H80V144H224Z"
IND, IND_D, INK, INK_D = "#6366F1", "#818CF8", "#0F172A", "#F8FAFC"

# Wordmark "nook": same orthogonal construction, stroke s, x-height xh, ascender asc (y-down, baseline 0)
s, xh, asc, gap = 28, 140, 196, 30
def n(x): return f"M{x} 0V{-xh}H{x+112}V0H{x+112-s}V{-xh+s}H{x+s}V0Z"
def o(x): return f"M{x} 0V{-xh}H{x+112}V0Z M{x+s} {-s}H{x+112-s}V{-xh+s}H{x+s}Z"
def k(x):
    # stem to ascender; arm = the mark's ㄱ (bar + down-stroke) hung from the stem; short upper spur closes the k
    return (f"M{x} 0V{-asc}H{x+s}V0Z"
            f" M{x+s} {-xh/2-s/2}H{x+112}V0H{x+112-s}V{-xh/2+s/2}H{x+s}Z"
            f" M{x+112-s} {-xh}H{x+112}V{-xh/2-s/2-12}H{x+112-s}Z")
xs=[0]; [xs.append(xs[-1]+112+gap) for _ in range(3)]
WORD=" ".join([n(xs[0]),o(xs[1]),o(xs[2]),k(xs[3])]); WW=xs[3]+112

def svg(w,h,body,title="nook"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><title>{title}</title>{body}</svg>\n'
def sym(c1,c2,small=False):
    a,b=(Ls,Rs) if small else (L,R)
    return f'<path fill="{c1}" d="{a}"/><path fill="{c2}" d="{b}"/>'
def word(c,tx,ty,sc): return f'<path fill="{c}" fill-rule="evenodd" transform="translate({tx} {ty}) scale({sc})" d="{WORD}"/>'

sc=0.62; base=128+xh*sc/2   # x-height block centred on the mark
hw=256+48+WW*sc+40
themes={"light":(IND,INK,INK),"dark":(IND_D,INK_D,INK_D),"black":("#000","#000","#000"),"white":("#fff","#fff","#fff"),"indigo":(IND,IND,IND)}
for t,(c1,c2,cw) in themes.items():
    open(f"symbol-{t}.svg","w").write(svg(256,256,sym(c1,c2)))
    open(f"symbol-small-{t}.svg","w").write(svg(256,256,sym(c1,c2,True)))
    open(f"wordmark-{t}.svg","w").write(svg(WW+8,asc+8,word(cw,4,asc+4,1)))
    open(f"lockup-horizontal-{t}.svg","w").write(svg(round(hw),256,sym(c1,c2)+word(cw,256+24,base,sc)))
    sw=WW*0.5; open(f"lockup-stacked-{t}.svg","w").write(svg(round(max(256,sw)+40),256+asc*0.5+40,
        f'<g transform="translate({(max(256,sw)+40-256)/2} 0)">{sym(c1,c2)}</g>'+word(cw,(max(256,sw)+40-sw)/2,256+asc*0.5+8,0.5)))
# adaptive favicon: switches with the OS/browser colour scheme
open("favicon.svg","w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><style>.a{{fill:{IND}}}.b{{fill:{INK}}}@media (prefers-color-scheme:dark){{.a{{fill:{IND_D}}}.b{{fill:{INK_D}}}}}</style><path class="a" d="{Ls}"/><path class="b" d="{Rs}"/></svg>\n''')
# app icon / ico source: small cut on a dark rounded tile
open("app-icon.svg","w").write(svg(256,256,f'<rect width="256" height="256" rx="56" fill="{INK}"/><g transform="translate(128 128) scale(.7) translate(-128 -128)">{sym(IND_D,INK_D,True)}</g>'))
# favicon.ico source: small cut on the slate tile at full scale, so every edge lands on the 16 px grid
open("favicon-tile.svg","w").write(svg(256,256,f'<rect width="256" height="256" rx="48" fill="{INK}"/>'+sym(IND_D,INK_D,True)))
