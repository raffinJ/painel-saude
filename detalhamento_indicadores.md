# Taxa de cobertura neonatal ambulatorial

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes à triagem neonatal ambulatorial
Filtros:
	Procedimentos filtrados:
	02.01.02.005-0 - COLETA DE SANGUE PARA TRIAGEM NEONATAL
	02.11.07.014-9 - EMISSÕES OTOACÚSTICAS EVOCADAS PARA TRIAGEM AUDITIVA (TESTE DA ORELHINHA)
	02.11.07.027-0 - POTENCIAL EVOCADO AUDITIVO PARA TRIAGEM AUDITIVA (TESTE DA ORELHINHA)
	02.11.07.027-0 - POTENCIAL EVOCADO AUDITIVO PARA TRIAGEM AUDITIVA (TESTE DA ORELHINHA)
	02.11.07.042-4 - EMISSÕES OTOACÚSTICAS EVOCADAS PARA TRIAGEM AUDITIVA (TESTE DA ORELHINHA/RETESTE)
	02.11.07.043-2 - POTENCIAL EVOCADO AUDITIVO P/ TRIAGEM AUDITIVA (TESTE DA ORELHINHA/RETESTE)
	02.11.02.007-9 - OXIMETRIA DE PULSO (TESTE DO CORAÇÃOZINHO
	02.02.11.006-0 - DOSAGEM DE FENILALANINA TSH OU T4 E DETECÇÃO DA VARIANTE DE HEMOGLOBINA (COMPONENTE DO TESTE DO PEZINHO)
	02.02.11.007-9 - DOSAGEM DE TRIPSINA IMUNORREATIVA (COMPONENTE DO TESTE DO PEZINHO)
	02.02.11.009-5 - DOSAGEM DE 17 HIDROXI PROGESTERONA EM PAPEL DE FILTRO (COMPONENTE DO TESTE DO PEZINHO)
	02.02.11.010-9 - DOSAGEM DA ATIVIDADE DA BIOTINIDASE EM AMOSTRAS DE SANGUE EM PAPEL DE FILTRO (COMPONENTE DO TESTE DO PEZINHO)
	02.02.11.015-0 - PESQUISA DE IGM ANTI-TOXOPLASMA GONDII EM SANGUE SECO (COMPONENTE DO TESTE DO PEZINHO)

Período: 2008 e 2024
Região: município de residência

===========================================================

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes

|    | Origem   |   quantidade |    share |
|---:|:---------|-------------:|---------:|
|  0 | BPA-C    |      4271176 | 20.2721  |
|  1 | BPA-I    |     16287544 | 77.3048  |
|  2 | AIH      |       510543 |  2.42316 |

20,27% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público


# Proporção de puérperas que tiveram consultas no puerpério

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes a consulta no puerpério
Filtros:
	Procedimentos filtrados:
	03.01.01.012-9 - CONSULTA PUERPERAL

Período: 2008 e 2024
Região: município de residência

===========================================================

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes

|    | Origem   |   quantidade |     share |
|---:|:---------|-------------:|----------:|
|  0 | BPA-C    |     42125342 | 99.702    |
|  1 | BPA-I    |       125925 |  0.298038 |

99,7% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de uma consulta
- Foram mapeados apenas os consultas realizadas no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público

# Propção de gestantes que realizaram exames para toxoplasmose

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes à toxoplasmose
Filtros:
- Apenas exames que ocorreram entre o período gestacional (data de nascimento - semanas gestacionais informadas)
	Procedimentos filtrados:
	02.02.03.076-8 - PESQUISA DE ANTICORPOS IGG ANTITOXOPLASMA;
	02.02.03.087-3 - PESQUISA DE ANTICORPOS IGM ANTITOXOPLASMA e
	02.13.01.057-7 - TESTE DE ELISA IGG P/ IDENTIFICACAO DO TOXOPLASMA GONDII (TOXOPLASMOSE)

Período: 2008 e 2024
Região: município de residência

===========================================================
Existem três tipos de dados

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes
- RL consolidado: contabilização a quantidade de nascimento
- RL detalhado: contabilização de pacientes por tipo de tratamento

|    | Origem   |   quantidade |     share |
|---:|:---------|-------------:|----------:|
|  0 | BPA-C    |     93706041 | 96.6322   |
|  1 | BPA-I    |      2447220 |  2.52364  |
|  2 | AIH      |       818570 |  0.844132 |

96,6% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

Registros relacionados através do record linkage: 

|    | Origem   |   quantidade | link(%) |
|---:|:---------|-------------:|--------:|
|  0 | BPA-I    |      1275880 | 52.13   |
|  1 | AIH      |       771770 | 94.30   |

===========================================================
Na base consolidada existe um campo chamado "existe", esse campo foi criado pela seguinte lógica:
- nos locais onde existe uma gestante com o mesmo município de residência e a mesma idade marcou o campo como 1
- caso contrário marcou-se o campo como 0.

Ou seja, locais que apresentam o campo "existe = 0", indicam que não havia nenhuma gestante com aquela idade naquele município de residência

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- Pacientes que realizaram procedimentos em diferentes anos foram contabilizadas mais de uma vez.
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público
- No arquivos de record linkage não é aconselhável somar as informações do RL detalhado, pois uma mesma paciente pode fazer mais de um procedimento
- A idade gestacional nas bases de RL refletem o momento em que a paciente fez o atendimento e não o momento do nascimento, por exemplo, uma paciente que teve uma gestação de 38 semanas, pode ter realizado o exame com 10 semanas por exemplo. Na base será apresentado o valor de 10 e não de 38.

# Proporção de gestantes que realizaram sorologia para hepatite B

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes à hepatite B
Filtros:
- Apenas exames que ocorreram entre o período gestacional (data de nascimento - semanas gestacionais informadas)
	Procedimentos filtrados:
	02.02.03.063-6 - PESQUISA DE ANTICORPOS CONTRA ANTIGENO DE SUPERFICIE DO VIRUS DA HEPATITE B (ANTI-HBS)
	02.02.03.064-4 - PESQUISA DE ANTICORPOS CONTRA ANTIGENO E DO VIRUS DA HEPATITE B (ANTI-HBE)
	02.02.03.078-4 - PESQUISA DE ANTICORPOS IGG E IGM CONTRA ANTIGENO CENTRAL DO VIRUS DA HEPATITE B (ANTI-HBC-TOTAL)
	02.02.03.089-0 - PESQUISA DE ANTICORPOS IGM CONTRA ANTIGENO CENTRAL DO VIRUS DA HEPATITE B (ANTI-HBC-IGM)
	02.02.03.097-0 - PESQUISA DE ANTIGENO DE SUPERFICIE DO VIRUS DA HEPATITE B (HBSAG)
	02.02.03.098-9 - PESQUISA DE ANTIGENO E DO VIRUS DA HEPATITE B (HBEAG)
	02.13.01.013-5 - HISTOPATOLOGIA P/ IDENTIFICACAO DE HEPATITE B
	02.13.01.020-8 - IDENTIFICACAO DO VIRUS DA HEPATITE B POR PCR (QUANTITATIVO)
	02.13.01.035-6 - IMUNOHISTOQUIMICA P/ IDENTIFICACAO DO VIRUS DA HEPATITE

Período: 2008 e 2024
Região: município de residência

===========================================================
Existem três tipos de dados

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes
- RL consolidado: contabilização a quantidade de nascimento
- RL detalhado: contabilização de pacientes por tipo de tratamento

|    | Origem          |   quantidade |    share |
|---:|:----------------|-------------:|---------:|
|  0 | BPA-C           |    162047042 | 94.6676  |
|  1 | APAC Secundária |      3270518 |  1.91063 |
|  2 | BPA-I           |      3369630 |  1.96853 |
|  3 | AIH             |      2487568 |  1.45323 |

94,7% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

Registros relacionados através do record linkage: 

|    | Origem          |   quantidade | link(%) |
|---:|:----------------|-------------:|--------:|
|  0 | BPA-I           |      1789320 | 53.10   |
|  1 | APAC Secundária |      1836381 | 56.14   |
|  2 | AIH             |      2102575 | 84.50   |

===========================================================
Na base consolidada existe um campo chamado "existe", esse campo foi criado pela seguinte lógica:
- nos locais onde existe uma gestante com o mesmo município de residência e a mesma idade marcou o campo como 1
- caso contrário marcou-se o campo como 0.

Ou seja, locais que apresentam o campo "existe = 0", indicam que não havia nenhuma gestante com aquela idade naquele município de residência

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- Pacientes que realizaram procedimentos em diferentes anos foram contabilizadas mais de uma vez.
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público
- No arquivos de record linkage não é aconselhável somar as informações do RL detalhado, pois uma mesma paciente pode fazer mais de um procedimento
- A idade gestacional nas bases de RL refletem o momento em que a paciente fez o atendimento e não o momento do nascimento, por exemplo, uma paciente que teve uma gestação de 38 semanas, pode ter realizado o exame com 10 semanas por exemplo. Na base será apresentado o valor de 10 e não de 38.

# Proporção de gestantes que realizaram sorologia para sífilis

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes à sífilis
Filtros:
- Apenas exames que ocorreram entre o período gestacional (data de nascimento - semanas gestacionais informadas)
	Procedimentos filtrados:
	02.02.03.117-9 - TESTE NÃO TREPONEMICO P/ DETECÇÃO DE SIFILIS EM GESTANTES
	02.14.01.008-2 - TESTE RÁPIDO PARA SÍFILIS NA GESTANTE OU PAI/PARCEIRO
	02.02.03.139-0 - TESTE TREPONÊMICO LABORATORIAL P/ DETECÇÃO DE SÍFILIS EM GESTANTE
	02.02.03.142-0 - TESTE FTA-ABS TOTAL PARA DIAGNÓSTICO DA SÍFILIS EM GESTANTE
	02.14.01.025-2 - TESTE RÁPIDO TREPONÊMICO (SÍFILIS) EM GESTANTE

Período: 2008 e 2024
Região: município de residência

===========================================================
Existem três tipos de dados

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes
- RL consolidado: contabilização a quantidade de nascimento
- RL detalhado: contabilização de pacientes por tipo de tratamento

|    | Origem   |   quantidade |    share |
|---:|:---------|-------------:|---------:|
|  0 | BPA-C    |     33917906 | 49.2558  |
|  1 | BPA-I    |      6465297 |  9.38895 |
|  2 | AIH      |     28477496 | 41.3552  |

49,3% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

Registros relacionados através do record linkage: 

|    | Origem   |   quantidade | link(%) |
|---:|:---------|-------------:|--------:|
|  0 | BPA-I    |      3663556 | 56.6    |
|  1 | AIH      |     28463062 | 99.9    |

===========================================================
Na base consolidada existe um campo chamado "existe", esse campo foi criado pela seguinte lógica:
- nos locais onde existe uma gestante com o mesmo município de residência e a mesma idade marcou o campo como 1
- caso contrário marcou-se o campo como 0.

Ou seja, locais que apresentam o campo "existe = 0", indicam que não havia nenhuma gestante com aquela idade naquele município de residência

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- Pacientes que realizaram procedimentos em diferentes anos foram contabilizadas mais de uma vez.
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público
- No arquivos de record linkage não é aconselhável somar as informações do RL detalhado, pois uma mesma paciente pode fazer mais de um procedimento
- A idade gestacional nas bases de RL refletem o momento em que a paciente fez o atendimento e não o momento do nascimento, por exemplo, uma paciente que teve uma gestação de 38 semanas, pode ter realizado o exame com 10 semanas por exemplo. Na base será apresentado o valor de 10 e não de 38.

# Proporção de gestantes que realizaram teste anti-HIV

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes à tipagem sanguínea
Filtros:
- Apenas exames que ocorreram entre o período gestacional (data de nascimento - semanas gestacionais informadas)
	Procedimentos filtrados:
	02.02.03.151-9 - PESQUISA LABORATORIAL DE ANTÍGENOS DE HIV OU ANTICORPOS ANTI-HIV-1 OU ANTI-HIV-2 EM GESTANTE -- 08/2025 - Incluido
	02.14.01.027-9 - TESTE RÁPIDO PARA DETECÇÃO DE ANTICORPOS ANTI-HIV EM GESTANTE -- 08/2025 - Incluido
	02.14.01.004-0 - TESTE RAPIDO PARA DETECCAO DE HIV NA GESTANTE OU PAI/PARCEIRO

Período: 2008 e 2024
Região: município de residência

===========================================================
Existem três tipos de dados

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes
- RL consolidado: contabilização a quantidade de nascimento
- RL detalhado: contabilização de pacientes por tipo de tratamento

|    | Origem   |   quantidade |   share |
|---:|:---------|-------------:|--------:|
|  0 | BPA-C    |       346009 |   5.662 |
|  1 | BPA-I    |      5765064 |  94.338 |

5,7% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

Registros relacionados através do record linkage: 

|    | Origem   |   quantidade | link(%) |
|---:|:---------|-------------:|--------:|
|  0 | BPA-I    |      3406308 |    59.1 |

===========================================================
Na base consolidada existe um campo chamado "existe", esse campo foi criado pela seguinte lógica:
- nos locais onde existe uma gestante com o mesmo município de residência e a mesma idade marcou o campo como 1
- caso contrário marcou-se o campo como 0.

Ou seja, locais que apresentam o campo "existe = 0", indicam que não havia nenhuma gestante com aquela idade naquele município de residência

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- Pacientes que realizaram procedimentos em diferentes anos foram contabilizadas mais de uma vez.
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público
- No arquivos de record linkage não é aconselhável somar as informações do RL detalhado, pois uma mesma paciente pode fazer mais de um procedimento
- A idade gestacional nas bases de RL refletem o momento em que a paciente fez o atendimento e não o momento do nascimento, por exemplo, uma paciente que teve uma gestação de 38 semanas, pode ter realizado o exame com 10 semanas por exemplo. Na base será apresentado o valor de 10 e não de 38.

# Proporção de gestantes que realizaram tipagem sanguínea RH

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes à tipagem sanguínea
Filtros:
- Apenas exames que ocorreram entre o período gestacional (data de nascimento - semanas gestacionais informadas)
	Procedimentos filtrados:
	02.02.12.003-1 - FENOTIPAGEM DE SISTEMA RH

Período: 2008 e 2024
Região: município de residência

===========================================================
Existem três tipos de dados

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes
- RL consolidado: contabilização a quantidade de nascimento
- RL detalhado: contabilização de pacientes por tipo de tratamento

|    | Origem   |   quantidade |     share |
|---:|:---------|-------------:|----------:|
|  0 | BPA-C    |      8737438 | 84.1828   |
|  1 | BPA-I    |        25260 |  0.243373 |
|  2 | AIH      |      1616427 | 15.5738   |

84,2% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

Registros relacionados através do record linkage: 

|    | Origem   |   quantidade | link(%)   |
|---:|:---------|-------------:|----------:|
|  0 | BPA-I    |        13019 |  51.5     |
|  1 | AIH      |      1562223 |  96.6     |

===========================================================
Na base consolidada existe um campo chamado "existe", esse campo foi criado pela seguinte lógica:
- nos locais onde existe uma gestante com o mesmo município de residência e a mesma idade marcou o campo como 1
- caso contrário marcou-se o campo como 0.

Ou seja, locais que apresentam o campo "existe = 0", indicam que não havia nenhuma gestante com aquela idade naquele município de residência

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- Pacientes que realizaram procedimentos em diferentes anos foram contabilizadas mais de uma vez.
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público
- No arquivos de record linkage não é aconselhável somar as informações do RL detalhado, pois uma mesma paciente pode fazer mais de um procedimento
- A idade gestacional nas bases de RL refletem o momento em que a paciente fez o atendimento e não o momento do nascimento, por exemplo, uma paciente que teve uma gestação de 38 semanas, pode ter realizado o exame com 10 semanas por exemplo. Na base será apresentado o valor de 10 e não de 38.

# Média de Idade Gestacional do primeiro VDRL

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SIHSUS e SIASUS (numerador)
Atendimentos referentes ao vdrl
Filtros:
- Apenas exames que ocorreram entre o período gestacional (data de nascimento - semanas gestacionais informadas)
	Procedimentos filtrados:
	02.02.03.117-9 TESTE NÃO TREPONEMICO P/ DETECÇÃO DE SIFILIS EM GESTANTES, que antes tinha o nome de "VDRL P/ DETECCAO DE SIFILIS EM GESTANTE"

Período: 2008 e 2024
Região: município de residência

===========================================================
Existem três tipos de dados

- Consolidado: Irá apresentar a quantidade de exames realizados e não necessariamente a quantidade de pacientes
- RL consolidado: contabilização a quantidade de nascimento
- RL detalhado: contabilização de pacientes por tipo de tratamento

|    | Origem   |   quantidade |    share |
|---:|:---------|-------------:|---------:|
|  0 | BPA-C    |     33917906 | 52.917   |
|  1 | BPA-I    |      1701042 |  2.65388 |
|  2 | AIH      |     28477496 | 44.4291  |

52,9% dos atendimentos são via BPA-C, esse instrumento de registro não possibilita relacionar a nível individual do paciente.

Registros relacionados através do record linkage: 

|    | Origem   |   quantidade | link(%)  |
|---:|:---------|-------------:|---------:|
|  0 | BPA-I    |       958684 |  56.4    |
|  1 | AIH      |     28463062 |  99.9    |

===========================================================
Na base consolidada existe um campo chamado "existe", esse campo foi criado pela seguinte lógica:
- nos locais onde existe uma gestante com o mesmo município de residência e a mesma idade marcou o campo como 1
- caso contrário marcou-se o campo como 0.

Ou seja, locais que apresentam o campo "existe = 0", indicam que não havia nenhuma gestante com aquela idade naquele município de residência

===========================================================
LIMITAÇÕES
- Um mesmo paciente pode ter realizado mais de um exame o que pode enviesar o cálculo de "cobertura"
- Pacientes que realizaram procedimentos em diferentes anos foram contabilizadas mais de uma vez.
- É aconselhável realizar a cobertura para cada um dos procedimentos
- Foram mapeados apenas os exames realizados no sistema público de saúde, enquanto a quantidade de nascidos vivos engloba tanto aqueles nascidos no sistema privado quanto no público
- No arquivos de record linkage não é aconselhável somar as informações do RL detalhado, pois uma mesma paciente pode fazer mais de um procedimento
- A idade gestacional nas bases de RL refletem o momento em que a paciente fez o atendimento e não o momento do nascimento, por exemplo, uma paciente que teve uma gestação de 38 semanas, pode ter realizado o exame com 10 semanas por exemplo. Na base será apresentado o valor de 10 e não de 38.

# Coeficiente de Infecções Sistêmicas Neonatais 

O Coeficiente de internação por infecção sistêmica no período neonatal é um indicador utilizado para mensurar a ocorrência de internações hospitalares decorrentes de infecções sistêmicas em recém-nascidos, tendo como população de referência o total de nascidos vivos. As infecções sistêmicas neonatais configuram importante problema de saúde pública, por estarem associadas a elevada morbidade e risco de óbito, além de refletirem, em grande parte, condições potencialmente evitáveis relacionadas à assistência pré-natal, ao parto, ao cuidado imediato ao recém-nascido e às práticas de prevenção e controle de infecções nos serviços de saúde. 

O monitoramento desse coeficiente permite analisar tendências temporais, identificar variações na ocorrência das internações por infecção sistêmica neonatal e subsidiar a avaliação da qualidade da atenção materno-infantil. Dessa forma, o indicador contribui para o planejamento, a gestão e a avaliação de ações voltadas à qualificação da assistência neonatal, ao fortalecimento da vigilância epidemiológica e à redução de eventos evitáveis no período neonatal, apoiando a tomada de decisão baseada em evidências. 

Utilizou-se os dados do Sistema de Informações Hospitalares (SIH) e do Sistema de Informações sobre Nascidos Vivos (SINASC) para as medidas de frequências da variável. Dos registros hospitalares, foram filtrados aquele em que a causa primária da internação foram infecções sistêmicas de neonatos com até 3 dias de vida. Foram considerados casos de infecção sistêmica neonatal os registros com CID-10 listados no Quadro 1. 

 

CID-10 referentes as infecções sistêmicas neonatais 

P36 – Septicemia bacteriana do recém-nascido  

P36.0 – Septicemia por Streptococcus do grupo B  

P36.1 – Septicemia por outros estreptococos 

P36.2 – Septicemia por Staphylococcus aureus 

P36.3 – Septicemia por outros estafilococos  

P36.4 – Septicemia por Escherichia coli 

P36.5 – Septicemia por anaeróbios 

P36.8 – Outras septicemias bacterianas do RN 

P36.9 – Septicemia bacteriana do RN, não especificada 

P37 – Outras doenças infecciosas e parasitárias congênitas 

P37.5 – Candidíase neonatal sistêmica 

P38 – Onfalite do recém-nascido com ou sem hemorragia leve 

P39 – Outras infecções específicas do período perinatal 

P39.0 – Mastite infecciosa neonatal 

P39.1 – Conjuntivite neonatal 

P39.2 – Infecção intra-amniótica do feto/RN 

P39.3 – Infecção urinária do RN  

P39.4 – Infecção cutânea do RN 

P39.8 – Outras infecções perinatais especificadas 

P39.9 – Infecção perinatal não especificada 

A41 – Outras septicemias 

A41.0 – Septicemia por Staphylococcus aureus 

A41.1 – Septicemia por outros estafilococos especificados 

A41.2 – Septicemia por estreptococos 

A41.3 – Septicemia por Haemophilus influenzae 

A41.4 – Septicemia por anaeróbios 

A41.5 – Septicemia por outros microrganismos Gram-negativos 

A41.8 – Outras septicemias especificadas 

A41.9 – Septicemia não especificada 

P23 – Pneumonia congênita 

P23.0 – Pneumonia congênita por agente viral 

P23.1 – Pneumonia congênita por Chlamydia 

P23.2 – Pneumonia congênita por Staphylococcus 

P23.3 – Pneumonia congênita por estreptococos do grupo B 

P23.4 – Pneumonia congênita por Escherichia coli 

P23.5 – Pneumonia congênita por Pseudomonas 

P23.6 – Pneumonia congênita por outros agentes bacterianos 

P23.8 – Pneumonia congênita por outros agentes 

P23.9 – Pneumonia congênita, não especificada 

 Para cálculo da métrica atual foi necessário realizar o procedimento de record linkage.

Depois do processo de record linkage, 10,4% dos registros hospitalares não foram possíveis de serem relacionados.

===========================================================
FONTES

SIH-SUS (denominador)
Todas as internações para o paciente de interesse
Filtros: internações para pacientes com até 3 dias de idade
Período: 2008 - 2024
Região: município de atendimento e município de residencia

SINASC (numerador)
Nascidos Vivos
Filtros: -
Período: 2008 e 2024
Região: município de nascimento e município de residência

===========================================================
LIMITAÇÕES
- Não foram filtrados CIDs específicos, portanto durante a análise deve ser realizada a filtragem os CIDs de interesse
- Um mesmo paciente pode apresentar mais de uma internação.


# Taxa de unidades com adequação de infraestrutura

Não é possível calcular a adequação da infraestrutura devido a falta de detalhamento da informação no SUS (PORTARIA Nº 930, DE 10 DE MAIO DE 2012), portanto só é possível mapear se os estabelecimentos tem ou não um determinado tipo de leito.

Porém essa infraestrutura já foi mapeada para o indicador taxas de leitos neonatais, sendo que aqui os dados são exatamente os mesmos

===========================================================
FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de nascimento

CNES - LEITOS (numerador)
Leitos relacionados ao NEONATO
Filtros: codleito = ('41 - NEONATOLOGIA', '63 - UTI NEONATAL', '65 - UNIDADE INTERMEDIARIA NEONATAL', '80 - UTI NEONATAL - TIPO I', '81 - UTI NEONATAL - TIPO II', '82 - UTI NEONATAL - TIPO III', '92 - UNIDADE DE CUIDADOS INTERMED NEONATAL CONVENCIONAL' e '93 - UNIDADE DE CUIDADOS INTERMED NEONATAL CANGURU'
Período: 2008 e 2024
Região: município do estabelecimento
===========================================================
LIMITAÇÕES
- Um mesmo leito é contabilizado mais de uma vez ao longo do tempo
- Filtrem apenas os tipos de estabelecimentos que sejam relacionados a demanda de vocês


# Coeficiente de Mortalidade Neonatal

O Coeficiente de óbitos de recém-nascidos nas primeiras 24 horas de vida é um indicador utilizado para mensurar a ocorrência de óbitos neonatais muito precoces em relação ao total de nascidos vivos em determinado local e período. Os óbitos ocorridos nas primeiras 24 horas de vida refletem, de forma sensível, a qualidade da assistência prestada durante o pré-natal, o parto, o nascimento e o cuidado imediato ao recém-nascido, estando frequentemente associados a causas evitáveis, como asfixia perinatal, complicações obstétricas, prematuridade extrema e falhas na atenção intraparto e neonatal imediata. 

O monitoramento desse coeficiente permite analisar tendências temporais e variações territoriais, subsidiando a avaliação da organização e da qualidade da rede de atenção materno-infantil. Assim, o indicador contribui para o planejamento e a avaliação de políticas e ações voltadas à qualificação da assistência ao parto e ao recém-nascido, ao fortalecimento da vigilância do óbito infantil e à redução de eventos evitáveis no período neonatal precoce. 


FONTES

SIM-DOINF (numerador)
Filtros: óbitos que ocorreram até o 27o dia de vida
Período: 2008 - 2023
Região: Município de óbito

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de nascimento

===========================================================
LIMITAÇÕES

a idade no óbito foi calculada através da diferença entre a data de óbito e a data de nascimento informada na base.


# Proporção de transmissão vertical de HIV 

FONTES

SINAN - AIDA (AIDS Adulto) e AIDC (AIDS Crianças) (numerador)
Cada linha representa um caso, os dados estão detalhados para que filtros sejam aplicados antes da agregação
Filtros:
- Para o AIDC: 'ANT_PERINA'='1', que reflete transmissão vertical
- Para o AIDA: 'ANT_TRASMI'='1', que reflete transmissão vertical
Período: 2008 - 2024
Região: Município de residência

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de residência

LIMITAÇÕES

Os dados extraídos são semelhantes aos dados do tabnet https://www2.aids.gov.br/cgi/deftohtm.exe?tabnet/br.def para o filtro transmissão vertical, porém existem casos com idade acima de 1 ano (sendo a grande maioria).
Nenhuma fonte de dados ficou semelhante aos dados do https://indicadorestransmissaovertical.aids.gov.br/


# Razão de desfecho materno grave

FONTES

SIH-SUS (numerador)
Mulheres com condições ameaçadoras à vida (near miss materno)
Filtros: CIDs (Classificação Internacional de Doenças) e códigos de procedimento SIGTAP que configuram near miss materno, conforme artigo de referência: "Sistema de Informações Hospitalares do Sistema Único de Saúde (SIH-SUS): uma avaliação do seu desempenho para a identificação do near miss materno".
Período: 2008 - 2023
Região: Município de internação/estabelecimento

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de nascimento

LIMITAÇÕES

O numerador contabiliza o número de internações, não o número de mulheres. Em casos raros, uma mesma mulher pode ser internada mais de uma vez, gerando uma contagem duplicada para um mesmo ciclo gestacional.

# Coeficiente de mortalidade perinatal

FONTES

SIM-DOINF e SIM-DOFET (numerador)
Óbitos Perinatais
Filtros: Óbitos Perinatais (≥ 22 semanas de gestação e idade ≤ 7 dias).
Período: 2008 - 2023
Região: Município de residência

SINASC e SIM-DOF (denominador)
Nascimentos totais (Nascidos vivos + Óbitos fetais com 22+ semanas)
Filtros: Inclui todos os nascidos vivos e os óbitos fetais com 22 semanas ou mais de gestação.
Período: 2008 - 2023
Região: Município de residência

LIMITAÇÕES

Qualidade da Informação de Idade: A precisão do coeficiente depende diretamente da qualidade do preenchimento da idade gestacional (no SIM-DOFET) e da data de nascimento/óbito (no SIM-DOINF). Erros nesses campos podem levar à inclusão ou exclusão indevida de casos.

Local de Ocorrência vs. Residência: Este indicador utiliza o local de residência da mãe, que é o mais adequado para avaliar as condições de saúde de uma população. No entanto, é importante estar ciente de que o óbito pode ter ocorrido em outro município, o que tem implicações para a análise da rede de assistência.

# Taxa de cobertura do SISAB

O indicador de Cobertura do SISAB reflete a proporção de gestantes acompanhadas pelo Sistema de Informação em Saúde da Atenção Básica (SISAB) em relação ao total de nascimentos em um determinado período e local. Ele é calculado dividindo-se o número de gestantes com acompanhamento de pré-natal registrado no SISAB, considerando o primeiro atendimento de pré-natal, pelo número total de nascidos (vivos e mortos) no mesmo período e local, multiplicado por 100. 

Além de avaliar o alcance do acompanhamento pré-natal na população gestante, o indicador também pode refletir a porcentagem de gestantes que recorrem à assistência pública de pré-natal. Dessa forma, fornece informações importantes sobre a efetividade da atenção básica em garantir acompanhamento adequado durante a gestação e identificar possíveis lacunas na cobertura de serviços de saúde materna. 

FONTES

SISAB (numerador)
Gestantes com primeiro atendimento de pré-natal cadastrado
Filtros: -
Período: A partir de janeiro de 2017
Região: Município de residência

SINASC e SIM-DOFET (denominador)
Nascimentos totais (Nascidos vivos + Nascidos mortos)
Filtros: -
Período: A partir de 2017
Região: Município de residência

Numerador: Durante a agregação dos dados do SISAB, some a coluna Total Gestantes para o período e a localidade desejada (UF, município, região de saúde, etc.). Os dados já estão consolidados por mês e município.

Denominador: Durante a agregação dos dados da base de nascidos vivos, some a coluna Nascimentos Totais, que contabilizará os Nascidos Vivos (SINASC) e Nascidos Mortos (DOFET), para o período e a localidade desejada (UF, município, região de saúde, etc.). Os dados já estão consolidados por mês e município.

Entre 2017 e 2023, aproximadamente 11.506.153 gestantes iniciaram o acompanhamento pré-natal cadastradas no SISAB. No mesmo período, 19.412.460 nascimentos foram registrados. Portanto, a cobertura SISAB do pré-natal no Brasil foi de aproximadamente 59,3%. 
A cobertura do pré-natal pelo SISAB apresentou aumento ao longo dos anos, passando de 31,9% em 2017 para 80% em 2023. Este aumento pode ser reflexo de uma maior acessibilidade ao serviço de saúde, bem como do aumento de mulheres que utilizam o serviço público de saúde no país.  
A cobertura de pré-natal pelo SISAB foi maior nas regiões Nordeste e Norte. Todas as regiões apresentaram um aumento expressivo na cobertura de pré-natal pelo SISAB ao longo dos anos analisados. 
O Piauí e o Tocantins se destacaram com as maiores coberturas de pré-natal pelo SISAB, com cobertura de 79,4% e 78,5%, respectivamente. Por outro lado, Rio de Janeiro apresentou a menor cobertura (41,1%), seguido do Espírito Santo (48%) e São Paulo (48,8%). O aumento da cobertura foi observado em todas as UFs. A cobertura do SISAB anualmente em cada UF; as maiores proporções foram observadas em 2022 no Ceará (96,8%), Alagoas (96,1%), Sergipe (95,6%), Piauí (95,3%), Tocantis (95,1%) e Maranhão (94,3%). Os municípios com as menores coberturas de pré-natal pelo SISAB foram Cambuci (3,9%) Valinhos (5,3%) e Campo Limpo Paulista (5,6%)


# Proporção de óbitos por asfixia perinatal   

A asfixia perinatal corresponde à insuficiência de oxigenação do cérebro do recém-nascido em período próximo ao parto — podendo ocorrer antes, durante ou imediatamente após o nascimento. Essa condição resulta em hipóxia e acidose metabólica, comprometendo o funcionamento de diversos órgãos, especialmente o cérebro, e podendo ocasionar sequelas neurológicas graves, como paralisia cerebral, deficiência cognitiva, perda visual ou auditiva. 

Entre os principais fatores de risco estão alterações na placenta ou no cordão umbilical, hemorragias maternas, complicações durante o trabalho de parto e intercorrências que dificultem a adequada oxigenação fetal. A ocorrência de asfixia perinatal é considerada um indicador sensível da qualidade da atenção perinatal, refletindo tanto a assistência prestada à gestante durante o pré-natal e o parto, quanto os cuidados imediatos oferecidos ao recém-nascido. 

Por seu alto potencial de prevenção, a redução de óbitos por asfixia perinatal depende do diagnóstico precoce e da intervenção oportuna durante o parto e o período neonatal. No contexto brasileiro, estudos apontam a asfixia perinatal entre as principais causas de mortalidade neonatal precoce, com variação de incidência conforme os critérios diagnósticos e a qualidade dos registros utilizados. A compreensão do perfil epidemiológico desses óbitos, em nível nacional e regional, é essencial para o planejamento e a avaliação de políticas públicas voltadas à melhoria da atenção perinatal e à redução da mortalidade evitável. 

Foram utilizados dados do Sistema de Informações sobre Mortalidade (SIM-DO e SIM-DOF) para a identificação dos óbitos neonatais e fetais por asfixia perinatal para o numerador. Para o denominador, o número total de nascimentos foi obtido pelo Sistema de Informações sobre Nascidos Vivos (SINASC) acrescido do número de óbitos fetais com 22 semanas ou mais de gestação. Os óbitos por asfixia perinatal foram identificados a partir do filtro de causa básica (CAUSABAS) como Asfixia ao nascer (CID-10: P21, incluindo subcategorias). 

FONTES

SIM-DO e SIM-DOF (numerador)
Óbitos (neonatais e fetais) por asfixia perinatal
Filtros:

Óbitos neonatais (idade ≤ 28 dias) com causa básica (CAUSABAS) classificada como Asfixia ao nascer (CID-10: P21, incluindo suas subcategorias).

Óbitos fetais com 22 semanas ou mais de gestação e causa básica (CAUSABAS) relacionada à asfixia perinatal.
Período: 2008 - 2023
Região: Município de residência

SINASC e SIM-DOF (denominador)
Nascimentos totais (Nascidos vivos + Óbitos fetais com 22+ semanas)
Filtros: Inclui todos os nascidos vivos e os óbitos fetais com 22 semanas ou mais de gestação.
Período: 2008 - 2023
Região: Município de residência

Numerador: Durante a agregação, some a coluna obitos_asfixia_perinatal para o período, localidade e demais recortes de interesse.

Denominador:

Na base do denominador, utilize a nova coluna chamada nascimentos_totais que soma os valores das colunas nascidosvivos e obitos_fetais.

Durante a agregação, some use a coluna nascimentos_totais para o mesmo período, localidade e recortes utilizados na agregação do numerador.


# Proporção de neonatos vacinados 

==========================================================
FONTES

PNI (numerador)
Doses de vacinas BCG e Hepatite B aplicadas em menores de 1 ano e meio
----------------------
Filtros:
-----
Ano: 2008 - 2018 - FONTE FTP/DATASUS
    (
        (pni['FX_ETARIA_desc'].isin(['Menor de 1 ano']))
        &(pni['IMUNO']=='02')
        &(pni['DOSE_desc'].isin(['Dose única','1ª dose']))
    )|(
        (pni['FX_ETARIA_desc'].isin(['Até 30 dias']))
        &(pni['IMUNO']=='08')
        &(pni['DOSE_desc'].isin(['Dose','1ª dose']))
    )

----
Ano: 2019 - FONTE TABNET (dados incompletos no FTP)

Imunobiológicos: BCG (BCG)
Dose: Dose única
Ano: 2019
Faixa_Etária: Menor de 1 ano

Imunobiológicos: Hepatite B (HB)
Dose: Dose e 1a Dose
Ano: 2019
Faixa_Etária: Ate 30 dias

----
Ano: 2020 a 2023 - FONTE OPEN DATASUS
imunos=['Vacina BCG','Vacina hepatite B'], 
idades=['0','1'] # em anos

    (
        (pni_od['IMUNO']=='bcg')
        &(pni_od['DOSE'].isin(['Única','Dose','1ª Dose']))
    )|(
        (pni_od['IMUNO']=='hepatite-b')
        &(pni_od['DOSE'].isin(['Única','Dose','1ª Dose']))
    )




Período: 2008 - 2023
Região: Município de residência

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de residência

Numerador: Durante a agregação, some a coluna de dose para cada imuno para o período e a localidade (ano, município, etc.) e/ou imuno desejado. - as doses não devem ser somadas pois uma mesma criança pode tomar ambas as vacinas

Denominador: Some a coluna nascidos_vivos para o mesmo período e localidade utilizados no numerador, garantindo que o universo de comparação seja o mesmo.


# Coeficiente de Óbitos Neonatais Conforme Causa

A análise de óbitos neonatais por causas evitáveis, não claramente evitáveis e mal definidas é fundamental para orientar políticas públicas e ações prioritárias nos serviços de saúde. Os óbitos evitáveis são especialmente relevantes por refletirem condições que poderiam ser prevenidas por práticas adequadas de cuidado, e são classificados em quatro grupos: (1) reduzíveis pela adequada atenção à gestação, ao parto e ao recém-nascido; (2) reduzíveis por ações adequadas de diagnóstico e tratamento; (3) reduzíveis por imunoprevenção; e (4) reduzíveis por ações de promoção da saúde associadas à atenção adequada. Assim, monitorar esse indicador permite identificar falhas e direcionar intervenções onde há maior potencial de redução da mortalidade neonatal. 

Além disso, a estratificação dos óbitos por faixa etária neonatal, idade gestacional, peso ao nascer, tipo de parto e raça/cor — quando aplicável — oferece uma compreensão mais refinada dos perfis de vulnerabilidade e das desigualdades existentes. Esse detalhamento é essencial para apoiar decisões baseadas em evidências e planejar ações específicas voltadas à prevenção das causas evitáveis, contribuindo para melhorias sustentáveis na saúde materno-infantil. 

Entre 2008 e 2023, foram registrados 399.692 óbitos neonatais no Brasil, dos quais 76,9% foram por causas evitáveis, 0,6% por causas mal definidas e 22,6% por causas não evitáveis.  

Os 307.227 óbitos neonatais por causas evitáveis, a maioria é reduzível por adequada atenção à mulher na gestação (53%), seguido de óbitos reduzíveis por adequada atenção ao recém-nascido (30,4%) e reduzíveis por adequada atenção à mulher no parto (14,6%).

Ao longo da série histórica, observa-se que os grupos relacionados à imunização, diagnóstico e tratamento e promoção da saúde mantiveram-se praticamente estáveis, apresentando valores muito baixos tanto em número absoluto quanto em coeficientes por 1.000 nascidos vivos. Essas categorias registraram apenas oscilações marginais, compatíveis com a pequena magnitude dos eventos, sem indicar tendência de crescimento ou redução significativa ao longo do tempo. 

Já os grupos relacionados à atenção adequada à gestação, atenção ao parto e atenção ao recém-nascido mostraram maior variação temporal, com pequenas flutuações anuais, alternando aumentos e reduções sem um padrão claramente consistente. Entre eles, destaca-se o grupo relacionado à atenção adequada à gestação, que apresentou crescimento consistente durante os anos pandêmicos e pós-pandêmicos (2021–2023), sugerindo possível impacto das disrupções na assistência pré-natal e nos fluxos de cuidado durante esse período. Os demais grupos (atenção ao parto e atenção ao recém-nascido) oscilaram de forma mais aleatória, sem tendência definida. 

FONTES

SIM-DO (numerador)
Óbitos neonatais (0 a 27 dias de vida) classificados por causa da morte
Filtros: Causas de óbito (CAUSABAS) agrupadas conforme a lista de "Causas de Mortes Evitáveis em Menores de 5 Anos" do Ministério da Saúde.
Período: 2008 - 2023
Região: Município de residência

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de residência

Numerador: Durante a agregação, some a coluna obitos_neonatais_evitaveis. A análise principal deve ser feita agrupando os dados pelas categorias da coluna Agrupamento_Nivel_1 (ex: Causas Evitáveis, Não Claramente Evitáveis, Mal Definidas) e/ou Agrupamento_Nivel_2 e Causas_evitaveis para maior detalhamento.

Denominador: Some a coluna nascidosvivos do SINASC para o mesmo período, localidade e estratificação utilizada no numerador (ex: por ano, município e idade gestacional), garantindo que as bases de comparação sejam idênticas.

===========================================================
LIMITAÇÕES

Metodologia de Classificação: A categorização das causas é baseada na lista oficial de "Causas Evitáveis" do Ministério da Saúde. Contudo, cerca de 25% da base total não foi classificada por possuir CIDs que não estavam presentes na lista oficial.

A idade foi calculada através da diferença da data de nascimento e da data de óbito, sendo que o horário não foi considerado (por só estar disponível na data de óbito) isso pode incluir crianças com até 29 dias de vida.


# Coeficiente de óbitos de recém-nascidos nas primeiras 24 horas de vida 

O Coeficiente de óbitos de recém-nascidos nas primeiras 24 horas de vida é um indicador utilizado para mensurar a ocorrência de óbitos neonatais muito precoces em relação ao total de nascidos vivos em determinado local e período. Os óbitos ocorridos nas primeiras 24 horas de vida refletem, de forma sensível, a qualidade da assistência prestada durante o pré-natal, o parto, o nascimento e o cuidado imediato ao recém-nascido, estando frequentemente associados a causas evitáveis, como asfixia perinatal, complicações obstétricas, prematuridade extrema e falhas na atenção intraparto e neonatal imediata. 

O monitoramento desse coeficiente permite analisar tendências temporais e variações territoriais, subsidiando a avaliação da organização e da qualidade da rede de atenção materno-infantil. Assim, o indicador contribui para o planejamento e a avaliação de políticas e ações voltadas à qualificação da assistência ao parto e ao recém-nascido, ao fortalecimento da vigilância do óbito infantil e à redução de eventos evitáveis no período neonatal precoce. 

FONTES

SIM-DOFET (numerador)
Óbitos de recém-nascidos ocorridos nas primeiras 24 horas de vida
Filtros: Óbitos cuja data de óbito é igual ou menor que um dia após a data de nascimento.
Período: 2008 - 2023
Região: Município de residência

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de residência
Numerador: Durante a agregação, some a coluna contador (que representa a quantidade de óbitos) para o período e a localidade desejada. Para uma análise mais detalhada, utilize as colunas peso_cat (faixa de peso) ou GESTACAO (idade gestacional) como categorias de agrupamento.

Denominador: Durante a agregação, some as ocorrências de nascidos vivos do SINASC, utilizando os mesmos recortes de período, localidade e, caso necessário, as mesmas categorias do numerador (faixa de peso, idade gestacional) para garantir a comparabilidade.

===========================================================
LIMITAÇÕES

Aproximação do Período de 24 horas: A identificação dos óbitos ocorridos nas primeiras 24 horas foi realizada através da subtração da data de nascimento da data do óbito. Esta é uma aproximação metodológica necessária, pois o campo IDADE do sistema SIM possui um código não documentado ("0") que impede a classificação precisa por horas de vida.

Possível Inclusão de Óbitos: Como a aproximação se baseia em dias inteiros (sem registro de horário), a seleção pode incluir recém-nascidos que faleceram com um tempo de vida ligeiramente superior a 24 horas (ex: óbito na manhã do dia seguinte ao nascimento).


# Proporção de óbitos maternos evitáveis

A proporção de óbitos maternos evitáveis é um indicador fundamental para monitorar a qualidade da atenção à saúde da mulher no ciclo gravídico-puerperal. Esse indicador expressa a distribuição percentual dos óbitos maternos que poderiam ter sido evitados por meio de intervenções oportunas e eficazes de prevenção, diagnóstico, tratamento e cuidado durante a gestação, parto e puerpério. 

No contexto brasileiro, utiliza-se como base os óbitos de mulheres registrados com causas maternas segundo a Classificação Internacional de Doenças – 10ª Revisão (CID-10), abrangendo os códigos O00 a O26 (relacionados à gestação, parto e puerpério precoce), e O29 a O99, que incluem complicações do puerpério e outras condições maternas. 

A análise da proporção de óbitos evitáveis permite identificar falhas nos serviços de saúde, desigualdades regionais e grupos populacionais mais vulneráveis, subsidiando a formulação de políticas públicas e estratégias específicas para a redução da mortalidade materna, especialmente em contextos de maior vulnerabilidade social. Avaliar essa proporção ao longo do tempo contribui também para o monitoramento dos compromissos assumidos pelo país na agenda dos Objetivos de Desenvolvimento Sustentável (ODS), particularmente a meta de reduzir a razão de mortalidade materna para menos de 70 por 100 mil nascidos vivos até 2030. 

Utilizou-se os dados do Sistema de Informações Sobre Mortalidade (SIM) para as frequências de óbitos maternos e suas causas. As causas consideradas evitáveis são os óbitos relacionados aos CID-10: 

O00–O08 – Gravidez ectópica e molar, e abortamento 

O10–O16 – Edema, proteinúria e distúrbios hipertensivos na gravidez, parto e puerpério 

O20–O26 e O29 – Outras afecções maternas relacionadas com a gravidez 

O30–O48 – Cuidados relacionados com o feto e com a mãe 

O60–O75 – Complicações do trabalho de parto e do parto 

O80–O84 – Parto 

O85–O92 – Complicações do puerpério 

O95–O99 – Outras causas maternas de morbidade e mortalidade 

Dentre 27.907 óbitos maternos ocorridos entre 2008 e 2023 no Brasil, a proporção de óbitos maternos evitáveis foi de 99,9% (n = 27.882). Destes, 98,3% foram por causas reduzíveis por ações de prevenção e controle da morte materna,1,6% por causas reduzíveis por ações de promoção e controle de doenças infecciosas e apenas 1 óbito por causas reduzíveis pelas ações de imunoprevenção. 

A descrição das condições de saúde que levaram a mãe ao óbito, de acordo com o CID-10, indicaram que a maioria (98,3%) dos óbitos foram decorrentes da gravidez, parto e puerpério (exceto complicações ligadas predominantemente à gravidez), 1,6% a doenças pelo vírus da imunodeficiência humana [HIV] e apenas 1 óbito decorrente do tétano obstétrico. 

FONTES

SIM - DO - óbitos (denominador) 
Base do SIM - detalhado se o CID é evitável ou não
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 - 2024
Região: município de ocorrencia/residência da mãe
Características: raça cor da mãe e faixa etária da mãe

SIM - DOMAT - óbitos maternos (numerador)
Base do SIM - detalhado se o CID é evitável ou não
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 e 2024
Região: município de ocorrencia/residência da mãe
Características: raça cor da mãe e faixa etária da mãe


Durante a agregação, some os itens do numerador e denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde, faixa etária da mãe, raça/cor mãe) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- A base de mortalidade contém campos como Peso, Semana Gestacional, Tipo de parto etc. Porém esses campos estão com mais de 90% não informado, por isso não foram adicionados no detalhamento do dado de   mortalidade


# Proporção de óbitos maternos por local de óbito

A proporção de óbitos maternos por local de óbito é um indicador crucial na avaliação da qualidade da assistência materna e dos desfechos de saúde materna. Esse indicador permite entender onde ocorrem os óbitos maternos, sejam eles em ambiente hospitalar, em casa ou em outros locais, fornecendo um mapeamento fundamental para políticas de saúde pública e intervenções direcionadas. 

No contexto brasileiro, por exemplo, a análise dessa proporção pode revelar disparidades regionais e socioeconômicas significativas, influenciando a alocação de recursos e estratégias para que esses óbitos sejam evitados. Além disso, a distribuição desigual dos óbitos maternos por local pode destacar áreas onde há necessidade de fortalecimento da infraestrutura de saúde, capacitação de profissionais e educação em saúde materna. 

Globalmente, a monitorização dessa proporção é parte integrante dos esforços para alcançar as metas de desenvolvimento sustentável relacionadas à saúde materna, visando reduzir drasticamente as taxas de mortalidade materna evitável até 2030. Portanto, entender e contextualizar essa métrica é essencial para orientar políticas eficazes e garantir cuidados maternos seguros e equitativos em todo o mundo. 

Do total de 27.907 óbitos maternos no Brasil entre 2008 e 2023, a maioria ocorreu em ambiente hospitalar (91,25%).
A proporção de óbitos maternos em ambiente hospitalar diminuiu ao longo dos anos, passando de 92% em 2008 para 90,2% em 2023, enquanto a proporção em outros estabelecimentos de saúde, que não hospitais, aumentou de 1% para 3,4%. Apenas em 2015 começou a se ter notificação de óbitos materno em aldeias indígenas, porém, por limitações inerentes aos dados secundários, não é possível saber se a ausência de dados foi decorrente da ausência de óbitos ou pelos registros dos óbitos nas demais categorias disponíveis no sistema. 
Como exposto na Tabela 2, a maior parte dos óbitos maternos no Brasil entre 2008 e 2023 foram de mulheres pardas na faixa etária de 30 a 39 anos. Apenas 72,5% dos óbitos maternos de indígenas ocorreram em ambiente hospitalar, proporção inferior as demais categorias de raça/cor, nas quais apresentam uma proporção maior que 90%. 

FONTES

SIM - DO - óbitos (denominador) 
Base do SIM - detalhado se o CID é evitável ou não
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 - 2024
Região: município de ocorrencia/residência da mãe
Características: raça cor da mãe e faixa etária da mãe

SIM - DOMAT - óbitos maternos (numerador)
Base do SIM - detalhado se o CID é evitável ou não
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 e 2024
Região: município de ocorrencia/residência da mãe
Características: raça cor da mãe e faixa etária da mãe

Durante a agregação, some os itens do numerador e denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde, faixa etária da mãe, raça/cor mãe) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- A base de mortalidade contém campos como Peso, Semana Gestacional, Tipo de parto etc. Porém esses campos estão com mais de 90% não informado, por isso não foram adicionados no detalhamento do dado de   mortalidade.


