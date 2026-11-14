/** Desenhos 2D de cada livro da Bíblia, indexados pelo nome normalizado. */
import l_genesis from "@/assets/livros/genesis.png.asset.json";
import l_exodo from "@/assets/livros/exodo.png.asset.json";
import l_levitico from "@/assets/livros/levitico.png.asset.json";
import l_numeros from "@/assets/livros/numeros.png.asset.json";
import l_deuteronomio from "@/assets/livros/deuteronomio.png.asset.json";
import l_josue from "@/assets/livros/josue.png.asset.json";
import l_juizes from "@/assets/livros/juizes.png.asset.json";
import l_rute from "@/assets/livros/rute.png.asset.json";
import l_1samuel from "@/assets/livros/1samuel.png.asset.json";
import l_2samuel from "@/assets/livros/2samuel.png.asset.json";
import l_1reis from "@/assets/livros/1reis.png.asset.json";
import l_2reis from "@/assets/livros/2reis.png.asset.json";
import l_1cronicas from "@/assets/livros/1cronicas.png.asset.json";
import l_2cronicas from "@/assets/livros/2cronicas.png.asset.json";
import l_esdras from "@/assets/livros/esdras.png.asset.json";
import l_neemias from "@/assets/livros/neemias.png.asset.json";
import l_tobias from "@/assets/livros/tobias.png.asset.json";
import l_judite from "@/assets/livros/judite.png.asset.json";
import l_ester from "@/assets/livros/ester.png.asset.json";
import l_1macabeus from "@/assets/livros/1macabeus.png.asset.json";
import l_2macabeus from "@/assets/livros/2macabeus.png.asset.json";
import l_jo from "@/assets/livros/jo.png.asset.json";
import l_salmos from "@/assets/livros/salmos.png.asset.json";
import l_proverbios from "@/assets/livros/proverbios.png.asset.json";
import l_eclesiastes from "@/assets/livros/eclesiastes.png.asset.json";
import l_cantico from "@/assets/livros/cantico.png.asset.json";
import l_sabedoria from "@/assets/livros/sabedoria.png.asset.json";
import l_eclesiastico from "@/assets/livros/eclesiastico.png.asset.json";
import l_isaias from "@/assets/livros/isaias.png.asset.json";
import l_jeremias from "@/assets/livros/jeremias.png.asset.json";
import l_lamentacoes from "@/assets/livros/lamentacoes.png.asset.json";
import l_baruc from "@/assets/livros/baruc.png.asset.json";
import l_ezequiel from "@/assets/livros/ezequiel.png.asset.json";
import l_daniel from "@/assets/livros/daniel.png.asset.json";
import l_oseias from "@/assets/livros/oseias.png.asset.json";
import l_joel from "@/assets/livros/joel.png.asset.json";
import l_amos from "@/assets/livros/amos.png.asset.json";
import l_abdias from "@/assets/livros/abdias.png.asset.json";
import l_jonas from "@/assets/livros/jonas.png.asset.json";
import l_miqueias from "@/assets/livros/miqueias.png.asset.json";
import l_naum from "@/assets/livros/naum.png.asset.json";
import l_habacuc from "@/assets/livros/habacuc.png.asset.json";
import l_sofonias from "@/assets/livros/sofonias.png.asset.json";
import l_ageu from "@/assets/livros/ageu.png.asset.json";
import l_zacarias from "@/assets/livros/zacarias.png.asset.json";
import l_malaquias from "@/assets/livros/malaquias.png.asset.json";
import l_mateus from "@/assets/livros/mateus.png.asset.json";
import l_marcos from "@/assets/livros/marcos.png.asset.json";
import l_lucas from "@/assets/livros/lucas.png.asset.json";
import l_joao from "@/assets/livros/joao.png.asset.json";
import l_atos from "@/assets/livros/atos.png.asset.json";
import l_romanos from "@/assets/livros/romanos.png.asset.json";
import l_1corintios from "@/assets/livros/1corintios.png.asset.json";
import l_2corintios from "@/assets/livros/2corintios.png.asset.json";
import l_galatas from "@/assets/livros/galatas.png.asset.json";
import l_efesios from "@/assets/livros/efesios.png.asset.json";
import l_filipenses from "@/assets/livros/filipenses.png.asset.json";
import l_colossenses from "@/assets/livros/colossenses.png.asset.json";
import l_1tessalonicenses from "@/assets/livros/1tessalonicenses.png.asset.json";
import l_2tessalonicenses from "@/assets/livros/2tessalonicenses.png.asset.json";
import l_1timoteo from "@/assets/livros/1timoteo.png.asset.json";
import l_2timoteo from "@/assets/livros/2timoteo.png.asset.json";
import l_tito from "@/assets/livros/tito.png.asset.json";
import l_filemon from "@/assets/livros/filemon.png.asset.json";
import l_hebreus from "@/assets/livros/hebreus.png.asset.json";
import l_tiago from "@/assets/livros/tiago.png.asset.json";
import l_1pedro from "@/assets/livros/1pedro.png.asset.json";
import l_2pedro from "@/assets/livros/2pedro.png.asset.json";
import l_1joao from "@/assets/livros/1joao.png.asset.json";
import l_2joao from "@/assets/livros/2joao.png.asset.json";
import l_3joao from "@/assets/livros/3joao.png.asset.json";
import l_judas from "@/assets/livros/judas.png.asset.json";
import l_apocalipse from "@/assets/livros/apocalipse.png.asset.json";

