#!/usr/bin/env Rscript
# Converte o cubo gerado por scripts/custos_sihsus.R em JSON estatico para a
# aba "Custos hospitalares" (web/public/data/custos/custos.json).
#
# Uso (a partir da raiz do repo): Rscript scripts/export_custos_frontend.R

suppressMessages({
  library(data.table)
  library(jsonlite)
})

args <- commandArgs(trailingOnly = TRUE)
# planilha de nascidos vivos por municipio/ano do projeto (colunas year, codibge, nv_ano)
xlsx_nv <- if (length(args) >= 1) args[1] else
  "/Volumes/HD JULIA/QualiPreNeo/indicadores/taxa_bruta_natalidade/natalidade_munic_ano.xlsx"
dir_in <- "data/custos"
out <- "web/public/data/custos/custos.json"
dir.create(dirname(out), showWarnings = FALSE, recursive = TRUE)

parto <- fread(file.path(dir_in, "cubo_parto.csv"))
neo <- fread(file.path(dir_in, "cubo_neonatal_cid_completo.csv"))

# --- UFs -----------------------------------------------------------------------
ufs <- data.table(
  cod = c(11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 35, 41, 42, 43, 50, 51, 52, 53),
  sigla = c("RO", "AC", "AM", "RR", "PA", "AP", "TO", "MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA",
            "MG", "ES", "RJ", "SP", "PR", "SC", "RS", "MS", "MT", "GO", "DF"),
  nome = c("Rondônia", "Acre", "Amazonas", "Roraima", "Pará", "Amapá", "Tocantins", "Maranhão", "Piauí", "Ceará",
           "Rio Grande do Norte", "Paraíba", "Pernambuco", "Alagoas", "Sergipe", "Bahia", "Minas Gerais",
           "Espírito Santo", "Rio de Janeiro", "São Paulo", "Paraná", "Santa Catarina", "Rio Grande do Sul",
           "Mato Grosso do Sul", "Mato Grosso", "Goiás", "Distrito Federal"),
  regiao = c(rep("Norte", 7), rep("Nordeste", 9), rep("Sudeste", 4), rep("Sul", 3), rep("Centro-Oeste", 4))
)
stopifnot(all(parto$uf %in% ufs$cod), all(neo$uf %in% ufs$cod))

# --- nascidos vivos (todos, SINASC) por UF e ano --------------------------------
nv <- as.data.table(readxl::read_excel(xlsx_nv))[!is.na(nv_ano) & year >= 2011 & year <= 2022]
nv[, uf := as.integer(substr(codibge, 1, 2))]
nv_uf <- nv[uf %in% ufs$cod, .(nv = sum(nv_ano)), by = .(uf, ano = year)]
stopifnot(nrow(nv_uf) == 27 * 12)
fwrite(merge(nv_uf, ufs[, .(uf = cod, sigla)], by = "uf")[order(uf, ano)][, .(sigla, ano, nascidos_vivos = nv)],
       file.path(dir_in, "nascidos_vivos_uf_ano.csv"))

# --- vias de parto ---------------------------------------------------------------
vias <- data.table(
  id = c("normal", "normal_alto_risco", "normal_cpn", "cesarea", "cesarea_alto_risco", "cesarea_laqueadura"),
  label = c("Parto normal", "Parto normal em gestação de alto risco", "Parto normal em centro de parto normal (CPN)",
            "Parto cesariano", "Parto cesariano em gestação de alto risco", "Parto cesariano com laqueadura tubária"),
  grupo = c(rep("Vaginal", 3), rep("Cesárea", 3))
)

# --- CIDs neonatais: top 30 por custo total + "Outros" ----------------------------
cid_info <- rbindlist(list(
  list("P073", "Outros recém-nascidos pré-termo", "Prematuridade e baixo peso"),
  list("P220", "Síndrome da angústia respiratória do recém-nascido", "Problemas respiratórios"),
  list("P229", "Desconforto respiratório do recém-nascido, não especificado", "Problemas respiratórios"),
  list("P228", "Outros desconfortos respiratórios do recém-nascido", "Problemas respiratórios"),
  list("P072", "Imaturidade extrema", "Prematuridade e baixo peso"),
  list("P285", "Insuficiência respiratória do recém-nascido", "Problemas respiratórios"),
  list("A419", "Septicemia não especificada", "Infecções"),
  list("P599", "Icterícia neonatal não especificada", "Icterícia neonatal"),
  list("P071", "Outros recém-nascidos de peso baixo", "Prematuridade e baixo peso"),
  list("P050", "Recém-nascido leve para a idade gestacional", "Prematuridade e baixo peso"),
  list("P221", "Taquipneia transitória do recém-nascido", "Problemas respiratórios"),
  list("P210", "Asfixia grave ao nascer", "Asfixia e hipóxia"),
  list("P219", "Asfixia ao nascer, não especificada", "Asfixia e hipóxia"),
  list("P399", "Infecção específica do período perinatal, não especificada", "Infecções"),
  list("P369", "Septicemia bacteriana do recém-nascido, não especificada", "Infecções"),
  list("P289", "Afecção respiratória do recém-nascido, não especificada", "Problemas respiratórios"),
  list("P200", "Hipóxia intrauterina notada antes do início do trabalho de parto", "Asfixia e hipóxia"),
  list("P070", "Peso extremamente baixo ao nascer", "Prematuridade e baixo peso"),
  list("P051", "Pequeno para a idade gestacional", "Prematuridade e baixo peso"),
  list("A499", "Infecção bacteriana de localização não especificada", "Infecções"),
  list("P704", "Outras hipoglicemias neonatais", "Outras"),
  list("A509", "Sífilis congênita não especificada", "Infecções"),
  list("P969", "Afecção originada no período perinatal, não especificada", "Outras"),
  list("P288", "Outras afecções respiratórias especificadas do recém-nascido", "Problemas respiratórios"),
  list("P968", "Outras afecções especificadas originadas no período perinatal", "Outras"),
  list("P299", "Transtorno cardiovascular originado no período perinatal, não especificado", "Outras"),
  list("P398", "Outras infecções específicas do período perinatal", "Infecções"),
  list("J960", "Insuficiência respiratória aguda", "Problemas respiratórios"),
  list("K564", "Outras obstruções do intestino", "Outras"),
  list("K566", "Outras obstruções intestinais e as não especificadas", "Outras")
))
setnames(cid_info, c("cod", "nome", "grupo"))