# Proporção de óbitos maternos por período do óbito

A proporção de óbitos maternos por período do óbito é um indicador essencial para compreender em que momento do ciclo gestacional – seja durante a gravidez, no parto ou no puerpério, durante processo de aborto – ocorre a maior concentração de mortes maternas. Esse dado permite identificar fases críticas da assistência materna, direcionando ações específicas para prevenção e melhoria da qualidade do cuidado em cada etapa. 

No contexto brasileiro, a análise dessa proporção evidencia desafios como atrasos na identificação de complicações, falhas no manejo clínico ou insuficiência na continuidade do cuidado no pós-parto. Ao revelar padrões temporais, o indicador possibilita intervenções mais precisas, como o fortalecimento do pré-natal, a qualificação da assistência ao parto e a ampliação do acompanhamento puerperal, especialmente em regiões e populações mais vulneráveis. 

Em nível global, monitorar essa proporção contribui para estratégias voltadas à redução da mortalidade materna evitável, alinhadas aos Objetivos de Desenvolvimento Sustentável. Ao destacar os períodos mais críticos, esse indicador apoia a implementação de políticas públicas, a alocação mais eficiente de recursos e o desenvolvimento de protocolos clínicos baseados em evidências, visando garantir que mulheres recebam cuidados seguros e oportunos em todas as fases da maternidade. 

 A partir de 2009, os registros de óbitos maternos passaram a contar com a notificação do período em que o óbito ocorreu. Do total de 26.226 óbitos maternos no Brasil entre 2009 e 2023, a maioria ocorreu no puerpério (até 42 dias do término da gestação) (52,9%).
  A proporção de óbitos maternos no puerpério (até 42 dias do término da gestação) aumentou ao longo dos anos, passando de 28,8% em 2009 para 62,8% em 2023. Também observamos um aumento na proporção dos óbitos ocorridos durante a gestação (passando de 10,7% para 19,9%), e ocorridos no parto ou até 1 hora após o parto (passando de 4,6% para 5,1%). Apesar da alta proporção de óbitos sem notificação do período de ocorrência, a ausência desta informação diminuiu ao longo dos anos, passando de 48,1% dos registros em 2009 para 9,5% em 2023. 

  FONTES

