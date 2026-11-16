# Página Terço com terço 3D

## O que a pessoa vai ver
- Nova página **Terço** (`/terco`), no menu Mais, ao lado de Orações, com o visual padrão do app (título em gradiente, largura da Bíblia, botão voltar com setas).
- **Mistérios do dia automáticos**: Gozosos (seg e sáb), Dolorosos (ter e sex), Gloriosos (qua e dom), Luminosos (qui).
- **Terço 3D** no centro: crucifixo, contas grandes (Pai-Nosso), contas pequenas (Ave-Maria) e a medalha central. Arrastar gira o terço.
- **Rezar tocando na conta**: a conta atual brilha em violeta; ao tocar, ela fica marcada, a câmera gira até a próxima e a oração muda. Só a conta certa avança (evita toques errados).
- **Texto da oração na tela**, em cartão abaixo do terço (Sinal da Cruz, Creio, Pai-Nosso, Ave-Maria, Glória, Ó meu Jesus, Salve Rainha).
- **Meditação de cada mistério**: no início de cada dezena, aparece o nome do mistério, a passagem bíblica (Ave Maria) e uma meditação curta.
- **Áudio narrado**: botão para ligar/desligar a voz lendo cada oração e meditação.
- **Progresso**: barra "Dezena 2 de 5 · Ave-Maria 7 de 10"; se sair no meio, retoma de onde parou.
- **Ao terminar**: tela de parabéns, terço salvo no **histórico** (data e mistério) e contagem de dias seguidos.
- **Livre para todos** os usuários logados.
- **Home:** o card Comunidade (estilo carta) da tela inicial passa a ser o card **Terço**, com imagem 2D própria. A Comunidade continua acessível pelo menu Mais.

## Ordem do terço (59 contas)
```text
Crucifixo: Sinal da Cruz + Creio
1 grande: Pai-Nosso
3 pequenas: Ave-Maria (fé, esperança, caridade)
1 grande: Glória
Medalha → 5 dezenas: [anúncio do mistério + meditação, Pai-Nosso, 10 Ave-Marias, Glória + Ó meu Jesus]
Final: Salve Rainha + Sinal da Cruz
```

## Detalhes técnicos
- Instalar `three`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122` (React 18). Terço procedural (esferas instanciadas ao longo de uma curva + crucifixo modelado), materiais tipo madeira/pérola, iluminação local com Lightformers (sem HDR externo), carregado sob demanda (lazy) para não pesar o app.
- Lógica em TypeScript puro (`src/lib/terco/`): sequência das contas, mistérios por dia, textos das orações e meditações (fixos, revisados pela doutrina católica). Testes unitários para mistério do dia e sequência de 59 passos.
- Áudio: as orações fixas narradas uma vez em MP3 (voz da IA do Lovable) e guardadas no app, para tocar sem custo a cada uso e funcionar no celular.
- Banco: tabela `rosary_sessions` (user_id, mystery_set, completed_at) com RLS só do próprio usuário; progresso em andamento fica salvo no aparelho.
- Rota protegida em `App.tsx` e item no menu Mais (`tubelight-navbar.tsx`), imagem 2D nova para o card.
- Validação: screenshot do terço renderizado no navegador; desempenho real no celular não pode ser medido aqui.