rank <- neo[, .(custo = sum(val_tot)), cid][order(-custo)]
top30 <- rank$cid[1:30]
stopifnot(setequal(top30, cid_info$cod)) # dicionario acima precisa cobrir exatamente o top 30
cid_info <- rbind(cid_info[match(top30, cod)],
                  list("OUTROS", "Demais diagnósticos", "Outras"))

neo[, cat := ifelse(cid %in% top30, cid, "OUTROS")]
neo_c <- neo[, lapply(.SD, sum), by = .(ano, uf, cat, uti), .SDcols = setdiff(names(neo), c("ano", "uf", "cid", "uti", "cat"))]
parto[, cat := via]
parto_c <- parto[, lapply(.SD, sum), by = .(ano, uf, cat, uti), .SDcols = setdiff(names(parto), c("ano", "uf", "via", "uti", "cat"))]

metricas <- c("n", "n_obito", "n_uti", "val_tot", "val_tot2", "val_sh", "val_sp", "val_uti", "val_uti2",
              "dias", "dias2", "dias_uti", "dias_uti2", "val_tot_nom")

para_linhas <- function(x, nomes_cat) {
  x <- copy(x)
  x[, cat := match(cat, nomes_cat) - 1L]
  x[, uf := match(uf, ufs$cod) - 1L]
  x[, ano := ano - min(ano)]
  setcolorder(x, c("ano", "uf", "cat", "uti", metricas))
  x <- x[, c("ano", "uf", "cat", "uti", metricas), with = FALSE]
  for (m in c("val_tot", "val_tot2", "val_sh", "val_sp", "val_uti", "val_uti2", "val_tot_nom")) x[[m]] <- round(x[[m]])
  m <- as.matrix(x)
  lapply(seq_len(nrow(m)), function(i) unname(m[i, ]))
}

anos <- sort(unique(parto$ano))
cols <- c("ano", "uf", "cat", "uti", metricas)

json <- list(
  meta = list(
    periodo = c(min(anos), max(anos)),
    ano_base_preco = 2023,
    ipca = list("2011" = 1.9999, "2012" = 1.8950, "2013" = 1.7916, "2014" = 1.6814, "2015" = 1.5219, "2016" = 1.4225,
                "2017" = 1.3837, "2018" = 1.3299, "2019" = 1.2878, "2020" = 1.2345, "2021" = 1.1148, "2022" = 1.0527),
    ppc = 2.44,
    # Todos os nascidos vivos (SINASC), por UF (de residencia) e ano, alinhados a `anos`.
    nascidos_vivos_uf = setNames(lapply(ufs$cod, function(u) nv_uf[uf == u][order(ano)]$nv), ufs$sigla),
    # Nascidos vivos em estabelecimentos publicos, 2011-2022, por regiao (Apendice do artigo).
    nascidos_vivos_regiao = list("Centro-Oeste" = 1164323, "Nordeste" = 5244313, "Norte" = 2284373,
                                 "Sudeste" = 4341985, "Sul" = 910109),
    idh_regiao = list("Centro-Oeste" = 0.757, "Nordeste" = 0.663, "Norte" = 0.667, "Sudeste" = 0.766, "Sul" = 0.754)
  ),
  anos = anos,
  ufs = ufs,
  vias = vias,
  cids = cid_info,
  cols = cols,
  parto = para_linhas(parto_c, vias$id),
  neonatal = para_linhas(neo_c, cid_info$cod)
)
# indice de ano e UF nos arrays e relativo (ano - min(ano); uf = posicao em `ufs`)

write_json(json, out, auto_unbox = TRUE, digits = NA, dataframe = "rows")
cat(sprintf("Gravado %s (%.0f KB) | parto: %d linhas | neonatal: %d linhas\n", out, file.size(out) / 1024,
            nrow(parto_c), nrow(neo_c)))