const MAP: Record<string, string> = {
  "genesis": l_genesis.url,
  "exodo": l_exodo.url,
  "levitico": l_levitico.url,
  "numeros": l_numeros.url,
  "deuteronomio": l_deuteronomio.url,
  "josue": l_josue.url,
  "juizes": l_juizes.url,
  "rute": l_rute.url,
  "1samuel": l_1samuel.url,
  "2samuel": l_2samuel.url,
  "1reis": l_1reis.url,
  "2reis": l_2reis.url,
  "1cronicas": l_1cronicas.url,
  "2cronicas": l_2cronicas.url,
  "esdras": l_esdras.url,
  "neemias": l_neemias.url,
  "tobias": l_tobias.url,
  "judite": l_judite.url,
  "ester": l_ester.url,
  "1macabeus": l_1macabeus.url,
  "2macabeus": l_2macabeus.url,
  "jo": l_jo.url,
  "salmos": l_salmos.url,
  "proverbios": l_proverbios.url,
  "eclesiastes": l_eclesiastes.url,
  "canticodoscanticos": l_cantico.url,
  "sabedoria": l_sabedoria.url,
  "eclesiastico": l_eclesiastico.url,
  "isaias": l_isaias.url,
  "jeremias": l_jeremias.url,
  "lamentacoes": l_lamentacoes.url,
  "baruc": l_baruc.url,
  "ezequiel": l_ezequiel.url,
  "daniel": l_daniel.url,
  "oseias": l_oseias.url,
  "joel": l_joel.url,
  "amos": l_amos.url,
  "abdias": l_abdias.url,
  "jonas": l_jonas.url,
  "miqueias": l_miqueias.url,
  "naum": l_naum.url,
  "habacuc": l_habacuc.url,
  "sofonias": l_sofonias.url,
  "ageu": l_ageu.url,
  "zacarias": l_zacarias.url,
  "malaquias": l_malaquias.url,
  "mateus": l_mateus.url,
  "marcos": l_marcos.url,
  "lucas": l_lucas.url,
  "joao": l_joao.url,
  "atosdosapostolos": l_atos.url,
  "romanos": l_romanos.url,
  "1corintios": l_1corintios.url,
  "2corintios": l_2corintios.url,
  "galatas": l_galatas.url,
  "efesios": l_efesios.url,
  "filipenses": l_filipenses.url,
  "colossenses": l_colossenses.url,
  "1tessalonicenses": l_1tessalonicenses.url,
  "2tessalonicenses": l_2tessalonicenses.url,
  "1timoteo": l_1timoteo.url,
  "2timoteo": l_2timoteo.url,
  "tito": l_tito.url,
  "filemon": l_filemon.url,
  "hebreus": l_hebreus.url,
  "tiago": l_tiago.url,
  "1pedro": l_1pedro.url,
  "2pedro": l_2pedro.url,
  "1joao": l_1joao.url,
  "2joao": l_2joao.url,
  "3joao": l_3joao.url,
  "judas": l_judas.url,
  "apocalipse": l_apocalipse.url,
};

export function normalizeBookName(name: string): string {
  let n = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  n = n.replace(/\bsao\s+/g, "");
  n = n.replace(/^(iii|ii|i)\s+/, (m) => String(m.trim().length));
  return n.replace(/[^a-z0-9]/g, "");
}

export function getBookIllustration(name?: string | null): string | undefined {
  return name ? MAP[normalizeBookName(name)] : undefined;
}
