#!/usr/bin/env Rscript
# Reproduz a metodologia do artigo "Healthcare Costs and Main Characteristics of
# Childbirth and Neonatal Inpatient Care From the Brazilian Public Health System
# Perspective" (Value Health Reg Issues 2025;50:101161) a partir dos arquivos
# reduzidos do SIH/SUS (RD*.dbc), 2011-2022.
#
# Repositorio de origem dos scripts do artigo:
#   https://github.com/raffinJ/childbirth_neonatal_healthcare_costs_article
#
# Em vez de exportar um CSV gigante (dados_sih.csv) e analisar depois, este
# script ja agrega cada arquivo UF/mes num "cubo" pequeno (ano x UF x categoria
# x UTI) com somas de custos/dias/obitos, que alimenta a aba "Custos hospitalares".
#
# Uso:
#   Rscript scripts/custos_sihsus.R [pasta_dados_sih] [pasta_saida]
# Padrao: pasta_dados_sih = "/Volumes/HD JULIA/TabWin/SIH/Dados" ; saida = data/custos
#
# Recortes (iguais ao artigo):
#   PARTO    : PROC_REA em {0310010039, 0310010047, 0310010055,
#              0411010026, 0411010034, 0411010042}
#   NEONATAL : idade 0-27 dias (COD_IDADE 0/1 = minutos/horas; 2 = dias <= 27)
#              (exclui os registros de parto)
# Custos: VAL_TOT = servicos hospitalares + profissionais + UTI (valor total da AIH);
#   corrigidos pelo IPCA para dez/2023 e convertidos em Int$ pela PPC 2,44.

suppressMessages({
  library(read.dbc)
  library(data.table)
  library(parallel)
})

args <- commandArgs(trailingOnly = TRUE)
dir_sih <- if (length(args) >= 1) args[1] else "/Volumes/HD JULIA/TabWin/SIH/Dados"
dir_out <- if (length(args) >= 2) args[2] else "data/custos"
dir.create(dir_out, showWarnings = FALSE, recursive = TRUE)
n_cores <- max(1, detectCores() - 2)

PROC_PARTO <- c(
  "0310010039" = "normal",                # PARTO NORMAL
  "0310010047" = "normal_alto_risco",     # PARTO NORMAL EM GESTACAO DE ALTO RISCO
  "0310010055" = "normal_cpn",            # PARTO NORMAL EM CENTRO DE PARTO NORMAL
  "0411010034" = "cesarea",               # PARTO CESARIANO
  "0411010026" = "cesarea_alto_risco",    # PARTO CESARIANO EM GESTACAO DE ALTO RISCO
  "0411010042" = "cesarea_laqueadura"     # PARTO CESARIANO C/ LAQUEADURA TUBARIA
)

# IPCA (BCB) - fator de correcao de cada ano para dez/2023 (mesmos do artigo)
IPCA <- c("2011" = 1.9999, "2012" = 1.8950, "2013" = 1.7916, "2014" = 1.6814,
          "2015" = 1.5219, "2016" = 1.4225, "2017" = 1.3837, "2018" = 1.3299,
          "2019" = 1.2878, "2020" = 1.2345, "2021" = 1.1148, "2022" = 1.0527)
PPC <- 2.44

COLS <- c("ANO_CMPT", "PROC_REA", "DIAG_PRINC", "IDADE", "COD_IDADE", "MARCA_UTI",
          "VAL_SH", "VAL_SP", "VAL_TOT", "VAL_UTI", "MORTE", "MUNIC_MOV",
          "DIAS_PERM", "UTI_MES_TO")

as_num <- function(x) as.numeric(as.character(x))

agregar <- function(d, chaves) {
  d[, .(n = .N,
        n_obito = sum(obito),
        # `uti` e chave do agrupamento (tamanho 1 dentro de j): n_uti = n quando uti == 1
        n_uti = if (uti[1L] == 1L) .N else 0L,
        val_tot = sum(val_tot), val_tot2 = sum(val_tot^2),
        val_sh = sum(val_sh), val_sp = sum(val_sp),
        val_uti = sum(val_uti), val_uti2 = sum(val_uti^2),
        dias = sum(dias), dias2 = sum(dias^2),
        dias_uti = sum(dias_uti), dias_uti2 = sum(dias_uti^2)),
    by = chaves]
}

processar_arquivo <- function(f) {
  d <- as.data.table(read.dbc(f))
  d <- d[, ..COLS]
  for (c in names(d)) if (is.factor(d[[c]])) d[[c]] <- as.character(d[[c]])
  cod_idade <- d$COD_IDADE
  idade <- as_num(d$IDADE)
  e_parto <- d$PROC_REA %in% names(PROC_PARTO)
  e_neo <- !e_parto & (cod_idade %in% c("0", "1") | (cod_idade == "2" & idade <= 27))
  d <- d[e_parto | e_neo]
  if (nrow(d) == 0) return(NULL)
  e_parto <- d$PROC_REA %in% names(PROC_PARTO)
  d[, `:=`(
    ano = as.integer(ANO_CMPT),
    uf = as.integer(substr(MUNIC_MOV, 1, 2)),
    tipo = ifelse(e_parto, "parto", "neonatal"),
    via = ifelse(e_parto, PROC_PARTO[PROC_REA], NA_character_),
    cid = ifelse(e_parto, NA_character_, DIAG_PRINC),
    uti = as.integer(MARCA_UTI != "00"),
    obito = as.integer(MORTE == "1"),
    val_tot = as_num(VAL_TOT), val_sh = as_num(VAL_SH),
    val_sp = as_num(VAL_SP), val_uti = as_num(VAL_UTI),
    dias = as_num(DIAS_PERM), dias_uti = as_num(UTI_MES_TO)
  )]
  d[is.na(dias_uti), dias_uti := 0]
  # Custo de UTI = VAL_UTI apenas das AIHs com uso de UTI (MARCA_UTI != "00"),
  # como no artigo; AIHs sem UTI com VAL_UTI > 0 (~R$ 86 mi no periodo) ficam so no VAL_TOT.
  d[uti == 0, val_uti := 0]
  # custos nominais (R$ da epoca) agregados; a correcao e feita depois, por ano
  # (todos os registros de um arquivo tem o mesmo ANO_CMPT)
  list(
    parto = agregar(d[tipo == "parto"], c("ano", "uf", "via", "uti")),
    neo = agregar(d[tipo == "neonatal"], c("ano", "uf", "cid", "uti"))
  )
}

