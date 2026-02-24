import { Biomarker } from '../types/biomarker'

export const biomarkersData: Biomarker[] = [
  {
    id: 'vitamin_d', name: 'Vitamina D (25-OH)', category: 'nutrition',
    value: 32, unit: 'ng/mL', referenceMin: 20, referenceMax: 100,
    optimalMin: 50, optimalMax: 80, status: 'yellow', statusLabel: 'Atenção',
    whatIs: 'Hormônio esteróide essencial para imunidade, saúde óssea, humor e função cardiovascular. Mais de 70% dos brasileiros têm deficiência.',
    whyMatters: 'Níveis abaixo de 50 ng/mL estão associados a maior risco de doenças autoimunes, depressão e declínio cognitivo.',
    whatToDo: [
      'Considere suplementação de D3 (2000–5000 UI/dia) com orientação médica.',
      'Exponha-se ao sol por 20–30 min diariamente (braços e pernas).',
      'Repita o exame em 90 dias após iniciar suplementação.'
    ]
  },
  {
    id: 'glucose', name: 'Glicose em Jejum', category: 'metabolic',
    value: 85, unit: 'mg/dL', referenceMin: 70, referenceMax: 99,
    optimalMin: 72, optimalMax: 90, status: 'green', statusLabel: 'Otimizado',
    whatIs: 'Principal fonte de energia do organismo. A glicose em jejum reflete o metabolismo da insulina.',
    whyMatters: 'Níveis elevados cronicamente levam à resistência insulínica, diabetes tipo 2 e inflamação sistêmica.',
    whatToDo: [
      'Mantenha o padrão atual: exercício regular e dieta com baixo índice glicêmico.',
      'Evite jejuns prolongados (>16h) que podem elevar a glicose por estresse cortisólico.'
    ]
  },
  {
    id: 'testosterone', name: 'Testosterona Total', category: 'hormones',
    value: 400, unit: 'ng/dL', referenceMin: 270, referenceMax: 1070,
    optimalMin: 600, optimalMax: 900, status: 'yellow', statusLabel: 'Atenção',
    whatIs: 'Principal hormônio androgênico, essencial para massa muscular, libido, energia, cognição e saúde cardiovascular.',
    whyMatters: 'Níveis abaixo de 600 ng/dL estão associados a fadiga, perda muscular, aumento de gordura visceral e risco cardiovascular.',
    whatToDo: [
      'Priorize sono de qualidade (7–9h): 80% da testosterona é produzida durante o sono.',
      'Treinamento de força 3–4x/semana estimula produção natural.',
      'Verifique Zinco e Vitamina D — cofatores essenciais.'
    ]
  },
  {
    id: 'crp', name: 'PCR (Proteína C Reativa)', category: 'inflammation',
    value: 3.0, unit: 'mg/L', referenceMin: 0, referenceMax: 5,
    optimalMin: 0, optimalMax: 1, status: 'red', statusLabel: 'Alerta',
    whatIs: 'Marcador de inflamação sistêmica produzido pelo fígado em resposta a lesão ou infecção.',
    whyMatters: 'PCR acima de 1 mg/L dobra o risco cardiovascular. Acima de 3 mg/L é considerado alto risco.',
    whatToDo: [
      'Investigue a causa: infecção, dieta inflamatória, sedentarismo ou estresse crônico.',
      'Aumente consumo de Ômega-3 (peixes gordurosos, 3x/semana).',
      'Reduza alimentos ultraprocessados, açúcar e álcool.',
      'Consulte seu médico para descartar causas infecciosas.'
    ]
  },
  {
    id: 'ldl', name: 'Colesterol LDL', category: 'metabolic',
    value: 110, unit: 'mg/dL', referenceMin: 0, referenceMax: 130,
    optimalMin: 0, optimalMax: 90, status: 'yellow', statusLabel: 'Atenção',
    whatIs: 'Lipoproteína que transporta colesterol. Níveis altos acumulam-se nas artérias, formando placas ateroscleróticas.',
    whyMatters: 'Para longevidade, o ideal é LDL abaixo de 90 mg/dL. O ApoB é o preditor mais preciso de risco cardiovascular.',
    whatToDo: [
      'Reduza gorduras saturadas e trans.',
      'Aumente fibras solúveis (aveia, leguminosas).',
      'Exercício aeróbico regular eleva o HDL protetor.'
    ]
  },
  {
    id: 'ferritin', name: 'Ferritina', category: 'nutrition',
    value: 18, unit: 'ng/mL', referenceMin: 13, referenceMax: 150,
    optimalMin: 50, optimalMax: 120, status: 'yellow', statusLabel: 'Atenção',
    whatIs: 'Proteína de armazenamento de ferro. Ferritina baixa precede a anemia e compromete energia e imunidade.',
    whyMatters: 'Ferritina abaixo de 30 ng/mL pode causar fadiga, queda de cabelo, baixa imunidade e comprometimento cognitivo.',
    whatToDo: [
      'Aumente consumo de carnes vermelhas, fígado e leguminosas.',
      'Combine ferro não-heme com vitamina C para melhor absorção.',
      'Evite chá e café junto às refeições ricas em ferro.'
    ]
  },
  {
    id: 'hba1c', name: 'Hemoglobina Glicada (HbA1c)', category: 'metabolic',
    value: 5.3, unit: '%', referenceMin: 4.0, referenceMax: 5.6,
    optimalMin: 4.6, optimalMax: 5.3, status: 'green', statusLabel: 'Otimizado',
    whatIs: 'Reflete a média da glicose nos últimos 90 dias. É o padrão-ouro para monitoramento do controle glicêmico.',
    whyMatters: 'HbA1c abaixo de 5.3% indica excelente controle metabólico e baixo risco de desenvolver diabetes.',
    whatToDo: [
      'Mantenha o padrão alimentar atual.',
      'Continue monitorando a cada 6 meses.'
    ]
  },
  {
    id: 'tsh', name: 'TSH (Tireoide)', category: 'hormones',
    value: 0.4, unit: 'µUI/mL', referenceMin: 0.4, referenceMax: 4.0,
    optimalMin: 1.0, optimalMax: 2.5, status: 'red', statusLabel: 'Alerta',
    whatIs: 'Hormônio estimulador da tireoide. TSH muito baixo indica que a glândula está superativa (hipertireoidismo).',
    whyMatters: 'TSH abaixo de 1.0 pode indicar hipertireoidismo subclínico, associado a arritmias e perda óssea acelerada.',
    whatToDo: [
      'Solicite T4 Livre e T3 para confirmação diagnóstica.',
      'Consulte endocrinologista com urgência.',
      'Evite suplementos de iodo sem prescrição médica.'
    ]
  },
  {
    id: 'vitamin_b12', name: 'Vitamina B12', category: 'nutrition',
    value: 420, unit: 'pg/mL', referenceMin: 200, referenceMax: 900,
    optimalMin: 500, optimalMax: 900, status: 'yellow', statusLabel: 'Atenção',
    whatIs: 'Vitamina essencial para produção de glóbulos vermelhos, síntese de DNA e função neurológica.',
    whyMatters: 'Níveis abaixo de 500 pg/mL estão associados a fadiga, neuropatia e comprometimento cognitivo.',
    whatToDo: [
      'Aumente consumo de carnes, ovos e laticínios.',
      'Veganos devem suplementar com B12 cianocobalamina.',
      'Se usa metformina, monitore B12 regularmente.'
    ]
  },
  {
    id: 'homocysteine', name: 'Homocisteína', category: 'inflammation',
    value: 12, unit: 'µmol/L', referenceMin: 0, referenceMax: 15,
    optimalMin: 0, optimalMax: 9, status: 'yellow', statusLabel: 'Atenção',
    whatIs: 'Aminoácido inflamatório produzido no metabolismo da metionina. Marcador de risco cardiovascular e cognitivo.',
    whyMatters: 'Homocisteína acima de 10 µmol/L dobra o risco de AVC e está associada ao Alzheimer.',
    whatToDo: [
      'Suplemente B12, B6 e Folato (B9) — principais reguladores da homocisteína.',
      'Reduza consumo de carnes processadas e álcool.',
      'Repita o exame em 3 meses após suplementação.'
    ]
  },
]