SIM - DO - óbitos (denominador) 
Base do SIM - detalhado se o CID é evitável ou não
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 - 2024
Região: município de ocorrencia/residência da mãe
Características: raça cor da mãe e faixa etária da mãe

SIM - DOMAT - óbitos maternos (numerador)
Base do SIM - detalhado se o CID é evitável ou não
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 e 2024
Região: município de ocorrencia/residência da mãe
Características: raça cor da mãe e faixa etária da mãe

Durante a agregação, some os itens do numerador e denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde, faixa etária da mãe, raça/cor mãe) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- A base de mortalidade contém campos como Peso, Semana Gestacional, Tipo de parto etc. Porém esses campos estão com mais de 90% não informado, por isso não foram adicionados no detalhamento do dado de   mortalidade


# Razção de Mortalidade Materna

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: município de ocorrencia/residência da mãe

SIM - DO - óbitos (numerador)
Base do SIM voltada apenas para óbitos maternos
Filtros:
TIPOBITO = '2'
  AND SEXO = '2'
  AND (
      OBITOPUERP IN ('1 - Sim, até 42 dias após o parto', '2 - Sim, de 43 dias a 1 ano')
      OR OBITOPARTO IN ('1 - antes', '2 - durante')
      OR OBITOGRAV IN ('1 - Sim')
      )

