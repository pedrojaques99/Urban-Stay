# Urban Stay — preloader

Abra `index.html` no navegador para assistir. A formação do símbolo dura 4,8 segundos; depois, uma saída de 2,6 segundos revela um fundo preto liso. Não há repetição automática.

## Entrega para desenvolvimento

Copie `preloader.css` e `preloader.js` para o site. O vetor está incorporado no JavaScript; `assets/symbol-final.svg` conserva o original para referência. `index.html`, `demo.css` e `demo.js` são apenas a demonstração, com apenas um fundo preto atrás do loader. Sem dependências, instalação ou compilação.

```html
<link rel="stylesheet" href="/preloader/preloader.css">
<script src="/preloader/preloader.js"></script>
<script>
  const loader = new UrbanStayPreloader({ duration: 4800, exitDuration: 2600 });
  loader.play();

  // Substitua window.load pelo sinal real de prontidão da sua aplicação.
  const ready = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise(resolve => window.addEventListener('load', resolve, {once:true}));
  ready.then(() => loader.finish());
</script>
```

`finish()` espera a formação do símbolo terminar, faz a saída de 2600 ms e remove o overlay. O gradiente continua subindo: azul, azul translúcido e transparência real revelam a página. O símbolo permanece fixo. O símbolo inteiro faz um fade-out suave de 1,56 segundo, iniciado 260 ms após o começo da saída. Sua forma, tamanho e posição permanecem fixos. O progresso visual representa a sequência artística, não o percentual de arquivos carregados. A aplicação deve chamar `finish()` quando estiver pronta e tratar suas próprias falhas de carregamento. Sem essa chamada, o loader permanece no estado sol/lua.

Mantenha o conteúdo real atrás do overlay. Se bloquear interação durante o carregamento, aplique `inert` ao contêiner do conteúdo (nunca ao pai do loader) e remova após `await loader.finish()`, como na demonstração. A Promise também resolve quando `destroy()` cancela a animação.

| API | Comportamento |
| --- | --- |
| `play()` | Inicia ou retoma |
| `pause()` | Pausa no ponto atual |
| `replay()` | Reinicia a formação antes de chamar `finish()`; para repetir após a saída, crie nova instância |
| `seek(0…1)` | Posiciona e pausa; útil para revisão |
| `finish()` | Aguarda a formação, revela a página, desvanece o símbolo e remove; retorna Promise |
| `destroy()` | Remove imediatamente; use no desmontar de componentes |

Opções: `mount` (elemento pai; padrão `document.body`), `duration` (formação, ms), `exitDuration` (saída, ms) e `onComplete(loader)` (fim da formação do sol/lua, antes da saída). Para o fim de toda a experiência, aguarde `finish()`. Em bundlers/React/Vue, carregue o script como arquivo estático e instancie no ciclo de montagem, chamando `destroy()` ao desmontar. O script expõe `window.UrbanStayPreloader`.

## Movimento e fidelidade

- Fundo programado com gradientes CSS e uma textura SVG discreta: amarelo no alto, areia na transição e azul na base. As posições das cores sobem usando o mesmo progresso e a mesma suavização da formação da lua; ambos chegam juntos ao estado final, sem antecipar o azul por uma troca de opacidade.
- A lua empurra o sol: os nós da curva de separação do SVG original sobem juntos pelo mesmo deslocamento vertical. O contorno externo permanece fixo e um recorte circular contém a geometria inicial.
- Todas as sete faixas, incluindo as pontas laterais, desaceleram e param juntas. Não há varredura posterior das laterais, troca de SVG ou transição de opacidade. A suavização tem velocidade e aceleração zero nas extremidades.
- Ao terminar a formação, o caminho é exatamente o original da página 3. A saída é um novo estado: o SVG completo desaparece apenas por opacidade, sem recortes animados, deslocamento ou alteração das faixas. O arquivo de referência fica intacto em `assets/symbol-final.svg`; a cópia incorporada no JS permite abrir a demonstração diretamente, sem requisições externas.
- Símbolo de 200 × 200 px no desktop; 144 × 144 px até 600 px de largura.
- `prefers-reduced-motion` mostra diretamente o estado final e remove sem movimento.
- Sem repetição automática, giro, zoom ou pulsação adicionais.

Referências Figma: arquivo `DtBJMg8yBdK0gejCUnFApu`, frames `9234:182` e `9234:181`; SVG final `9234:180`. O fundo foi recriado em código para permitir a transição; não depende da imagem de 19 MB do Figma nem de URLs temporárias.

Verificação: navegador Chromium, desktop 1440 × 900 e celular 390 × 844, estados inicial/intermediário/final, carregamento do SVG, remoção e preferência de movimento reduzido. Sem erros JavaScript observados. Safari e Firefox não foram testados nesta entrega.





