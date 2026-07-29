// Resumo curado da metodologia de cada indicador, sintetizado a partir do
// rascunho da equipe em detalhamento_indicadores.md (raiz do repo — ver
// [[project_detalhamento_indicadores]] na memória do projeto). Ao contrário
// do .md fonte (que tem filtros técnicos, contagens e tabelas de conferência
// para uso interno da equipe), este arquivo é o texto voltado ao público
// exibido na aba Metodologia.
export type IndicadorMetodologia = {
  titulo: string;
  resumo: string;
  fonte: string;
  filtros?: string;
  calculo: string;
};

export const METODOLOGIA_INDICADORES: IndicadorMetodologia[] = [
  {
    titulo: "Taxa de cobertura neonatal ambulatorial",
    resumo:
      "Mede o acesso das crianças aos exames de triagem neonatal (teste do pezinho, da orelhinha e do coraçãozinho) logo após o nascimento — indicador de acesso à atenção básica no início da vida.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (atendimentos ambulatoriais registrados no SUS).",
    filtros: "Apenas os procedimentos de triagem neonatal (teste do pezinho, da orelhinha e do coraçãozinho).",
    calculo: "Número de atendimentos de triagem neonatal dividido pelo número de nascidos vivos, no mesmo período e local.",
  },
  {
    titulo: "Proporção de puérperas que tiveram consultas no puerpério",
    resumo:
      "Mede o acompanhamento da mulher após o parto, essencial para identificar complicações no pós-parto.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (consultas puerperais registradas no SUS).",
    filtros: "Apenas o procedimento de consulta puerperal.",
    calculo: "Número de consultas puerperais dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Proporção de gestantes que realizaram exames para toxoplasmose",
    resumo:
      "Mede a cobertura do rastreio de toxoplasmose na gestação, infecção que pode causar complicações graves ao feto quando não tratada.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (exames realizados durante a gestação).",
    filtros: "Exames de anticorpos para toxoplasmose realizados no período gestacional.",
    calculo: "Número de gestantes com ao menos um exame de toxoplasmose dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Proporção de gestantes que realizaram sorologia para hepatite B",
    resumo:
      "Mede a cobertura do rastreio de hepatite B na gestação, importante para prevenir a transmissão da mãe para o bebê.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (exames sorológicos realizados durante a gestação).",
    filtros: "Exames sorológicos e moleculares para hepatite B realizados no período gestacional.",
    calculo: "Número de gestantes com ao menos um exame para hepatite B dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Proporção de gestantes que realizaram sorologia para sífilis",
    resumo:
      "Mede a cobertura do rastreio de sífilis na gestação — condição evitável e tratável cuja detecção tardia pode levar à sífilis congênita no bebê.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (testes realizados durante a gestação).",
    filtros: "Testes treponêmicos e não treponêmicos para sífilis realizados no período gestacional.",
    calculo: "Número de gestantes com ao menos um teste para sífilis dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Proporção de gestantes que realizaram teste anti-HIV",
    resumo:
      "Mede a cobertura da testagem para HIV na gestação, fundamental para prevenir a transmissão da mãe para o bebê.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (testes realizados durante a gestação).",
    filtros: "Testes laboratoriais e rápidos para detecção de HIV realizados no período gestacional.",
    calculo: "Número de gestantes com ao menos um teste anti-HIV dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Proporção de gestantes que realizaram tipagem sanguínea RH",
    resumo:
      "Mede a cobertura da tipagem do fator Rh na gestação, exame que identifica risco de incompatibilidade sanguínea entre mãe e feto.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (exames realizados durante a gestação).",
    filtros: "Exame de fenotipagem do sistema Rh realizado no período gestacional.",
    calculo: "Número de gestantes com tipagem Rh registrada dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Média de idade gestacional do primeiro VDRL",
    resumo:
      "Mostra em que momento da gestação o exame de sífilis costuma ser feito pela primeira vez — quanto mais cedo, maior a chance de tratamento a tempo de evitar a transmissão ao bebê.",
    fonte: "SINASC (nascidos vivos) e SIH/SIASUS (exames de VDRL realizados durante a gestação).",
    filtros: "Primeiro exame de VDRL (teste não treponêmico para sífilis) registrado na gestação.",
    calculo: "Média da idade gestacional, em semanas, no momento do primeiro exame de VDRL de cada gestante.",
  },
  {
    titulo: "Coeficiente de infecções sistêmicas neonatais",
    resumo:
      "Mede internações de recém-nascidos nos primeiros dias de vida por infecções sistêmicas (sepse, pneumonia congênita e outras), condições associadas a falhas na assistência ao pré-natal, ao parto e ao cuidado imediato ao bebê.",
    fonte: "SIH-SUS (internações hospitalares) e SINASC (nascidos vivos).",
    filtros: "Internações de recém-nascidos com até 3 dias de vida cuja causa principal é uma infecção sistêmica neonatal.",
    calculo: "Número de internações por infecção sistêmica neonatal dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Taxa de unidades com adequação de infraestrutura",
    resumo:
      "Como os dados públicos do SUS não permitem avaliar a real adequação da infraestrutura hospitalar, este indicador apenas mapeia se os estabelecimentos possuem determinado tipo de leito — reaproveitando os mesmos dados da Taxa de leitos neonatais.",
    fonte: "SINASC (nascidos vivos) e CNES (leitos hospitalares cadastrados).",
    filtros: "Leitos classificados como neonatologia, UTI neonatal ou unidade intermediária neonatal.",
    calculo: "Idêntico ao cálculo da Taxa de leitos neonatais.",
  },
  {
    titulo: "Coeficiente de mortalidade neonatal",
    resumo:
      "Mede óbitos de recém-nascidos até 27 dias de vida em relação ao total de nascidos vivos — um dos principais indicadores de qualidade da assistência ao parto e ao recém-nascido.",
    fonte: "SIM (óbitos) e SINASC (nascidos vivos).",
    filtros: "Óbitos ocorridos até o 27º dia de vida.",
    calculo: "Número de óbitos neonatais dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Proporção de transmissão vertical de HIV",
    resumo:
      "Mede crianças infectadas pelo HIV por transmissão da mãe durante a gestação, o parto ou a amamentação — um desfecho evitável quando a gestante é diagnosticada e tratada a tempo.",
    fonte: "SINAN (casos de HIV/AIDS notificados) e SINASC (nascidos vivos).",
    filtros: "Casos notificados com transmissão vertical identificada como via de infecção.",
    calculo: "Número de casos de transmissão vertical de HIV dividido pelo número de nascidos vivos.",
  },
  {
    titulo: "Razão de desfecho materno grave",
    resumo:
      "Mede internações por condições que quase levaram a mulher à morte durante a gestação, o parto ou o puerpério (near miss materno) — sinaliza falhas graves na assistência obstétrica antes que cheguem a óbito.",
    fonte: "SIH-SUS (internações hospitalares) e SINASC (nascidos vivos).",
    filtros: "Internações classificadas como near miss materno segundo critérios clínicos e de procedimento da literatura de referência.",
    calculo: "Número de internações por near miss materno dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Coeficiente de mortalidade perinatal",
    resumo:
      "Combina óbitos fetais tardios e óbitos neonatais precoces — o período em que a qualidade da assistência ao parto tem maior impacto sobre a sobrevida do bebê.",
    fonte: "SIM (óbitos fetais e neonatais) e SINASC (nascimentos).",
    filtros: "Óbitos fetais com 22 ou mais semanas de gestação e óbitos neonatais com até 7 dias de vida.",
    calculo:
      "Soma dos óbitos fetais (22+ semanas) com os óbitos neonatais precoces (até 7 dias), dividida pelo total de nascimentos (nascidos vivos + óbitos fetais de 22+ semanas), ×1.000.",
  },
  {
    titulo: "Taxa de cobertura do SISAB",
    resumo:
      "Mede a proporção de gestantes que iniciaram o pré-natal pela atenção básica, refletindo o alcance do acompanhamento pré-natal público.",
    fonte: "SISAB (registros da atenção básica) e SINASC/SIM (nascimentos totais).",
    filtros: "Primeiro atendimento de pré-natal registrado no SISAB.",
    calculo: "Número de gestantes com primeiro atendimento de pré-natal no SISAB dividido pelo total de nascimentos (vivos e mortos), ×100.",
  },
  {
    titulo: "Proporção de óbitos por asfixia perinatal",
    resumo:
      "Mede óbitos fetais e neonatais por falta de oxigenação ao redor do parto — uma das principais causas evitáveis de mortalidade perinatal, associada a falhas na atenção ao trabalho de parto.",
    fonte: "SIM (óbitos fetais e neonatais) e SINASC (nascimentos).",
    filtros: "Óbitos com causa básica classificada como asfixia ao nascer.",
    calculo: "Número de óbitos por asfixia perinatal dividido pelo total de nascimentos (nascidos vivos + óbitos fetais de 22+ semanas), ×100.",
  },
  {
    titulo: "Proporção de neonatos vacinados",
    resumo:
      "Mede a cobertura vacinal de BCG e hepatite B em recém-nascidos, as primeiras vacinas do calendário nacional.",
    fonte: "PNI (doses de vacina aplicadas) e SINASC (nascidos vivos).",
    filtros: "Doses de BCG e de hepatite B aplicadas em recém-nascidos, conforme o esquema vacinal vigente em cada período.",
    calculo: "Número de doses aplicadas dividido pelo número de nascidos vivos, ×100 — calculado separadamente para cada vacina.",
  },
  {
    titulo: "Coeficiente de óbitos neonatais conforme causa",
    resumo:
      "Classifica os óbitos neonatais em evitáveis (por atenção à gestação, ao parto, ao recém-nascido, imunoprevenção ou promoção da saúde), não evitáveis e mal definidos — ajuda a priorizar onde investir para reduzir mortes.",
    fonte: "SIM (óbitos neonatais, classificados por causa) e SINASC (nascidos vivos).",
    filtros: "Causas de óbito agrupadas conforme a lista oficial de causas evitáveis do Ministério da Saúde.",
    calculo: "Número de óbitos neonatais em cada categoria de evitabilidade dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Coeficiente de óbitos de recém-nascidos nas primeiras 24 horas de vida",
    resumo:
      "Mede óbitos muito precoces, ocorridos já no primeiro dia de vida — o período mais sensível à qualidade da assistência ao parto e ao cuidado imediato ao recém-nascido.",
    fonte: "SIM (óbitos) e SINASC (nascidos vivos).",
    filtros: "Óbitos ocorridos até 1 dia após o nascimento.",
    calculo: "Número de óbitos nas primeiras 24 horas dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Proporção de óbitos maternos evitáveis",
    resumo:
      "Mede quantos óbitos maternos poderiam ter sido evitados com prevenção, diagnóstico e tratamento adequados durante a gestação, o parto e o puerpério.",
    fonte: "SIM (óbitos maternos, classificados por causa).",
    filtros: "Óbitos de mulheres com causa relacionada à gestação, ao parto ou ao puerpério.",
    calculo: "Número de óbitos maternos evitáveis dividido pelo total de óbitos maternos, ×100.",
  },
  {
    titulo: "Proporção de óbitos maternos por local de óbito",
    resumo:
      "Mostra onde as mortes maternas ocorrem — hospital, domicílio ou outros serviços — informação importante para direcionar investimentos em infraestrutura de saúde.",
    fonte: "SIM (óbitos maternos).",
    filtros: "Óbitos de mulheres com causa relacionada à gestação, ao parto ou ao puerpério.",
    calculo: "Número de óbitos maternos em cada local dividido pelo total de óbitos maternos, ×100.",
  },
  {
    titulo: "Proporção de óbitos maternos por período do óbito",
    resumo:
      "Mostra em que momento do ciclo gravídico-puerperal — gestação, parto ou puerpério — se concentram as mortes maternas, ajudando a identificar a fase mais crítica da assistência.",
    fonte: "SIM (óbitos maternos).",
    filtros: "Óbitos de mulheres com período do óbito informado (disponível a partir de 2009).",
    calculo: "Número de óbitos maternos em cada período dividido pelo total de óbitos maternos com período informado, ×100.",
  },
  {
    titulo: "Razão de mortalidade materna",
    resumo:
      "Um dos indicadores mais usados internacionalmente para avaliar a qualidade da assistência à saúde da mulher — mede óbitos maternos em relação aos nascidos vivos.",
    fonte: "SIM (óbitos maternos) e SINASC (nascidos vivos).",
    filtros: "Óbitos de mulheres com causa relacionada à gestação, ao parto ou ao puerpério.",
    calculo: "Número de óbitos maternos dividido pelo número de nascidos vivos, ×100.000.",
  },
  {
    titulo: "Densidade de Unidades Básicas de Saúde",
    resumo:
      "Mede a disponibilidade de Unidades Básicas de Saúde (UBS) em relação à população — estrutura de porta de entrada do pré-natal e do cuidado materno-infantil na atenção básica.",
    fonte: "IBGE (população) e CNES (estabelecimentos de saúde cadastrados).",
    filtros: "Estabelecimentos do tipo Centro de Saúde/Unidade Básica.",
    calculo: "Número de UBS dividido pela população, no mesmo período e local.",
  },
  {
    titulo: "Taxa de enfermeiros obstétricos",
    resumo:
      "Mede a disponibilidade de enfermeiros obstétricos no SUS por habitante — profissionais que ampliam o acesso a um parto seguro e humanizado, especialmente em gestações de baixo risco.",
    fonte: "IBGE (população) e CNES (profissionais cadastrados).",
    filtros: "Profissionais com registro de enfermeiro obstétrico (CBO específico).",
    calculo: "Número de enfermeiros obstétricos dividido pela população, ×10.000 habitantes.",
  },
  {
    titulo: "Proporção de instituições com existência de alojamento conjunto",
    resumo:
      "Mede quantas maternidades oferecem alojamento conjunto — mãe e bebê no mesmo ambiente após o parto —, prática que favorece o vínculo afetivo e o aleitamento materno.",
    fonte: "SINASC (estabelecimentos com nascidos vivos) e CNES (leitos de alojamento conjunto cadastrados).",
    filtros: "Leitos cadastrados como alojamento conjunto.",
    calculo: "Média mensal de instituições com alojamento conjunto dividida pelo total de instituições com nascimentos no mesmo período e local, ×100.",
  },
  {
    titulo: "Número de leitos de UTI adulto necessários para a atenção materna",
    resumo:
      "Estima quantos leitos de UTI adulto seriam necessários para atender gestantes e puérperas em complicações graves, com base no parâmetro da Rede Cegonha de que os leitos de UTI adulto devem corresponder a cerca de 6% dos leitos obstétricos.",
    fonte: "IBGE (população, usada para estimar os leitos obstétricos necessários).",
    calculo: "Número de leitos obstétricos estimados (0,28 por 1.000 habitantes dependentes do SUS) multiplicado por 6%.",
  },
  {
    titulo: "Taxa de leitos obstétricos",
    resumo:
      "Mede a disponibilidade de leitos hospitalares destinados ao parto em relação à população, indicando se a estrutura acompanha a demanda.",
    fonte: "IBGE (população) e CNES (leitos obstétricos cadastrados).",
    filtros: "Leitos de obstetrícia cirúrgica e obstetrícia clínica.",
    calculo: "Média mensal de leitos obstétricos dividida pela população no mesmo período, ×1.000 habitantes.",
  },
  {
    titulo: "Taxa de leitos neonatais",
    resumo:
      "Mede a disponibilidade de leitos destinados ao cuidado do recém-nascido — neonatologia, UTI e unidade intermediária neonatal — em relação aos nascidos vivos.",
    fonte: "SINASC (nascidos vivos) e CNES (leitos neonatais cadastrados).",
    filtros: "Leitos de neonatologia, UTI neonatal e unidades de cuidados intermediários neonatais.",
    calculo: "Média mensal de leitos neonatais dividida pelo número de nascidos vivos no mesmo período e local.",
  },
  {
    titulo: "Incidência de tétano neonatal positivo",
    resumo:
      "Mede casos confirmados de tétano neonatal — doença hoje rara no Brasil graças à vacinação e aos cuidados de assepsia no parto — cuja ocorrência sinaliza falhas graves de cobertura vacinal ou de cuidado ao coto umbilical.",
    fonte: "SINAN (casos notificados) e SINASC (nascidos vivos).",
    filtros: "Apenas casos confirmados de tétano.",
    calculo: "Número de casos confirmados de tétano neonatal dividido pelo número de nascidos vivos.",
  },
  {
    titulo: "Taxa de incidência de sífilis congênita em neonatos",
    resumo:
      "Mede casos novos de sífilis congênita — infecção evitável quando a sífilis materna é detectada e tratada durante o pré-natal — em relação aos nascidos vivos.",
    fonte: "SINAN (casos notificados) e SINASC (nascidos vivos).",
    filtros: "Casos confirmados de sífilis congênita em recém-nascidos.",
    calculo: "Número de casos de sífilis congênita dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Taxa de HIV positivo em gestantes",
    resumo:
      "Mede a proporção de gestantes diagnosticadas com HIV, indicador epidemiológico usado para dimensionar a necessidade de acompanhamento especializado durante o pré-natal.",
    fonte: "SINAN (casos notificados) e SINASC (nascidos vivos).",
    filtros: "Casos de HIV notificados em gestantes.",
    calculo: "Número de gestantes com HIV dividido pelo número de nascidos vivos, ×1.000.",
  },
  {
    titulo: "Taxa de detecção de sífilis em gestantes",
    resumo:
      "Mede a proporção de gestantes diagnosticadas com sífilis, refletindo tanto a magnitude real da doença quanto a efetividade do rastreio no pré-natal.",
    fonte: "SINAN (casos notificados) e SINASC (nascidos vivos).",
    filtros: "Casos confirmados por teste treponêmico.",
    calculo: "Número de gestantes com sífilis confirmada dividido pelo número de nascidos vivos, ×100.",
  },
  {
    titulo: "Proporção de cesáreas",
    resumo:
      "Mede a proporção de partos realizados por cesárea. A OMS recomenda que fique entre 10% e 15%: acima disso sugere cesáreas sem indicação médica; abaixo, possível dificuldade de acesso a cesáreas necessárias.",
    fonte: "SINASC (nascidos vivos, com tipo de parto informado).",
    filtros: "Partos com via de parto (vaginal ou cesárea) informada.",
    calculo: "Número de partos cesáreos dividido pelo total de partos com via informada, ×100.",
  },
  {
    titulo: "Taxa bruta de natalidade",
    resumo:
      "Indicador demográfico clássico que mede a intensidade de nascimentos em uma população, refletindo fecundidade e outros fatores populacionais.",
    fonte: "SINASC (nascidos vivos) e IBGE (população).",
    calculo: "Número médio anual de nascidos vivos dividido pela população média do período, ×1.000 habitantes.",
  },
  {
    titulo: "Taxa de baixo peso ao nascer",
    resumo:
      "Mede a proporção de recém-nascidos com peso inferior a 2.500g, reconhecida pela OMS como reflexo das condições de saúde materno-infantil e socioeconômicas de uma população.",
    fonte: "SINASC (nascidos vivos, com peso ao nascer informado).",
    filtros: "Peso ao nascer inferior a 2.500 gramas.",
    calculo: "Número de nascidos vivos com baixo peso dividido pelo total de nascidos vivos com peso informado, ×100.",
  },
  {
    titulo: "Proporção de neonatos com adequado índice de Apgar no 1º e 5º minuto",
    resumo:
      "Mede a proporção de recém-nascidos em boas condições clínicas ao nascer, segundo a escala de Apgar (frequência cardíaca, respiração, tônus muscular, reflexos e cor).",
    fonte: "SINASC (nascidos vivos, com índice de Apgar informado).",
    filtros: "Apgar maior que 7 no 1º e no 5º minuto de vida.",
    calculo: "Número de nascidos vivos com Apgar adequado dividido pelo total de nascidos vivos com Apgar informado, ×100.",
  },
  {
    titulo: "Proporção de partos vaginais conforme o profissional que assistiu",
    resumo:
      "Mostra qual profissional — médico, enfermeiro obstetriz ou parteira — assistiu cada parto vaginal. A presença de enfermagem obstétrica está associada a menos intervenções desnecessárias e maior satisfação das mulheres com o cuidado recebido.",
    fonte: "SINASC (nascidos vivos por parto vaginal, com profissional informado a partir de 2013).",
    filtros: "Partos vaginais com a categoria do profissional responsável informada.",
    calculo: "Número de partos vaginais assistidos por cada categoria profissional dividido pelo total de partos vaginais com profissional informado, ×100.",
  },
  {
    titulo: "Taxa de óbitos fetais",
    resumo:
      "Mede fetos que morreram antes ou durante o parto a partir da 22ª semana de gestação — reflete a qualidade do pré-natal, da assistência ao parto e desigualdades socioeconômicas.",
    fonte: "SIM (óbitos fetais) e SINASC (nascimentos).",
    filtros: "Óbitos fetais a partir da 22ª semana de gestação (ou peso ≥ 500g / comprimento ≥ 25cm).",
    calculo: "Número de óbitos fetais dividido pelo total de nascimentos (nascidos vivos + óbitos fetais), ×1.000.",
  },
  {
    titulo: "Proporção de tipo de parto por grupo de Robson",
    resumo:
      "Classifica os partos em 10 grupos da Classificação de Robson — conforme paridade, idade gestacional, tipo de gestação e histórico de cesárea —, permitindo identificar em quais perfis de gestantes a cesárea é mais usada. É a ferramenta padrão internacional para monitorar e reduzir cesáreas desnecessárias.",
    fonte: "SINASC (nascidos vivos, classificados conforme os critérios de cada grupo de Robson).",
    calculo: "Distribuição percentual de partos vaginais e cesáreos dentro de cada um dos 10 grupos de Robson.",
  },
  {
    titulo: "Proporção de gestantes com o pré-natal adequado",
    resumo:
      "Avalia a qualidade do pré-natal considerando não só o número mínimo de consultas, mas também o início precoce do acompanhamento — indicador ligado à redução da mortalidade materna e neonatal.",
    fonte: "SINASC (nascidos vivos, com número de consultas e início do pré-natal informados).",
    filtros: "Número mínimo de consultas recomendado pela OMS e início do pré-natal até o primeiro trimestre.",
    calculo: "Número de gestantes com pré-natal adequado (consultas mínimas + início precoce) dividido pelo total de nascidos vivos, ×100.",
  },
];