Período: 2008 e 2023
Região: município de ocorrencia/residência, raça cor da mãe e faixa etária da mãe

Durante a agregação, some os itens do numerador e denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde, faixa etária da mãe, raça/cor mãe) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- A base de mortalidade contém campos como Peso, Semana Gestacional, Tipo de parto etc. Porém esses campos estão com mais de 90% não informado, por isso não foram adicionados no detalhamento do dado de   mortalidade



# Coeficiente de Óbito Fetal 

O óbito fetal ocorre quando o feto, a partir da 22ª semana de gestação ou fetos com peso igual ou superior a 500 gramas ou a partir de 25 centímetros de comprimento, nasce sem sinais de vida. Esse é um importante indicador da qualidade da assistência à saúde materna e neonatal. Ele reflete não apenas problemas durante a gravidez e parto - como falta de pré-natal adequado, complicações não tratadas ou assistência médica deficiente - mas também evidencia desigualdades sociais, já que as taxas são mais altas em populações com menor acesso a serviços de saúde e condições socioeconômicas precárias. 

A análise desse indicador é crucial para orientar políticas públicas eficazes. Ao identificar onde e por que esses óbitos ocorrem, é possível direcionar ações como a melhoria do pré-natal, capacitação de equipes médicas e investimento em infraestrutura hospitalar, especialmente em regiões mais vulneráveis. Dessa forma, o monitoramento dos óbitos fetais não só ajuda a reduzir mortes evitáveis, como também promove maior equidade e qualidade na saúde materno-infantil. 