arquivos <- list.files(dir_sih, pattern = "^RD.*\\.dbc$", recursive = TRUE,
                       full.names = TRUE, ignore.case = TRUE)
cat(sprintf("%d arquivos .dbc em %s | %d nucleos\n", length(arquivos), dir_sih, n_cores))

t0 <- Sys.time()
res <- mclapply(arquivos, function(f) {
  tryCatch(processar_arquivo(f), error = function(e) {
    structure(list(erro = conditionMessage(e), arquivo = f), class = "falha")
  })
}, mc.cores = n_cores, mc.preschedule = FALSE)
falhas <- Filter(function(x) inherits(x, "falha"), res)
if (length(falhas) > 0) {
  for (x in falhas) cat("FALHA:", x$arquivo, "-", x$erro, "\n")
  stop("Arquivos com erro - corrija antes de continuar")
}
cat("Leitura concluida em", format(round(difftime(Sys.time(), t0, units = "mins"), 1)), "\n")

combinar <- function(campo, chaves) {
  x <- rbindlist(lapply(res, function(r) r[[campo]]))
  x[, lapply(.SD, sum), by = chaves]
}
parto <- combinar("parto", c("ano", "uf", "via", "uti"))
neo <- combinar("neo", c("ano", "uf", "cid", "uti"))

# --- correcao monetaria (IPCA dez/2023) ---------------------------------------
# Somas de R$ multiplicam pelo fator; somas de quadrados pelo fator^2.
corrige <- function(x) {
  f <- IPCA[as.character(x$ano)]
  # nominal: mantem so total e UTI (suficiente para transparencia)
  for (v in c("val_tot", "val_uti")) x[[paste0(v, "_nom")]] <- x[[v]]
  for (v in c("val_tot", "val_sh", "val_sp", "val_uti")) x[[v]] <- x[[v]] * f
  for (v in c("val_tot2", "val_uti2")) x[[v]] <- x[[v]] * f^2
  x
}
parto <- corrige(parto)
neo <- corrige(neo)

stopifnot(sum(parto$n_uti) == sum(parto[uti == 1]$n), sum(neo$n_uti) == sum(neo[uti == 1]$n))

setorder(parto, ano, uf, via, uti)
setorder(neo, ano, uf, cid, uti)

fwrite(parto, file.path(dir_out, "cubo_parto.csv"))
fwrite(neo, file.path(dir_out, "cubo_neonatal_cid_completo.csv"))

# --- validacao contra o artigo -------------------------------------------------
cat("\n=== VALIDACAO (valores do artigo entre parenteses) ===\n")
cat(sprintf("Partos (n)            : %s  (23.135.767)\n", format(sum(parto$n), big.mark = ",")))
cat(sprintf("  vaginais            : %s  (13.165.422)\n",
            format(sum(parto[via %in% c("normal", "normal_alto_risco", "normal_cpn")]$n), big.mark = ",")))
cat(sprintf("  com UTI             : %s  (89.248)\n", format(sum(parto[uti == 1]$n), big.mark = ",")))
cat(sprintf("Neonatal (n)          : %s  (3.835.128)\n", format(sum(neo$n), big.mark = ",")))
cat(sprintf("  com UTI             : %.1f%%  (28,4%%)\n", 100 * sum(neo[uti == 1]$n) / sum(neo$n)))
cat(sprintf("Custo parto (R$ bi)   : %.3f  (22,895)\n", sum(parto$val_tot) / 1e9))
cat(sprintf("Custo neonatal (R$ bi): %.3f  (14,689)\n", sum(neo$val_tot) / 1e9))
cat(sprintf("Custo UTI parto (R$ mi)    : %.1f  (174,0)\n", sum(parto$val_uti) / 1e6))
cat(sprintf("Custo UTI neonatal (R$ bi) : %.3f  (9,571)\n", sum(neo$val_uti) / 1e9))
cat(sprintf("Custo UTI neonatal medio   : %.0f  (8.799)\n", sum(neo$val_uti) / sum(neo[uti == 1]$n)))
cat(sprintf("Obitos parto /100 mil : %.1f  (29,7)\n", 1e5 * sum(parto$n_obito) / sum(parto$n)))
cat(sprintf("Obitos neonatal /1000 : %.1f  (43,2)\n", 1e3 * sum(neo$n_obito) / sum(neo$n)))
cat("\nPartos por ano:\n"); print(parto[, .(n = sum(n)), ano]$n)
cat("Neonatal por ano:\n"); print(neo[, .(n = sum(n)), ano]$n)
cat("\nTop 20 CIDs por custo (artigo: P073 P220 P229 P228 P072 P285 A419 P071 P599 P221 P050 P210 P219 P289 P369 P200 P070 P399 P051 A499):\n")
print(neo[, .(custo = sum(val_tot), n = sum(n)), cid][order(-custo)][1:20])
