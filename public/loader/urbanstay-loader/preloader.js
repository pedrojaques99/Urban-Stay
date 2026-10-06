/* Urban Stay preloader. No runtime dependencies. */
(() => {
  'use strict';
  // Original page-3 path, embedded so local demos need no fetch or build step.
  const FINAL_PATH = "M235.918 190.795V90.5338C235.918 90.1151 235.382 89.9572 235.149 90.3073C234.312 91.5842 233.453 92.8473 232.568 94.1036C232.334 94.4399 231.799 94.2683 231.799 93.8564V56.6283C231.799 56.2095 232.341 56.0448 232.575 56.388C236.721 62.5801 240.339 69.1567 243.366 76.0558C250.204 91.6459 254 108.87 254 126.986C254 150.334 247.698 172.205 236.707 191.001C236.488 191.372 235.918 191.221 235.918 190.795ZM192.079 18.6793V128.346C192.079 128.675 192.443 128.881 192.724 128.702C193.665 128.112 194.612 127.508 195.546 126.897C195.827 126.719 196.191 126.918 196.191 127.247V232.726C196.191 233.062 196.569 233.268 196.85 233.083C203.955 228.394 210.559 223.012 216.573 217.033C216.655 216.95 216.696 216.847 216.696 216.731V110.833C216.696 110.717 216.744 110.607 216.827 110.531C218.145 109.296 219.442 108.039 220.692 106.749C220.767 106.666 220.808 106.563 220.808 106.453V41.5668C220.808 41.4638 220.767 41.3608 220.699 41.2784C212.536 32.361 203.111 24.6105 192.71 18.3086C192.429 18.137 192.065 18.3429 192.065 18.6724L192.079 18.6793ZM152.867 143.661C153.897 143.434 154.926 143.194 155.956 142.947C156.217 142.885 156.471 143.084 156.471 143.352V250.018C156.471 250.293 156.732 250.492 156.993 250.43C163.796 248.783 170.386 246.586 176.715 243.895C176.873 243.826 176.976 243.675 176.976 243.504V136.549C176.976 136.377 177.079 136.226 177.237 136.165C178.452 135.67 179.654 135.155 180.848 134.62C180.999 134.551 181.095 134.4 181.095 134.236V12.343C181.095 12.1783 180.999 12.0272 180.848 11.9586C172.027 7.81908 162.649 4.66124 152.86 2.63611C152.599 2.58119 152.352 2.78713 152.352 3.05486V143.249C152.352 143.517 152.599 143.723 152.867 143.661ZM127 0C122.27 0 117.602 0.26773 113.009 0.768865C112.797 0.789459 112.632 0.974811 112.632 1.18762V145.007C112.632 145.226 112.797 145.405 113.016 145.425C114.266 145.542 115.515 145.645 116.771 145.734H116.751V253.197C116.751 253.416 116.922 253.602 117.142 253.622C120.396 253.87 123.684 254 127 254C130.316 254 133.604 253.87 136.858 253.622C137.078 253.609 137.249 253.423 137.249 253.197V145.734H137.229C138.485 145.645 139.734 145.549 140.984 145.425C141.203 145.405 141.368 145.219 141.368 145.007V1.19449C141.368 0.981676 141.203 0.796324 140.991 0.77573C136.398 0.274595 131.73 0 127 0ZM10.6337 76.0696C3.80314 91.6597 0 108.884 0 127C0 150.347 6.30195 172.219 17.2926 191.015C17.5123 191.386 18.0821 191.228 18.0821 190.802V90.5407C18.0821 90.1219 18.6175 89.964 18.8509 90.3142C19.6884 91.591 20.5465 92.8542 21.4321 94.1104C21.6655 94.4468 22.201 94.2752 22.201 93.8633V56.6351C22.201 56.2164 21.6586 56.0516 21.4252 56.3949C17.2789 62.587 13.6611 69.1704 10.6337 76.0696ZM33.1848 41.5668V106.44C33.1848 106.55 33.2259 106.659 33.3015 106.735C34.5509 108.032 35.8483 109.282 37.1664 110.517C37.2488 110.6 37.2968 110.71 37.2968 110.82V216.717C37.2968 216.827 37.3449 216.937 37.4204 217.019C43.4271 222.998 50.038 228.38 57.1431 233.069C57.4246 233.254 57.8022 233.048 57.8022 232.712V127.233C57.8022 126.897 58.1729 126.698 58.4475 126.883C59.3879 127.494 60.3284 128.098 61.2689 128.689C61.5504 128.867 61.9142 128.661 61.9142 128.332V18.6793C61.9142 18.3498 61.5504 18.1438 61.2689 18.3155C50.8686 24.6174 41.4501 32.361 33.2809 41.2853C33.2122 41.3608 33.171 41.4638 33.171 41.5736L33.1848 41.5668ZM73.152 134.62C74.3465 135.155 75.5478 135.663 76.7629 136.165C76.9208 136.226 77.0238 136.384 77.0238 136.549V243.504C77.0238 243.675 77.1268 243.826 77.2847 243.895C83.6141 246.593 90.2043 248.783 97.0074 250.43C97.2751 250.492 97.5291 250.293 97.5291 250.018V143.352C97.5291 143.078 97.7831 142.878 98.044 142.947C99.0737 143.194 100.103 143.434 101.133 143.661C101.394 143.723 101.648 143.517 101.648 143.249V3.05486C101.648 2.78713 101.401 2.58805 101.14 2.63611C91.3508 4.66124 81.9733 7.81908 73.152 11.9586C73.001 12.0272 72.9049 12.1783 72.9049 12.343V134.236C72.9049 134.4 73.001 134.551 73.152 134.62Z";
  // Commands on the shared sun/moon boundary, in original subpath order.
  // Outer contour commands stay fixed; every boundary point gets ONE offset.
  const BOUNDARY = [[1,2,3,4],[1,2,3,4,9,10,11,12],[0,1,2,7,8,9,10,15,16],[3,4,5,6,12,13,14,15],[4,5,6,7],[1,2,3,4,9,10,11,12],[0,1,2,7,8,9,10,15,16]];
  const CONTOURS = FINAL_PATH.split('Z').filter(Boolean).map((part, stripe) =>
    part.match(/[MLCHV][^MLCHV]*/g).map((command, index) => ({
      type: command[0],
      values: command.slice(1).trim().split(/[ ,]+/).map(Number),
      moving: BOUNDARY[stripe].includes(index)
    }))
  );
  const moonPath = offset => offset === 0 ? FINAL_PATH : CONTOURS.map(commands =>
    commands.map(({type, values, moving}) => type + values.map((value, index) =>
      moving && (type === 'V' || (type !== 'H' && index % 2 === 1))
        ? Number((value + offset).toFixed(5)) : value
    ).join(' ')).join('') + 'Z'
  ).join('');
  // Each stripe as its own subpath, plus its distance from the center column
  // (0 = middle stripe, 1 = side tips) to stagger the alternative variants.
  const STRIPES = FINAL_PATH.split('Z').filter(Boolean).map((part, stripe) => {
    const xs = CONTOURS[stripe].flatMap(({type, values}) =>
      type === 'H' ? values : type === 'V' ? [] : values.filter((_, i) => i % 2 === 0));
    return { d: part + 'Z', reach: Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - 127) / 127 };
  });
  const VARIANTS = ['lua', 'persiana', 'horizonte'];
  let instance = 0;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => n * n * n * (n * (n * 6 - 15) + 10);

  class UrbanStayPreloader {
    constructor({ mount = document.body, variant = 'lua', duration = 1600, exitDuration = 870, onComplete } = {}) {
      this.variant = VARIANTS.includes(variant) ? variant : 'lua';
      this.duration = Math.max(1, Number(duration) || 1600);
      this.onComplete = onComplete;
      this.exitDuration = Math.max(1, Number(exitDuration) || 870);
      this.exitProgress = 0;
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.progress = 0;
      this.destroyed = false;
      this.playing = false;
      const id = `urbanstay-${++instance}`;
      this.element = document.createElement('div');
      this.element.className = 'urbanstay-loader';
      this.element.setAttribute('role', 'status');
      this.element.setAttribute('aria-live', 'polite');
      this.element.innerHTML = `
        <span class="urbanstay-loader__label">Carregando Urban Stay</span>
        <div class="urbanstay-loader__sky" aria-hidden="true"><div class="urbanstay-loader__night"></div></div>
        <svg class="urbanstay-loader__grain" aria-hidden="true"><filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#${id}-grain)"/></svg>
        <div class="urbanstay-loader__mark" aria-hidden="true">
          <svg width="200" height="200" viewBox="0 0 254 254">
            <defs>
              <clipPath id="${id}-circle"><circle cx="127" cy="127" r="127"/></clipPath>

            </defs>
            <g fill="#f8f4e2" clip-path="url(#${id}-circle)">
              ${this.variant === 'lua' ? '<path data-symbol/>'
                : STRIPES.map(({d}) => `<path data-stripe d="${d}"/>`).join('')}
            </g>
          </svg>
        </div>`;
      this.svg = this.element.querySelector('.urbanstay-loader__mark svg');
      this.symbol = this.svg.querySelector('[data-symbol]');
      this.stripes = [...this.svg.querySelectorAll('[data-stripe]')];

      this.night = this.element.querySelector('.urbanstay-loader__night');
      this.grain = this.element.querySelector('.urbanstay-loader__grain');
      mount.append(this.element);
      this.handleMotion = () => {
        if (!this.motion.matches) return;
        if (this.exiting) { this.renderExit(1); this.destroy(); }
        else { this.seek(1); this.complete(); }
      };
      this.motion.addEventListener('change', this.handleMotion);
      this.render(this.motion.matches ? 1 : 0);
    }

    render(value) {
      this.progress = clamp(value);
      this.svg.style.opacity = 1;
      const p = this.motion.matches ? 1 : this.progress;
      // One clock moves both the sky's color stops and the moon's horizon.
      // Translating the gradient avoids fading blue in before the moon arrives.
      const morph = ease(clamp((p - .17) / .79));
      this.night.style.setProperty('--sky-shift', `${46 * (1 - morph)}%`);
      // The moon pushes the sun: translate the original curved boundary as one
      // rigid shape. All seven bands and both tips stop at the same instant.
      // At zero offset the very same path equals the original Figma path.
      if (this.variant === 'lua') this.symbol.setAttribute('d', moonPath(170 * (1 - morph)));
      else this.stripes.forEach((path, i) => {
        // Middle stripe first, tips last; every stripe lands exactly at p = 1.
        const t = ease(clamp((p - STRIPES[i].reach * .32) / .68));
        path.style.transform = t === 1 ? '' : this.variant === 'persiana'
          // Persiana: the blackout opens from the middle, slats turning to face you.
          ? `scaleX(${Math.max(t, .0001)})`
          // Horizonte: the bands rise from under the horizon like a skyline at dusk.
          : `translateY(${(1 - t) * 262}px)`;
      });
      this.element.dataset.progress = this.progress.toFixed(4);
    }

    renderExit(value) {
      this.exitProgress = clamp(value);
      const sky = ease(clamp(this.exitProgress / .88));
      this.night.style.setProperty('--sky-shift', `${-150 * sky}%`);
      this.grain.style.opacity = .105 * (1 - sky);
      // Fade the complete, stationary symbol as one layer.
      this.symbol?.setAttribute('d', FINAL_PATH);
      this.stripes.forEach(path => { path.style.transform = ''; });
      this.svg.style.opacity = 1 - ease(clamp((this.exitProgress - .10) / .60));
      this.element.dataset.exitProgress = this.exitProgress.toFixed(4);
    }

    play() {
      if (this.destroyed || this.playing) return this;
      if (this.exiting) return this.playExit();
      if (this.progress >= 1) { this.complete(); return this; }
      if (this.motion.matches) { this.seek(1); this.complete(); return this; }
      this.playing = true;
      const start = performance.now() - this.progress * this.duration;
      const tick = now => {
        if (!this.playing || this.destroyed) return;
        this.render((now - start) / this.duration);
        if (this.progress < 1) this.frame = requestAnimationFrame(tick);
        else { this.playing = false; this.complete(); }
      };
      this.frame = requestAnimationFrame(tick);
      return this;
    }
    complete() {
      if (this.completed) return;
      this.completed = true;
      this.element.dispatchEvent(new CustomEvent('urbanstay:complete'));
      this.onComplete?.(this);
    }
    pause() { this.playing = false; cancelAnimationFrame(this.frame); return this; }
    seek(progress) { this.pause(); this.render(progress); return this; }
    replay() {
      if (this.destroyed || this.finishing) return this;
      this.completed = false;
      return this.seek(0).play();
    }
    playExit() {
      if (this.destroyed || this.playing) return this;
      this.playing = true;
      const start = performance.now() - this.exitProgress * this.exitDuration;
      const tick = now => {
        if (!this.playing || this.destroyed) return;
        this.renderExit((now - start) / this.exitDuration);
        if (this.exitProgress < 1) this.frame = requestAnimationFrame(tick);
        else this.destroy();
      };
      this.frame = requestAnimationFrame(tick);
      return this;
    }
    async finish() {
      if (this.destroyed) return;
      if (this.finishing) return this.finishing;
      this.finishing = (async () => {
        if (this.progress < 1 && !this.motion.matches) {
          await new Promise(resolve => {
            this.element.addEventListener('urbanstay:complete', resolve, { once:true });
            this.finishResolve = resolve;
            this.play();
          });
        }
        if (this.destroyed) return;
        if (this.motion.matches) { this.destroy(); return; }
        this.exiting = true;
        this.element.querySelector('.urbanstay-loader__label').textContent = 'Conteúdo carregado';
        await new Promise(resolve => { this.exitResolve = resolve; this.playExit(); });
      })();
      return this.finishing;
    }
    destroy() {
      this.pause(); this.destroyed = true;
      this.finishResolve?.();
      this.exitResolve?.();
      this.motion.removeEventListener('change', this.handleMotion);
      this.element.remove();
    }
  }
  window.UrbanStayPreloader = UrbanStayPreloader;
})();