FONTES

IBGE - POPULAÇÃO (denominador)
População Brasil (a fonte está indicada em cada linha)
Filtros: -
Período: 2008 - 2024
Região: município de residência

CNES - ESTABELECIMENTO (numerador)
Unidades Básica de Saúde
Filtros: TP_UNID = '02' (CENTRO DE SAUDE/UNIDADE BASICA)
Período: 2008 e 2024
Região: município do estabelecimento

Numerador: Agregue seus dados de acordo com o agrupamento de interesse e depois utilize um "count distinct" no campo cnes para contabilizar a quantidade de UBS no Brasil.

Denominador: Selecione o tipo de agregação (regionType = MN - município, UF - estado, BR - Brasil), esse filtro é necessário devido aos anos no qual a população é obtida através da projeção, isso implica que nem sempre a soma de uma menor nível (por exemplo municipios) resulta na projeção do maior nível (UF). Para diferentes anos utilize uma métrica como mínimo, média, máximo, pois

===========================================================
LIMITAÇÕES
- Os anos de 2023 e 2024 estão com o mesmo dado do censo de 2022
- A menor granularidade da análise é município, devido a agregação dos dados populacionais
- Um município pode mudar seu tipo ao longo do tempo.


# Taxa de Enfermeiros Obstétricos

 Avalia a disponibilidade de enfermeiros obstétricos para uma determinada população. A proporção de enfermeiros obstétricos no Sistema Único de Saúde (SUS) é um indicador crucial para avaliar a capacidade de assistência obstétrica qualificada no Brasil. Este indicador reflete diretamente a disponibilidade de profissionais especializados em cuidados maternos durante o pré-natal, parto e pós-parto. A presença adequada de enfermeiros obstétricos não apenas melhora os resultados de saúde materna, reduzindo complicações e mortalidade, mas também fortalece a integralidade e a humanização da assistência, promovendo uma transição segura para a maternidade.  

