# Quizzes que faltam na página Jogos

Hoje a página Jogos tem 18 quizzes, todos do curso Contos Bíblicos. Vou criar os que faltam, no mesmo formato dos que já existem: 10 perguntas, 4 opções, a passagem bíblica (Bíblia Ave Maria) e uma explicação curta para cada resposta, dificuldade Médio.

## Contos Bíblicos (4 que faltam)
- Sansão e Dalila
- Davi e Golias
- O Nascimento de Jesus
- A Multiplicação dos Pães

## As Parábolas de Jesus (19, nenhuma tem quiz ainda)
O Filho Pródigo, O Bom Samaritano, As Dez Virgens, Os Talentos, O Joio e o Trigo, A Ovelha Perdida, O Semeador, A Pérola de Grande Valor, O Fariseu e o Publicano, A História de Jó, Lázaro e o Rico, O Grão de Mostarda, O Servo Mau, Os Convidados para a Festa de Casamento, A Viúva e o Juiz, O Tesouro Escondido, O Amigo Fiel, Os Dois Devedores, O Administrador Desonesto.

## Como fica
- Títulos no padrão atual: "Quizz - Nome da História".
- Perguntas pensadas para crianças, fiéis ao texto bíblico e à doutrina católica, sem emojis.
- Todos aparecem já disponíveis na página Jogos e podem ser editados ou ocultados no painel admin.

## Detalhes técnicos
- Inserir 23 linhas na tabela `games` (type `quiz`, icon_name `Brain`, color `text-primary`, difficulty `Médio`, available true), com `content_json = {questions:[{question, options[4], correctAnswer (0-3), verse, explanation}]}`, igual aos existentes.
- Conteúdo escrito por mim, revisado quanto às passagens; inserção por SQL no banco, sem mudança de código.
- Variar a posição da resposta certa entre as perguntas.
- Conferir depois com uma consulta (23 novos, 10 perguntas cada, correctAnswer válido).
