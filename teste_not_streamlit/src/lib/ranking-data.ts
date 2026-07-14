// Mock ranking data for the QualiPréNeo Composite Index.
// Values reflect ranges cited in the project document; some entries are
// synthetic placeholders until the real CSVs are wired to Lovable Cloud.

export type SubScores = {
  prenatal: number;
  parto: number;
  neonatal: number;
  puerperio: number;
  perinatal: number;
};

export type Municipality = {
  ibge: string;
  name: string;
  uf: string;
  region: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  composite: number;
  rank: number;
  totalMunicipalities: number;
  population: number;
  scores: SubScores;
  trend: number[]; // 2018..2023
};

const TOTAL = 5570;

function s(prenatal: number, parto: number, neonatal: number, puerperio: number, perinatal: number): SubScores {
  return { prenatal, parto, neonatal, puerperio, perinatal };
}

export const TOP_15: Municipality[] = [
  { ibge: "4306106", name: "Cotiporã", uf: "RS", region: "Sul", composite: 64.0, rank: 1, totalMunicipalities: TOTAL, population: 3937, scores: s(72, 68, 61, 58, 62), trend: [51, 53, 55, 58, 61, 64] },
  { ibge: "4200309", name: "Águas Frias", uf: "SC", region: "Sul", composite: 59.0, rank: 2, totalMunicipalities: TOTAL, population: 2408, scores: s(66, 62, 58, 55, 58), trend: [48, 50, 52, 55, 57, 59] },
  { ibge: "4311502", name: "Linha Nova", uf: "RS", region: "Sul", composite: 58.0, rank: 3, totalMunicipalities: TOTAL, population: 1624, scores: s(64, 60, 58, 54, 55), trend: [47, 49, 51, 54, 56, 58] },
  { ibge: "4306601", name: "Cristal do Sul", uf: "RS", region: "Sul", composite: 57.4, rank: 4, totalMunicipalities: TOTAL, population: 2500, scores: s(63, 59, 57, 54, 55), trend: [46, 49, 51, 53, 55, 57] },
  { ibge: "3170206", name: "Turmalina", uf: "MG", region: "Sudeste", composite: 56.8, rank: 5, totalMunicipalities: TOTAL, population: 18033, scores: s(62, 58, 56, 53, 54), trend: [45, 48, 50, 52, 54, 57] },
  { ibge: "3103108", name: "Arco-Íris", uf: "SP", region: "Sudeste", composite: 55.5, rank: 6, totalMunicipalities: TOTAL, population: 2555, scores: s(61, 57, 55, 52, 53), trend: [46, 48, 51, 53, 54, 56] },
  { ibge: "3132404", name: "Itamarati de Minas", uf: "MG", region: "Sudeste", composite: 55.0, rank: 7, totalMunicipalities: TOTAL, population: 4034, scores: s(60, 56, 55, 52, 52), trend: [45, 47, 50, 52, 54, 55] },
  { ibge: "5107065", name: "Reserva do Cabaçal", uf: "MT", region: "Centro-Oeste", composite: 54.9, rank: 8, totalMunicipalities: TOTAL, population: 2620, scores: s(60, 56, 54, 52, 52), trend: [43, 46, 49, 51, 53, 55] },
  { ibge: "4318705", name: "São João do Polêsine", uf: "RS", region: "Sul", composite: 54.6, rank: 9, totalMunicipalities: TOTAL, population: 2635, scores: s(60, 55, 54, 52, 52), trend: [45, 47, 49, 51, 53, 55] },
  { ibge: "3163706", name: "São José da Varginha", uf: "MG", region: "Sudeste", composite: 54.2, rank: 10, totalMunicipalities: TOTAL, population: 4362, scores: s(59, 55, 54, 51, 52), trend: [44, 46, 49, 51, 53, 54] },
  { ibge: "4204509", name: "Cordilheira Alta", uf: "SC", region: "Sul", composite: 53.9, rank: 11, totalMunicipalities: TOTAL, population: 4184, scores: s(59, 55, 53, 51, 51), trend: [43, 46, 48, 50, 52, 54] },
  { ibge: "3155504", name: "Pedra Bonita", uf: "MG", region: "Sudeste", composite: 53.7, rank: 12, totalMunicipalities: TOTAL, population: 6540, scores: s(59, 54, 53, 51, 51), trend: [43, 45, 48, 50, 52, 54] },
  { ibge: "4127700", name: "Rio Bonito do Iguaçu", uf: "PR", region: "Sul", composite: 53.5, rank: 13, totalMunicipalities: TOTAL, population: 13656, scores: s(58, 54, 53, 51, 51), trend: [42, 45, 47, 49, 51, 54] },
  { ibge: "4308607", name: "Ivorá", uf: "RS", region: "Sul", composite: 53.3, rank: 14, totalMunicipalities: TOTAL, population: 1907, scores: s(58, 54, 53, 51, 51), trend: [43, 45, 47, 49, 51, 53] },
  { ibge: "3170701", name: "Vargem Alegre", uf: "MG", region: "Sudeste", composite: 53.1, rank: 15, totalMunicipalities: TOTAL, population: 6153, scores: s(58, 54, 52, 50, 51), trend: [42, 45, 47, 49, 51, 53] },
];