A atuação dos enfermeiros obstétricos contribui para a ampliação do acesso aos serviços, reduzindo a necessidade de encaminhamentos para médicos obstetras em casos de gestação de baixo risco, o que, por sua vez, otimiza o uso dos recursos humanos em saúde e fortalece a resolutividade da atenção básica e dos serviços de média complexidade. No contexto brasileiro, onde desigualdades regionais e socioeconômicas impactam o acesso aos serviços de saúde, monitorar e aumentar essa proporção é essencial para garantir equidade e qualidade nos cuidados oferecidos às gestantes e parturientes atendidas pelo SUS. 

A taxa de enfermeiros obstétricos por 10 mil habitante no Brasil foi de 0,17 (n = 3.502 profissionais para 203.080.756 habitantes estimados em 2022). 
A Associação Brasileira de Obstetrizes e Enfermeiras(os) Obstetras- ABENFO, estimou, a partir dos dados de registros de especialistas no Sistema COFEN/CORENs em relação à população geral, uma densidade de Enfermeiras(os) Obstetras no Brasil de 0,64 por 10.000 habitantes em 2022. (https://abenfo.org.br/wp-content/uploads/2023/05/Boletim-Abenfo-n.-1-maio-2023.pdf) 

Por outro lado, Oliveira et al (2021), revelam que existem 2.049 profissionais de enfermagem registrados no Conselho de Enfermagem com especialização em obstetrícia, com densidade de 0,10 profissionais por 10.000 habitantes.  Cavalcante de Oliveira, A. P., Arena Ventura, C. A., Lopes Galante, M., Padilla, M., Cunha, A., Costa Mendes, I. A., Ventura de Souza, K., Neri da Silva, M. C., Correia Pinheiro, M. I., Mattos Ramalho, N., Acioli, S., & Nunes Azevedo, V. (2021). O Estado da Enfermagem Obstétrica no Brasil. Revista Latino-Americana De Enfermagem, 29. https://doi.org/10.1590/1518-8345.0000.3510 

FONTES

IBGE - POPULAÇÃO (denominador)
População Brasil (a fonte está indicada em cada linha)
Filtros: -
Período: 2008 - 2024
Região: município de residência

CNES - PROFISSIONAIS (numerador)
Enfermeiros Obstétricos
Filtros: cbo = '223545'
Período: 2008 e 2024
Região: município do estabelecimento

Numerador: Agregue seus dados de acordo com o agrupamento de interesse e depois utilize um "count distinct" no campo CNS_PROF para contabilizar a quantidade de profissionais.

Denominador: Selecione o tipo de agregação (regionType = MN - município, UF - estado, BR - Brasil), esse filtro é necessário devido aos anos no qual a população é obtida através da projeção, isso implica que nem sempre a soma de uma menor nível (por exemplo municipios) resulta na projeção do maior nível (UF). Para diferentes anos utilize uma métrica como mínimo, média, máximo, pois

===========================================================
LIMITAÇÕES
- Os anos de 2023 e 2024 estão com o mesmo dado do censo de 2022
- A menor granularidade da análise é município, devido a agregação dos dados populacionais


# Proporção de instituições com existência de alojamento conjunto 

As diretrizes da Portaria Nº 2.068, de 21 de outubro de 2016, visam garantir que todas as unidades de saúde ofereçam condições adequadas para a implementação do Alojamento Conjunto, assegurando conforto, segurança e privacidade para a família. O Alojamento Conjunto é uma prática hospitalar que promove o cuidado conjunto da mãe e do bebê, mantendo-os juntos no mesmo ambiente desde o nascimento até a alta hospitalar. Essa abordagem facilita o vínculo afetivo entre mãe e filho, estimula o aleitamento materno precoce e favorece a continuidade do cuidado familiar. 

A proporção de instituições, nas quais partos são realizados, com existência de alojamento conjunto, avalia a disponibilidade e implementação dessa prática em diferentes instituições de saúde. Ele reflete o compromisso das unidades de saúde com a promoção do cuidado integrado e humanizado, além de ser um importante aspecto na avaliação da qualidade dos serviços obstétricos e neonatais oferecidos. 

A proporção foi calculada com base na média de instituições com existência de alojamento conjunto para cada mês de cada ano, em cada município do Brasil, dividido pelo número total de instituições de saúde para o mesmo período e local. A partir da média de mensal desta proporção, foram calculadas as médias anuais e total do período. Isso acontece pois o número de instituições em funcionamento e a oferta de serviços, como o alojamento conjunto, podem variar ao longo do ano. Assim, o uso da média mensal permite uma estimativa mais estável e representativa da realidade anual, minimizando distorções causadas por variações pontuais ou sazonais nos registros do CNES. 

Proporção de instituições com existência de alojamento conjunto foi, em média, de 47% entre 2017 e 2023 no Brasil.  
Ao longo dos anos 
Apesar da Portaria Nº 2.068 ter sido divulgada em outubro de 2016, a partir de fevereiro de 2017 as regiões já apresentaram o início da adoção desta prática.  
Esta proporção apresentou redução percentual de 3,8% ao longo dos anos, passando de 48,4% em 2017 para 46,5% em 2023.

FONTES

SINASC (denominador)
CNES com nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de nascimento

CNES - ESTABELECIMENTO (numerador)
Qtd. Alojamento Conjunto por CNES
Filtros: -
Período: 2008 e 2024
Região: município do estabelecimento - somou-se o campo QTLEIT40 (que corresponde ao alojamento conjunto)
Numerador: Durante a agregação, selecione a média (quantidade média de leitos num determinado período e região) ou o mínimo / máximo (menor disponibilidade, maior disponibilidade) - NÃO SOME os diferentes meses/anos, pois um mesmo leito pode ser contabilizado de um ano para outro.

Denominador: Durante a agregação, some os itens do denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- Um mesmo leito é contabilizado mais de uma vez ao longo do tempo
- Filtrem apenas os tipos de estabelecimentos que sejam relacionados a demanda de vocês
- Sugiro selecionarem apenas os estabelecimentos com nascimentos por ano


# Número de leitos de UTI adulto necessários para a atenção materna (antigo 'taxa de leitos de UTI adulto')

O indicador “Número de leitos de UTI adulto necessários para a atenção materna” foi concebido como uma medida indireta da capacidade estrutural do sistema de saúde em ofertar cuidado intensivo adequado às gestantes e puérperas em situações de complicações clínicas graves. Diferentemente da taxa geral de leitos de UTI adulto, cuja interpretação é pouco específica para a avaliação da saúde materna-infantil, este indicador busca conferir sentido e pertinência analítica à disponibilidade de terapia intensiva no contexto obstétrico. 

A redefinição do indicador fundamenta-se nas diretrizes mais recentes da Rede Cegonha, que estabelecem que o número de leitos de UTI adulto deve corresponder, aproximadamente, a 6% do total de leitos obstétricos estimados para cada região, como parâmetro de planejamento da atenção especializada materna. Parte-se, portanto, do entendimento de que uma fração mínima dos leitos de UTI adulto deve estar potencialmente disponível para o atendimento de mulheres no ciclo gravídico-puerperal.  

Nesse sentido, o indicador passa a representar o número de leitos de UTI adulto necessários para o cumprimento do parâmetro assistencial voltado à atenção materna. Essa abordagem permite avaliar, de forma mais coerente com os objetivos do projeto, a adequação da capacidade instalada de cuidado intensivo frente às necessidades da saúde materna, configurando-se como um indicador de estrutura relevante para a análise da resolutividade e da segurança da atenção obstétrica. Ao adotar esse parâmetro normativo, o indicador contribui para a identificação de lacunas na organização da rede assistencial e para o planejamento de ações voltadas à redução de desfechos maternos adversos evitáveis. 

Inicialmente, estimou-se o número de leitos obstétricos necessários em cada local, conforme os parâmetros definidos na Portaria SAS/MS nº 650, de 2011, que estabelece a razão de 0,28 leitos obstétricos para cada 1.000 habitantes usuários do Sistema Único de Saúde (SUS), ou seja, aproximadamente 75% da população total. 

Os dados referentes à população residente foram obtidos a partir das estimativas populacionais oficiais do Instituto Brasileiro de Geografia e Estatística (IBGE), utilizadas como base para o cálculo do número de habitantes usuários do SUS em cada local. 

Na segunda etapa, o número de leitos obstétricos estimados foi multiplicado por 6% (0,06), em conformidade com as diretrizes da Rede Cegonha, que recomendam que os leitos de UTI adulto correspondam a aproximadamente essa proporção dos leitos obstétricos estimados.  

N° de leitos obstétricos estimados × 0,06

Considerando que o número de leitos obstétricos estimados no Brasil nos anos de 2008 a 2023, seriam necessários, em média, 2.555 leitos de UTI Adulto voltados para assistência materna.


# Taxa de leitos obstétricos

O indicador "Taxa de leitos obstétricos" expressa a disponibilidade de leitos hospitalares destinados especificamente ao atendimento obstétrico. Este indicador é fundamental para avaliar a adequação da capacidade assistencial à demanda por partos e cuidados relacionados ao ciclo gravídico-puerperal.  

A presença de leitos obstétricos em número suficiente e distribuídos de forma equitativa é essencial para garantir o acesso oportuno, seguro e humanizado ao parto, conforme preconizado pelas diretrizes do Sistema Único de Saúde (SUS) e pelas recomendações da Rede Cegonha. De acordo com a Portaria SAS/MS nº 650/2011, o parâmetro recomendado é de aproximadamente 0,28 leitos por 1.000 habitantes usuários SUS (média de 75% da população total). A análise deste indicador permite identificar regiões com possível déficit de infraestrutura obstétrica, contribuindo para o monitoramento da equidade e qualidade da atenção à saúde materna e neonatal no Brasil. 

Utilizou-se os dados do IBGE e do Cadastro Nacional de Estabelecimentos de Saúde (CNES) para as medidas de frequências da variável. Foi obtido o número de leitos de Obstetrícia Cirúrgica (código: 10) e de Obstetrícia Clínica (código: 43), além do número de habitantes nos mesmos locais e períodos. 
A taxa foi calculada com base na média de leitos obstétricos para cada mês de cada ano no Brasil, dividido pela média de habitantes no país no mesmo período. Isso acontece pois o número de leitos pode variar ao longo do ano. Assim, o uso da média mensal permite uma estimativa mais estável e representativa da realidade anual, minimizando distorções causadas por variações pontuais ou sazonais nos registros do CNES. 

A média populacional entre 2008 e 2023 é de 202.779.985 habitantes, sendo 152.084.989 dependentes do SUS (aproximadamente 75% da população). Para uma taxa de leitos obstétricos de 0,28 leitos por mil habitantes, o número total de leitos obstétricos necessários no Brasil, considerando esta população, seria de 42.584 leitos. A taxa de leitos obstétricos por mil habitantes foi, em média, de 0,27 (n = 41.798 leitos) entre 2008 e 2023 no Brasil. 

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de nascimento

CNES - LEITOS (numerador)
Leitos relacionados ao NEONATO
Filtros: codleito = ('10 - OBSTETRICIA CIRURGICA', '43 - OBSTETRICIA CLINICA')
Período: 2008 e 2024
Região: município do estabelecimento

Numerador: Durante a agregação, primeiro selecione os tipos de leito (caso queira analisar agregado), e depois selecione a média (quantidade média de leitos num determinado período e região) ou o mínimo / máximo (menor disponibilidade, maior disponibilidade) - NÃO SOME os diferentes meses/anos, pois um mesmo leito pode ser contabilizado de um ano para outro.

Denominador: Durante a agregação, some os itens do denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- Um mesmo leito é contabilizado mais de uma vez ao longo do tempo
- Filtrem apenas os tipos de estabelecimentos que sejam relacionados a demanda de vocês


# Taxa de leitos neonatais

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de nascimento

CNES - LEITOS (numerador)
Leitos relacionados ao NEONATO
Filtros: codleito = ('41 - NEONATOLOGIA', '63 - UTI NEONATAL', '65 - UNIDADE INTERMEDIARIA NEONATAL', '80 - UTI NEONATAL - TIPO I', '81 - UTI NEONATAL - TIPO II', '82 - UTI NEONATAL - TIPO III', '92 - UNIDADE DE CUIDADOS INTERMED NEONATAL CONVENCIONAL' e '93 - UNIDADE DE CUIDADOS INTERMED NEONATAL CANGURU'
Período: 2008 e 2024
Região: município do estabelecimento


Numerador: Durante a agregação, primeiro selecione os tipos de leito (caso queira analisar agregado), e depois selecione a média (quantidade média de leitos num determinado período e região) ou o mínimo / máximo (menor disponibilidade, maior disponibilidade) - NÃO SOME os diferentes meses/anos, pois um mesmo leito pode ser contabilizado de um ano para outro.

Denominador: Durante a agregação, some os itens do denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde) e do ano e ou/mês

===========================================================
LIMITAÇÕES
- Um mesmo leito é contabilizado mais de uma vez ao longo do tempo
- Filtrem apenas os tipos de estabelecimentos que sejam relacionados a demanda de vocês



# Incidência de tétano neonatal positivo

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe
Características: Raça/cor e faixa etária da mãe

SINAN - TÉTANO (numerador)
Pacientes RECÉM NASCIDOS com sífilis
Filtros: somente casos confirmados (CLASSI_FIN = 1)
Período: 2014 e 2021 (anos disponíveis no governo)
Região: município de residência da mãe
Características: quantas consultas pré natal, faixa etária da mãe


Durante a agregação, some os itens do numerador e denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde, faixa etária da mãe, raça/cor mãe) e do ano e ou/mês

