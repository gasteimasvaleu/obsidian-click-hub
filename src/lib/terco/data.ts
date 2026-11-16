export type MysterySet = "gozosos" | "dolorosos" | "gloriosos" | "luminosos";

export const PRAYERS = {
  sinal: { title: "Sinal da Cruz", text: "Pelo sinal da Santa Cruz, livrai-nos, Deus, Nosso Senhor, dos nossos inimigos. Em nome do Pai, do Filho e do Espírito Santo. Amém." },
  creio: { title: "Creio", text: "Creio em Deus Pai todo-poderoso, criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém." },
  paiNosso: { title: "Pai-Nosso", text: "Pai Nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém." },
  aveMaria: { title: "Ave-Maria", text: "Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém." },
  gloria: { title: "Glória", text: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém." },
  fatima: { title: "Ó meu Jesus", text: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas todas para o céu e socorrei principalmente as que mais precisarem." },
  salve: { title: "Salve Rainha", text: "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém." },
} as const;
export type PrayerKey = keyof typeof PRAYERS;

export interface Mystery { title: string; ref: string; meditation: string }

export const MYSTERY_SET_NAMES: Record<MysterySet, string> = {
  gozosos: "Mistérios Gozosos", dolorosos: "Mistérios Dolorosos", gloriosos: "Mistérios Gloriosos", luminosos: "Mistérios Luminosos",
};

export const MYSTERIES: Record<MysterySet, Mystery[]> = {
  gozosos: [
    { title: "A Anunciação do Anjo a Maria", ref: "Lc 1,26-38", meditation: "Maria diz sim a Deus com confiança. Peçamos um coração disponível para fazer a vontade do Pai." },
    { title: "A Visitação de Maria a Isabel", ref: "Lc 1,39-56", meditation: "Maria vai depressa servir sua prima. Peçamos a graça da caridade com quem precisa de nós." },
    { title: "O Nascimento de Jesus em Belém", ref: "Lc 2,1-20", meditation: "Deus se faz pequeno numa manjedoura. Peçamos humildade e um coração simples." },
    { title: "A Apresentação de Jesus no Templo", ref: "Lc 2,22-38", meditation: "Maria e José oferecem Jesus a Deus. Peçamos a graça de oferecer a Deus toda a nossa vida." },
    { title: "O Encontro de Jesus no Templo", ref: "Lc 2,41-52", meditation: "Jesus está nas coisas do Pai. Peçamos a graça de buscar sempre a Jesus e nunca perdê-lo." },
  ],
  dolorosos: [
    { title: "A Agonia de Jesus no Horto", ref: "Lc 22,39-46", meditation: "Jesus reza e entrega tudo ao Pai. Peçamos força para rezar nos momentos difíceis." },
    { title: "A Flagelação de Jesus", ref: "Jo 19,1", meditation: "Jesus sofre por amor a nós. Peçamos a graça de vencer o pecado e cuidar do nosso corpo." },
    { title: "A Coroação de Espinhos", ref: "Mt 27,27-31", meditation: "Jesus é zombado e permanece manso. Peçamos paciência e humildade diante das ofensas." },
    { title: "Jesus carrega a Cruz", ref: "Jo 19,17", meditation: "Jesus leva a cruz até o Calvário. Peçamos coragem para carregar nossas cruzes com amor." },
    { title: "A Crucifixão e Morte de Jesus", ref: "Lc 23,33-46", meditation: "Jesus perdoa e entrega sua vida. Peçamos a graça do perdão e o amor a Jesus crucificado." },
  ],
  gloriosos: [
    { title: "A Ressurreição de Jesus", ref: "Mt 28,1-10", meditation: "Jesus vence a morte! Peçamos uma fé viva e cheia de alegria." },
    { title: "A Ascensão de Jesus ao Céu", ref: "At 1,6-11", meditation: "Jesus sobe ao Pai e nos espera. Peçamos o desejo do Céu." },
    { title: "A Vinda do Espírito Santo", ref: "At 2,1-13", meditation: "O Espírito Santo desce sobre Maria e os apóstolos. Peçamos os dons do Espírito Santo." },
    { title: "A Assunção de Maria ao Céu", ref: "Ap 12,1", meditation: "Maria é levada ao Céu em corpo e alma. Peçamos a graça de uma santa morte." },
    { title: "A Coroação de Maria", ref: "Ap 12,1", meditation: "Maria é coroada Rainha do Céu e da Terra. Peçamos sua proteção de Mãe." },
  ],
  luminosos: [
    { title: "O Batismo de Jesus no Jordão", ref: "Mt 3,13-17", meditation: "O Pai diz: Este é o meu Filho amado. Peçamos a graça de viver como filhos de Deus." },
    { title: "As Bodas de Caná", ref: "Jo 2,1-12", meditation: "Maria diz: Fazei tudo o que Ele vos disser. Peçamos confiança na intercessão de Maria." },
    { title: "O Anúncio do Reino de Deus", ref: "Mc 1,14-15", meditation: "Jesus nos chama à conversão. Peçamos um coração arrependido e aberto ao Evangelho." },
    { title: "A Transfiguração de Jesus", ref: "Lc 9,28-36", meditation: "Jesus mostra sua glória no monte. Peçamos a graça de escutar Jesus." },
    { title: "A Instituição da Eucaristia", ref: "Lc 22,14-20", meditation: "Jesus se dá a nós no pão e no vinho. Peçamos amor à Santa Missa e à Eucaristia." },
  ],
};

/** Domingo=0 ... Sábado=6 */
export function mysteryForDay(day: number): MysterySet {
  if (day === 1 || day === 6) return "gozosos";
  if (day === 2 || day === 5) return "dolorosos";
  if (day === 4) return "luminosos";
  return "gloriosos";
}
