-- Inserir as 20 orações tradicionais católicas do repositório GitHub
INSERT INTO prayers (title, content, category, icon_name, display_order, available) VALUES

-- ESSENCIAL (3 orações)
('Pai Nosso', 'Pai nosso que estais nos Céus,
santificado seja o vosso Nome,
venha a nós o vosso Reino,
seja feita a vossa vontade
assim na terra como no Céu.
O pão nosso de cada dia nos dai hoje,
perdoai-nos as nossas ofensas
assim como nós perdoamos
a quem nos tem ofendido,
e não nos deixeis cair em tentação,
mas livrai-nos do Mal.
Amém.', 'essencial', 'book-open', 1, true),

('Credo', 'Creio em Deus Pai todo-poderoso,
Criador do Céu e da terra.
E em Jesus Cristo, seu único Filho, nosso Senhor,
que foi concebido pelo poder do Espírito Santo,
nasceu da Virgem Maria.
Padeceu sob Pôncio Pilatos,
foi crucificado, morto e sepultado.
Desceu à mansão dos mortos,
ressuscitou ao terceiro dia,
subiu aos Céus,
está sentado à direita de Deus Pai todo-poderoso,
de onde há de vir a julgar os vivos e os mortos.
Creio no Espírito Santo,
na Santa Igreja Católica,
na comunhão dos Santos,
na remissão dos pecados,
na ressurreição da carne,
na vida eterna.
Amém.', 'essencial', 'book-open', 2, true),

('Glória', 'Glória ao Pai, ao Filho e ao Espírito Santo,
como era no princípio, agora e sempre.
Amém.', 'essencial', 'book-open', 3, true),

-- MARIANA (9 orações)
('Ave Maria', 'Ave Maria, cheia de graça,
o Senhor é convosco,
bendita sois vós entre as mulheres
e bendito é o fruto do vosso ventre, Jesus.
Santa Maria, Mãe de Deus,
rogai por nós pecadores,
agora e na hora da nossa morte.
Amém.', 'mariana', 'star', 1, true),

('Salve Rainha', 'Salve, Rainha, Mãe de misericórdia,
vida, doçura e esperança nossa, salve!
A vós bradamos, os degredados filhos de Eva.
A vós suspiramos, gemendo e chorando
neste vale de lágrimas.
Eia, pois, advogada nossa,
esses vossos olhos misericordiosos a nós volvei.
E depois deste desterro,
mostrai-nos Jesus, bendito fruto do vosso ventre.
Ó clemente, ó piedosa, ó doce sempre Virgem Maria.
Rogai por nós, Santa Mãe de Deus,
para que sejamos dignos das promessas de Cristo.
Amém.', 'mariana', 'star', 2, true),

('Magnificat', 'A minha alma engrandece o Senhor,
e o meu espírito exulta em Deus, meu Salvador,
porque olhou para a humilhação de sua serva.
Sim! Doravante as gerações todas me chamarão de bem-aventurada,
pois o Todo-Poderoso fez grandes coisas em meu favor.
Seu nome é santo, e sua misericórdia perdura de geração em geração
para aqueles que o temem.
Ele mostrou a força de seu braço:
dispersou os homens de coração orgulhoso.
Depôs poderosos de seus tronos
e a humildes exaltou.
Cumulou de bens a famintos
e despediu ricos de mãos vazias.
Socorreu Israel, seu servo,
lembrando de sua misericórdia –
conforme prometera a nossos pais –
em favor de Abraão e de sua descendência, para sempre.', 'mariana', 'star', 3, true),

('Lembrai-vos (Memorare)', 'Lembrai-vos, ó piíssima Virgem Maria,
que nunca se ouviu dizer que algum daqueles
que recorreram à vossa proteção,
imploraram a vossa assistência,
reclamaram o vosso socorro,
fosse por vós desamparado.
Animado eu, pois, de igual confiança,
a vós, ó Virgem das virgens,
como Mãe recorro;
a vós venho e, gemendo sob o peso de meus pecados,
prostro-me a vossos pés.
Não desprezeis as minhas súplicas,
ó Mãe do Verbo, mas dignai-vos ouvi-las e atendê-las.
Amém.', 'mariana', 'star', 4, true),

('Angelus', 'O Anjo do Senhor anunciou a Maria.
E ela concebeu do Espírito Santo.
Ave Maria...

Eis aqui a serva do Senhor.
Faça-se em mim segundo a vossa palavra.
Ave Maria...

E o Verbo se fez carne.
E habitou entre nós.
Ave Maria...

Rogai por nós, Santa Mãe de Deus.
Para que sejamos dignos das promessas de Cristo.

Oremos: Infundi, Senhor, a vossa graça em nossas almas,
para que nós, que pelo anúncio do Anjo conhecemos
a encarnação de Cristo, vosso Filho,
pela sua Paixão e Cruz sejamos levados à glória da ressurreição.
Pelo mesmo Cristo, Senhor nosso.
Amém.', 'mariana', 'star', 5, true),

('Regina Coeli', 'Rainha do Céu, alegrai-vos, aleluia!
Porque aquele que merecestes trazer em vosso seio, aleluia!
Ressuscitou como disse, aleluia!
Rogai a Deus por nós, aleluia!

Exultai e alegrai-vos, ó Virgem Maria, aleluia!
Porque o Senhor ressuscitou verdadeiramente, aleluia!

Oremos: Ó Deus, que vos dignastes alegrar o mundo
com a ressurreição do vosso Filho, nosso Senhor Jesus Cristo,
concedei-nos, vos pedimos,
que por sua Mãe, a Virgem Maria,
alcancemos as alegrias da vida eterna.
Pelo mesmo Cristo, nosso Senhor.
Amém.', 'mariana', 'star', 6, true),

('Sub Tuum Praesidium', 'Sob a vossa proteção nos refugiamos,
Santa Mãe de Deus.
Não desprezeis as nossas súplicas em nossas necessidades,
mas livrai-nos sempre de todos os perigos,
ó Virgem gloriosa e bendita.', 'mariana', 'star', 7, true),

('Oração de Fátima', 'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno,
levai as almas todas para o Céu,
e socorrei principalmente as que mais precisarem.
Amém.', 'mariana', 'star', 8, true),

-- PROTEÇÃO (2 orações)
('Santo Anjo', 'Santo Anjo do Senhor,
meu zeloso guardador,
se a ti me confiou a piedade divina,
sempre me rege, guarda, governa e ilumina.
Amém.', 'protecao', 'shield', 1, true),

('Oração a São Miguel Arcanjo', 'São Miguel Arcanjo, defendei-nos no combate,
sede nosso refúgio contra as maldades e ciladas do demônio.
Ordene-lhe Deus, instantemente o pedimos,
e vós, príncipe da milícia celeste,
pela virtude divina,
precipitai no inferno a Satanás
e aos outros espíritos malignos
que andam pelo mundo para perder as almas.
Amém.', 'protecao', 'shield', 2, true),

-- PENITÊNCIA (2 orações)
('Ato de Contrição', 'Meu Deus, porque sois infinitamente bom
e vos amo de todo o meu coração,
pesa-me de vos ter ofendido;
e, com o auxílio da vossa graça,
proponho firmemente emendar-me
e nunca mais vos tornar a ofender.
Peço e espero o perdão das minhas culpas
pela vossa infinita misericórdia.
Amém.', 'penitencia', 'heart', 1, true),

('Confiteor', 'Confesso a Deus todo-poderoso
e a vós, irmãos e irmãs,
que pequei muitas vezes
por pensamentos e palavras,
atos e omissões,
por minha culpa, minha tão grande culpa.
E peço à Virgem Maria,
aos anjos e santos
e a vós, irmãos e irmãs,
que rogueis por mim a Deus, nosso Senhor.
Amém.', 'penitencia', 'heart', 2, true),

-- REFEIÇÃO (2 orações)
('Oração Antes da Refeição', 'Abençoai, Senhor, esta refeição
e a todos os que a prepararam.
Dai pão a quem tem fome
e fome de justiça a quem tem pão.
Amém.', 'refeicao', 'utensils-crossed', 1, true),

('Oração Depois da Refeição', 'Graças vos damos, Senhor,
por todos os vossos benefícios,
vós que viveis e reinais pelos séculos dos séculos.
Amém.', 'refeicao', 'utensils-crossed', 2, true),

-- ESPÍRITO SANTO (1 oração)
('Vinde, Espírito Santo', 'Vinde, Espírito Santo,
enchei os corações dos vossos fiéis
e acendei neles o fogo do vosso amor.
Enviai o vosso Espírito e tudo será criado,
e renovareis a face da terra.

Oremos: Ó Deus, que instruístes os corações dos vossos fiéis
com a luz do Espírito Santo,
fazei que apreciemos retamente todas as coisas
segundo o mesmo Espírito
e gozemos sempre da sua consolação.
Por Cristo, Senhor nosso.
Amém.', 'espirito_santo', 'sparkles', 1, true),

-- EUCARÍSTICA (1 oração)
('Adoro Te Devote', 'Adoro-vos devotamente, Divindade escondida,
que sob estas aparências verdadeiramente vos ocultais.
A vós meu coração por inteiro se submete,
porque a contemplar-vos todo ele desfalece.

A vista, o tato, o gosto em vós se enganam,
só no ouvido se pode com segurança crer;
creio em tudo quanto disse o Filho de Deus:
nada mais verdadeiro que esta palavra de verdade.

Na Cruz só a divindade se escondia,
mas aqui também se esconde a humanidade;
acreditando e confessando ambas,
peço o que pediu o ladrão arrependido.

As chagas, como Tomé, não as vejo,
mas confesso-vos meu Deus;
fazei que eu sempre mais em vós creia,
em vós espere e vos ame.

Ó memorial da morte do Senhor,
pão vivo, que dais vida ao homem,
concedei ao meu espírito viver de vós
e saborear-vos sempre com doçura.

Senhor Jesus, bom pelicano,
purificai-me a mim, que sou imundo, no vosso sangue,
do qual uma só gota pode salvar
o mundo inteiro de toda culpa.

Jesus, que velado agora vejo,
peço que se cumpra o que tanto desejo:
que ao ver a descoberto a vossa face
eu seja feliz na visão da vossa glória.
Amém.', 'eucaristica', 'church', 1, true),

-- MISERICÓRDIA (1 oração)
('Terço da Divina Misericórdia', 'No início, reza-se: Pai Nosso, Ave Maria e Credo.

Nas contas grandes (5 vezes):
Eterno Pai, eu Vos ofereço o Corpo e Sangue,
Alma e Divindade de Vosso diletíssimo Filho,
Nosso Senhor Jesus Cristo,
em expiação dos nossos pecados
e dos do mundo inteiro.

Nas contas pequenas (10 vezes após cada conta grande):
Pela Sua dolorosa Paixão,
tende misericórdia de nós e do mundo inteiro.

No final (3 vezes):
Deus Santo, Deus Forte, Deus Imortal,
tende piedade de nós e do mundo inteiro.

Oração final:
Ó Sangue e Água que jorraste do Coração de Jesus
como fonte de misericórdia para nós, eu confio em Vós!', 'misericordia', 'heart-handshake', 1, true);