===========================================================
LIMITAÇÕES
No período de interesse existem apenas dois casos confirmados, informações associadas ao parto não estão disponíveis


# Taxa de incidência de sífilis congênita em neonatos 

Esse indicador representa os casos novos de sífilis congênita em neonatos em relação ao total de nasidos vivos em um local e/ou período. 
De 2008 a 2023, o Brasil registrou 304.187 casos novos de sífilis congênita em neonatos, para um total de 45.366.358 nascidos vivos, indicando assim uma taxa de 6,71 de sífilis congênita neonatal.  

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe
Características: Raça/cor e faixa etária da mãe

SINAN - SIFILIS CONGÊNITA (numerador)
Pacientes RECÉM NASCIDOS com sífilis
Filtros: -
Período: 2008 e 2024
Região: município de residência da mãe
Características: Raça/cor e faixa etária da mãe e se realizou ou não pré natal


Durante a agregação, some os itens do numerador e denominador, faça o merge das bases através do campo agregado (UF, município, região de saúde, faixa etária da mãe, raça/cor mãe) e do ano e ou/mês

===========================================================
LIMITAÇÕES
A base do SINAN não apresenta informações sobre o tipo de parto, peso ao nascer, semanas gestacionais etc.


# Taxa de HIV positivo em gestantes

FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SINAN - HIV GESTANTES (numerador)
Pacientes gestantes com HIV
Filtros: -
Período: 2008 e 2024
Região: município de residência da mãe


# Taxa de detecção de sífilis em gestantes

A taxa de detecção de sífilis em gestantes é um indicador fundamental para o monitoramento da qualidade da atenção pré-natal e das ações de vigilância em saúde no Brasil. Esse indicador representa a proporção de casos notificados de sífilis em gestantes em relação ao total de nascidos vivos em determinado período e localidade. Sua análise permite avaliar a capacidade do sistema de saúde em identificar precocemente a infecção durante a gestação, prevenindo a transmissão vertical da sífilis e suas consequências, como aborto, morte fetal e sífilis congênita. Altas taxas de detecção podem refletir tanto um aumento real da doença quanto uma maior efetividade das estratégias de rastreamento e diagnóstico, sendo, portanto, essenciais para subsidiar políticas públicas voltadas à saúde materno-infantil. 
A taxa de detecção de sífilis em gestantes foi de 1,2% (n = 537.649) entre 2008 e 2023 no Brasil. 
FONTES

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2024
Região: município de residência da mãe

SINAN - SIFILIS GESTANTES (numerador)
Pacientes gestantes com sífilis
Filtros: apenas casos confirmados através de teste treponêmico (TPCONFIRMA = 1)
Período: 2008 e 2024
Região: município de residência da mãe


# Proporção de Cesáreas 

Esse indicador representa a proporção de nascimentos por cesárea entre todos os nascidos vivos em um determinado período. A porcentagem de nascimentos por cesárea é um indicador do acesso, da utilização de cuidados de saúde durante o parto e a qualidade da assistência ao parto. Embora a cesárea seja uma intervenção essencial em casos de risco materno ou fetal, sua utilização excessiva está associada a maiores riscos de complicações para mães e recém-nascidos. 

Esse indicador também pode revelar disparidades regionais e socioeconômicas no acesso a um parto humanizado. Sua análise permite orientar políticas públicas para a promoção do parto seguro, a educação em saúde e a qualificação das equipes obstétricas. Dessa forma, o monitoramento sistemático da proporção de cesáreas é crucial para garantir práticas baseadas em evidências, reduzir intervenções desnecessárias e melhorar os desfechos maternos e neonatais. 

A Organização Mundial da Saúde (OMS), desde 1985, recomenda que a proporção de cesarianas deve variar entre 10% e 15%; indicando que acima dessa proporção pode significar maior número de cesárias sem a correta indicação médica, e quando esse percentual fica abaixo de 10%, há indícios de que o número de procedimentos pode ser insuficiente, sugerindo que algumas mulheres com real necessidade podem não estar recebendo a intervenção adequada. 

Entre os anos de 2008 e 2023, houve 45.312.384 partos com identificação da via de parto (cesáreo/vaginal) no Brasil, assim a proporção de gestantes que tiveram o parto cesáreo foi de 55,26% (n = 25.040.345), para esse período. Foram identificados 53.974 partos sem informação quanto a via de parto. 

A proporção de partos cesáreos no Brasil variou bastante entre os anos de 2008 e 2023, sendo a menor proporção no primeiro ano de análise (48,4%), e a maior no último (59,7%). Em todos os anos analisados, o Brasil apresentou proporções de cesáreas acima do recomendado pela OMS.  


# Taxa bruta de natalidade

a Taxa Bruta de Natalidade é um indicador demográfico crucial que reflete o número de nascidos vivos por 1.000 habitantes em determinado período. É amplamente utilizado para entender a dinâmica populacional de uma região, país ou grupo específico, indicando a intensidade com que os nascimentos ocorrem em uma população, o que reflete a fecundidade e outros fatores que afetam a taxa de nascimento.  

A estimativa da taxa geral de natalidade, sem horizonte temporal explícito, foi calculada separadamente para os níveis regional, estadual, municipal e de região de saúde, como uma taxa média do período de 2008 a 2023. O indicador foi obtido pela razão entre a média anual de nascidos vivos e a população média do período em cada unidade territorial, multiplicada por 1.000. 