const BOTTOM_15_RAW: Municipality[] = [
  { ibge: "1400308", name: "Uiramutã", uf: "RR", region: "Norte", composite: 21.4, rank: TOTAL, totalMunicipalities: TOTAL, population: 11078, scores: s(24, 22, 20, 19, 22), trend: [18, 19, 20, 20, 21, 21] },
  { ibge: "1200401", name: "Marechal Thaumaturgo", uf: "AC", region: "Norte", composite: 22.1, rank: TOTAL - 1, totalMunicipalities: TOTAL, population: 20005, scores: s(25, 22, 21, 20, 22), trend: [19, 20, 20, 21, 22, 22] },
  { ibge: "2107506", name: "Nova Olinda do Maranhão", uf: "MA", region: "Nordeste", composite: 22.8, rank: TOTAL - 2, totalMunicipalities: TOTAL, population: 22254, scores: s(26, 23, 22, 20, 23), trend: [20, 21, 21, 22, 22, 23] },
  { ibge: "1508050", name: "Melgaço", uf: "PA", region: "Norte", composite: 23.5, rank: TOTAL - 3, totalMunicipalities: TOTAL, population: 25444, scores: s(26, 24, 22, 21, 24), trend: [20, 21, 22, 22, 23, 23] },
  { ibge: "2103125", name: "Cachoeira Grande", uf: "MA", region: "Nordeste", composite: 24.0, rank: TOTAL - 4, totalMunicipalities: TOTAL, population: 8837, scores: s(27, 24, 23, 21, 25), trend: [21, 22, 22, 23, 23, 24] },
  { ibge: "2201150", name: "Assunção do Piauí", uf: "PI", region: "Nordeste", composite: 24.5, rank: TOTAL - 5, totalMunicipalities: TOTAL, population: 7883, scores: s(28, 25, 23, 22, 25), trend: [21, 22, 23, 23, 24, 24] },
  { ibge: "1503705", name: "Chaves", uf: "PA", region: "Norte", composite: 25.0, rank: TOTAL - 6, totalMunicipalities: TOTAL, population: 22619, scores: s(28, 25, 24, 23, 25), trend: [21, 22, 23, 24, 24, 25] },
  { ibge: "1600154", name: "Pedra Branca do Amapari", uf: "AP", region: "Norte", composite: 25.3, rank: TOTAL - 7, totalMunicipalities: TOTAL, population: 15115, scores: s(28, 26, 24, 23, 25), trend: [22, 23, 23, 24, 25, 25] },
  { ibge: "2108306", name: "São Raimundo do Doca Bezerra", uf: "MA", region: "Nordeste", composite: 25.8, rank: TOTAL - 8, totalMunicipalities: TOTAL, population: 5019, scores: s(29, 26, 25, 23, 26), trend: [22, 23, 24, 24, 25, 26] },
  { ibge: "2916708", name: "Itapicuru", uf: "BA", region: "Nordeste", composite: 26.2, rank: TOTAL - 9, totalMunicipalities: TOTAL, population: 32261, scores: s(29, 27, 25, 24, 26), trend: [22, 23, 24, 25, 26, 26] },
  { ibge: "2400208", name: "Água Nova", uf: "RN", region: "Nordeste", composite: 26.7, rank: TOTAL - 10, totalMunicipalities: TOTAL, population: 2980, scores: s(30, 27, 26, 24, 26), trend: [23, 24, 24, 25, 26, 27] },
  { ibge: "2600054", name: "Afogados da Ingazeira", uf: "PE", region: "Nordeste", composite: 27.1, rank: TOTAL - 11, totalMunicipalities: TOTAL, population: 36405, scores: s(30, 28, 26, 24, 27), trend: [23, 24, 25, 25, 26, 27] },
  { ibge: "5101803", name: "Cocalinho", uf: "MT", region: "Centro-Oeste", composite: 27.5, rank: TOTAL - 12, totalMunicipalities: TOTAL, population: 5716, scores: s(31, 28, 26, 25, 27), trend: [23, 24, 25, 26, 27, 28] },
  { ibge: "2100501", name: "Alto Alegre do Pindaré", uf: "MA", region: "Nordeste", composite: 27.8, rank: TOTAL - 13, totalMunicipalities: TOTAL, population: 34395, scores: s(31, 28, 27, 25, 27), trend: [23, 24, 25, 26, 27, 28] },
  { ibge: "1508126", name: "Portel", uf: "PA", region: "Norte", composite: 28.2, rank: TOTAL - 14, totalMunicipalities: TOTAL, population: 61027, scores: s(31, 29, 27, 26, 28), trend: [24, 25, 26, 27, 27, 28] },
];

// Best-of-worst first so index 0 = position 5556; worst last.
export const BOTTOM_15: Municipality[] = [...BOTTOM_15_RAW].reverse();

export const NATIONAL_MEAN = 42.8;
export const NATIONAL_STDDEV = 8.4;
export const YEARS = [2018, 2019, 2020, 2021, 2022, 2023] as const;

export const SUB_SCORE_LABELS: Record<keyof SubScores, string> = {
  prenatal: "Pré-natal",
  parto: "Parto",
  neonatal: "Neonatal",
  puerperio: "Puerpério",
  perinatal: "Perinatal",
};