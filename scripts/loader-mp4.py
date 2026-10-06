"""Grava o preloader em MP4, quadro a quadro (determinístico, sem depender do relógio).

    python scripts/loader-mp4.py                 # persiana + horizonte
    python scripts/loader-mp4.py lua persiana    # escolhe as variantes

Saída: exports/loader/urbanstay-loader-<variante>.mp4 (1920x1080, 60 fps, H.264).
Precisa de: Python Playwright (chromium) e ffmpeg no PATH.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DEMO = ROOT / 'public/loader/urbanstay-loader/index.html'
OUT = ROOT / 'exports/loader'
FPS, W, H = 60, 1920, 1080
LEAD, HOLD, TAIL = 0.2, 0.4, 0.3  # segundos: antes, entre formação e saída, depois


def frames(page, variant, folder):
    # Instância própria, pausada: cada quadro é um seek() exato.
    info = page.evaluate(f"""() => {{
        window.demoLoader?.destroy();
        window.rec = new UrbanStayPreloader({{ variant: '{variant}' }});
        rec.seek(0);
        return {{ form: rec.duration / 1000, exit: rec.exitDuration / 1000 }};
    }}""")
    shots = (
        [('seek', 0)] * round(LEAD * FPS)
        + [('seek', i / round(info['form'] * FPS)) for i in range(round(info['form'] * FPS) + 1)]
        + [('seek', 1)] * round(HOLD * FPS)
        + [('exit', i / round(info['exit'] * FPS)) for i in range(round(info['exit'] * FPS) + 1)]
        + [('exit', 1)] * round(TAIL * FPS)
    )
    for n, (kind, t) in enumerate(shots):
        page.evaluate(f"rec.{'seek' if kind == 'seek' else 'renderExit'}({t})")
        page.screenshot(path=str(folder / f'{n:05d}.png'))


def main(variants):
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': W, 'height': H}, reduced_motion='no-preference')
        page.goto(DEMO.as_uri())
        page.wait_for_function('() => !!window.UrbanStayPreloader')
        for variant in variants:
            folder = Path(tempfile.mkdtemp(prefix=f'loader-{variant}-'))
            try:
                frames(page, variant, folder)
                target = OUT / f'urbanstay-loader-{variant}.mp4'
                subprocess.run([
                    'ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS),
                    '-i', str(folder / '%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                    '-crf', '18', '-movflags', '+faststart', str(target),
                ], check=True)
                print(target)
            finally:
                shutil.rmtree(folder, ignore_errors=True)
        browser.close()


if __name__ == '__main__':
    main(sys.argv[1:] or ['persiana', 'horizonte'])