A taxa de natalidade no Brasil passou de 15,6% em 2008 para 11,2% em 2023, representando uma queda de 28,1% ao longo desses 16 anos. 
A taxa de natalidade variou entre as regiões do Brasil, sendo maior no Sudeste (93,9 nascidos vivos por mil habitantes) e menor no Centro-Oeste (18,4 nascidos vivos por mil habitantes).  

FONTES

IBGE (denominador)
População CENSO 2022
Período: 2022

SINASC (numerador)
Foram mapeados todos os nascimentos
Período: 2008 a 2023


# Taxa de baixo peso ao nascer   

A taxa de baixo peso ao nascer (definida como peso inferior a 2.500 gramas) é um importante indicador de saúde pública, reconhecido pela OMS como um reflexo das condições de saúde materno-infantil e do desenvolvimento socioeconômico de uma população. Esse indicador está associado a maiores riscos de morbimortalidade neonatal, complicações no desenvolvimento infantil e custos elevados para os sistemas de saúde. Fatores como desnutrição materna, pré-natal inadequado, infecções durante a gravidez, prematuridade e condições socioeconômicas desfavoráveis influenciam diretamente sua prevalência.  

No Brasil, monitorar essa taxa é essencial para avaliar a eficácia de políticas públicas como a Rede Cegonha e o Programa Bolsa Família, além de direcionar intervenções em regiões com piores indicadores. Valores elevados podem sinalizar falhas na assistência pré-natal ou desigualdades regionais, enquanto reduções sustentadas refletem melhorias no acesso a serviços de saúde e condições de vida da população gestante. 

Dos mais de 45 milhões de nascidos vivos no Brasil entre 2008 e 2023, a proporção de nascidos com peso inferior ao limiar de 2.500g foi de 8,6% (n = 3.904.252). Esta proporção aumentou ao longo dos anos, passando de 79,8% em 2008 para 86,9% em 2023. 


# Proporção de neonatos com adequado índice de Apgar no 1° e 5° minuto 

Este indicador expressa o percentual de nascidos vivos em que o índice de Apgar foi considerado adequado ao nascer e após 5 minutos do nascimento, i.e., maior que 7 no 1° e 5° minuto de vida.  

O índice de Apgar corresponde a uma escala para mensurar as condições de saúde do recém-nascido pela observação de 5 sinais clínicos do neonato. Os sinais avaliados são: força muscular, frequência de batimentos do coração, reflexo, respiração e cor. A somatória desses sinais gera uma nota que varia de 0 a 10. Valores menores que 7 apontam a existência de algum grau de dificuldade ou complicação, estando associado com a morte neonatal. Portanto, índices adequados indicam um bom prognóstico neonatal e a ausência de sinais que indiquem complicações. 
Proporção de neonatos com adequado índice de Apgar no 1° e 5° minuto foi de 84,6% (n = 38.380.543) entre 2008 e 2023 no Brasil. Esta proporção aumentou ao longo dos anos, passando de 79,8% em 2008 para 86,9% em 2023.


# Proporção de partos vaginais conforme o profissional que assistiu 

A proporção de partos vaginais conforme o profissional que assistiu permite identificar o perfil de assistência ao parto no Brasil, com foco na atuação dos diferentes profissionais de saúde, como médicos, enfermeiros obstetrizes ou parteiras. Ao analisar a proporção de partos vaginais de acordo com o profissional responsável, o indicador permite avaliar a implementação de modelos de atenção mais humanizados e baseados em boas práticas, que reconhecem o papel da enfermagem obstétrica na condução segura e qualificada do parto. 

A presença de enfermeiras obstétricas ou obstetrizes na assistência ao parto vaginal está associada a melhores desfechos maternos e neonatais, menor uso de intervenções desnecessárias e maior satisfação das mulheres com o cuidado recebido. Além disso, o fortalecimento desse modelo de atenção está alinhado às diretrizes da Rede Cegonha e às recomendações da Organização Mundial da Saúde, que defendem a ampliação do protagonismo da enfermagem obstétrica como estratégia para qualificar a assistência e reduzir a medicalização do parto. 

Apenas em 2013, os registros de nascimento passaram a identificar a categoria do profissional responsável pela assistência do parto no Brasil. De maneira geral, dos 13.338.941 partos vaginais ocorridos entre 2013 e 2023, a maioria (76,4%) foi assistido por médicos. A proporção de partos vaginais em que o(a) enfermeiro(a) obstetriz foi o profissional assistindo o parto aumentou ao longo dos anos, passando de 11,8% em 2013 para 28,6% em 2013. Tanto a proporção dos partos assistidos por médicos como por parteiras diminuiu.  
Conforme o peso ao nascer, observou-se que, quanto maior o peso ao nascer, maior a proporção dos partos realizados por enfermeiros(as) obstetrizes. O mesmo acontece entre as categorias de idade gestacional do nascimento.


# Taxa de obitos fetais

A taxa de óbitos fetais é um indicador fundamental para avaliar as condições de saúde materno-infantil, representando os fetos que nasceram sem sinais de vida após a 22ª semana de gestação (ou com peso ≥ 500g/estatura ≥ 25cm). Essa medida reflete fatores como a qualidade do pré-natal, assistência ao parto e condições socioeconômicas. Para comparações internacionais, a OMS recomenda a taxa de mortalidade fetal tardia, considerando apenas óbitos a partir de 28 semanas, conforme a CID-10. 

Esse indicador tem ampla aplicação na saúde pública, permitindo analisar desigualdades regionais, tendências temporais e a eficácia de políticas de atenção à gestante. Além disso, serve como parâmetro para avaliar o desenvolvimento socioeconômico e a qualidade dos serviços de saúde, especialmente em ginecologia e obstetrícia, já que agrega óbitos ocorridos antes e durante o parto. No entanto, sua precisão enfrenta desafios, como subnotificação em regiões com sistemas de informação frágeis e inconsistências no preenchimento da Declaração de Óbito, principalmente quanto à idade gestacional. 

Apesar das limitações, a proporção de óbitos fetais segue sendo uma ferramenta essencial para o planejamento e a avaliação de ações em saúde materno-infantil. Sua análise contínua ajuda a identificar populações vulneráveis e monitorar avanços na redução da mortalidade fetal, reforçando a necessidade de sistemas de registro mais robustos e padronizados para melhorar a confiabilidade dos dados. 

Número de óbitos fetais (ocorridos a partir da 22ª semana completa de gestação, ou 154 dias ou fetos com peso igual ou superior a 500g ou estatura a partir de 25cm) por mil nascimentos totais, na população residente em determinado espaço geográfico 

A taxa de óbitos fetais no brasil foi de 10,93 (n = 172.037), entre os anos de 2018 e 2023, segundo os dados disponíveis no Sistema de Informação sobre Mortalidade. O Brasil teve 10,56 como a menor taxa de óbitos fetais (2019) e 11,23 como a maior (2021).

FONTES

SIM-DOFET (numerador)
Filtros: óbitos fetais
Período: 2008 - 2023
Região: Município de óbito

SINASC (denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de nascimento


# Proporção de Tipo de Parto por Grupo de Robson 

Distribuição percentual de cada tipo de parto (vaginal ou cesariano) em cada uma das 10 categorias da Classificação de Robson no período considerado. Esse indicador serve como parâmetro para identificar possíveis distorções nas indicações desse procedimento. A classificação dos partos pelos grupos de Robson permite o mapeamento das taxas de cesariana a fim de nortear estratégias para reduzir cesáreas desnecessárias nos grupos específicos de mulheres que mais contribuem para taxa geral de cesáreas. 

Os grupos da classificação de Robson são divididos em:  

Grupo 1: Nulíparas com feto único, cefálico, ≥ 37 semanas, em trabalho de parto espontâneo; 

Grupo 2: Nulíparas com feto único, cefálico, ≥ 37 semanas, cujo parto é induzido ou que são submetidas à cesárea antes do início do trabalho de parto; 

Grupo 3: Multíparas sem cesárea anterior, com feto único, cefálico, ≥ 37 semanas, em trabalho de parto espontâneo; 

Grupo 4: Multíparas sem cesárea anterior, com feto único, cefálico, ≥ 37 semanas, cujo parto é induzido ou que são submetidas à cesárea antes do início do trabalho de parto; 

Grupo 5: Todas multíparas com pelo menos uma cesárea anterior, com feto único, cefálico, ≥ 37 semanas; 

Grupo 6: Todas nulíparas com feto único em apresentação pélvica; 

Grupo 7: Todas multíparas com feto único em apresentação pélvica, incluindo aquelas com cesárea(s) anterior(es); 

Grupo 8: Todas as mulheres com gestação múltipla, incluindo aquelas com cesárea(s) anterior(es); 

Grupo 9: Todas as gestantes com feto em situação transversa ou oblíqua, incluindo aquelas com cesárea(s) anterior(es); 

Grupo 10: Todas as gestantes com feto único e cefálico, < 37 semanas, incluindo aquelas com cesárea(s) anterior(es). 


# Proporção de Gestantes com o Pré-natal adequado 

O indicador "Gestantes com Pré-Natal Adequado" avalia a qualidade do acompanhamento pré-natal, considerando não apenas o número mínimo de consultas, mas também o momento de início. Além de garantir o mínimo de consultas recomendadas pela OMS, é fundamental que o pré-natal comece ainda no primeiro trimestre da gestação, preferencialmente até a 12ª semana, para que ações preventivas e diagnósticos possam ser realizados em tempo hábil. 

Alinhado aos Objetivos de Desenvolvimento Sustentável (ODS) e às políticas nacionais como a Rede Cegonha, esse indicador reflete a efetividade do sistema de saúde na promoção de cuidados integrais. A adequação do pré-natal está diretamente ligada à redução da mortalidade materna e neonatal, destacando a importância de estratégias como busca ativa de gestantes, educação em saúde e fortalecimento da atenção primária. Monitorar esse indicador permite identificar lacunas no acesso e na qualidade do serviço, direcionando ações para garantir que todas as mulheres, especialmente as mais vulneráveis, recebam um acompanhamento oportuno e de qualidade. 

A proporção de gestantes que tiveram o pré-natal adequado no Brasil foi de 52,6% (n = 23.919.619), entre os anos de 2008 e 2023. 

Brasil ao longo dos anos 

O número de consultas e início do pré-natal não estão informados para os anos de 2008 e 2009, por isso a proporção de gestantes com pré-natal adequado no Brasil passou de 0% no ano de 2008 a 75,5% no ano de 2023. O ano de 2011 foi o ano com o aumento mais expressivo na proporção de adequação do pré-natal (29,71 pontos percentuais (p.p.) - um aumento de cerca de 2.500% em relação ao ano de 2010. No ano de 2011 foi instituída, no âmbito do Sistema Único de Saúde, a Rede Cegonha (Portaria Nº 1.459, de 24 de junho de 2011), que teve como objetivo organizar a Rede de Atenção à Saúde Materna e Infantil.  

FONTES

SINASC (numerador e denominador)
Nascidos vivos
Filtros: -
Período: 2008 - 2023
Região: Município de nascimento