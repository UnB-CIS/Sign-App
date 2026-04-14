import { Module } from './types';

export const MODULES: Module[] = [
  {
    id: 'mod-1',
    title: 'Saudações',
    description: 'Aprenda os sinais básicos de saudações em Libras.',
    objective: 'Comunicar cumprimentos e apresentações simples.',
    order: 1,
    iconName: 'hand-wave',
    lessons: [
      {
        id: 'les-1-1',
        title: 'Olá e Tchau',
        description: 'Sinais para cumprimentar e se despedir.',
        order: 1,
        xpReward: 50,
        vocabulary: [
          { id: 'v-1-1-1', word: 'Olá', translation: 'Sinal de saudação com a mão aberta' },
          { id: 'v-1-1-2', word: 'Tchau', translation: 'Sinal de despedida acenando a mão' },
          { id: 'v-1-1-3', word: 'Bom dia', translation: 'Sinal combinado de bom + dia' },
          { id: 'v-1-1-4', word: 'Boa noite', translation: 'Sinal combinado de bom + noite' },
        ],
        expressions: [
          'Olá, tudo bem?',
          'Bom dia!',
          'Boa noite!',
          'Tchau, até amanhã!',
        ],
        grammar: [
          {
            id: 'g-1-1-1',
            title: 'Ordem das palavras em Libras',
            explanation: 'Em Libras, a ordem é geralmente Sujeito-Verbo-Objeto (SVO), mas pode variar com topicalização.',
            examples: ['EU GOSTAR VOCÊ (Eu gosto de você)', 'VOCÊ BEM? (Você está bem?)'],
          },
        ],
        activities: [
          {
            id: 'act-1-1-1',
            type: 'quiz',
            title: 'Quiz: Saudações',
            description: 'Teste seu conhecimento sobre saudações.',
            questions: [
              {
                id: 'q-1-1-1',
                type: 'multiple_choice',
                prompt: 'Qual é o sinal de "Olá" em Libras?',
                options: ['Mão aberta acenando', 'Punho fechado', 'Mão em formato de C', 'Dedo indicador levantado'],
                correctAnswer: 'Mão aberta acenando',
              },
              {
                id: 'q-1-1-2',
                type: 'multiple_choice',
                prompt: 'Como se diz "Bom dia" em Libras?',
                options: ['Sinal de bom + sinal de dia', 'Apenas acenar', 'Bater palmas', 'Sinal de sol'],
                correctAnswer: 'Sinal de bom + sinal de dia',
              },
              {
                id: 'q-1-1-3',
                type: 'multiple_choice',
                prompt: 'Assista ao vídeo e escolha qual palavra está sendo sinalizada.',
                targetWord: 'Olá',
                url_video: 'https://example.com/videos/libras/ola.mp4',
                options: ['Olá', 'Tchau', 'Bom dia', 'Boa noite'],
                correctAnswer: 'Olá',
              },
              {
                id: 'q-1-1-4',
                type: 'video_record',
                prompt: 'Assista ao vídeo de referência e depois repita o sinal.',
                targetWord: 'Tchau',
                url_video: 'https://example.com/videos/libras/tchau-modelo.mp4',
                instruction: 'Observe o movimento da mão e grave sua repetição do sinal.',
              },
            ],
          },
        ],
      },
      {
        id: 'les-1-2',
        title: 'Apresentações Pessoais',
        description: 'Aprenda a se apresentar em Libras.',
        order: 2,
        xpReward: 60,
        vocabulary: [
          { id: 'v-1-2-1', word: 'Meu nome', translation: 'Sinal de posse + sinal de nome' },
          { id: 'v-1-2-2', word: 'Prazer', translation: 'Sinal de prazer em conhecer' },
          { id: 'v-1-2-3', word: 'Eu', translation: 'Apontar para si mesmo' },
          { id: 'v-1-2-4', word: 'Você', translation: 'Apontar para o interlocutor' },
        ],
        expressions: [
          'Meu nome é...',
          'Prazer em conhecer você!',
          'Eu sou surdo/ouvinte.',
          'De onde você é?',
        ],
        grammar: [
          {
            id: 'g-1-2-1',
            title: 'Pronomes pessoais em Libras',
            explanation: 'Pronomes em Libras são representados por apontamento. EU = apontar para si; VOCÊ = apontar para o outro.',
            examples: ['EU NOME F-E-L-I-P-E (Meu nome é Felipe)', 'VOCÊ SURDO? (Você é surdo?)'],
          },
        ],
        activities: [
          {
            id: 'act-1-2-1',
            type: 'practice',
            title: 'Prática: Apresentações',
            description: 'Pratique os sinais de apresentação.',
            questions: [
              {
                id: 'q-1-2-1',
                type: 'video_record',
                prompt: 'Grave um vídeo se apresentando em Libras.',
              },
              {
                id: 'q-1-2-2',
                type: 'multiple_choice',
                prompt: 'Qual sinal representa "Eu" em Libras?',
                options: ['Apontar para si', 'Apontar para cima', 'Fechar a mão', 'Abrir as duas mãos'],
                correctAnswer: 'Apontar para si',
              },
              {
                id: 'q-1-2-3',
                type: 'multiple_choice_video',
                prompt: 'Qual vídeo mostra corretamente o sinal da palavra abaixo?',
                targetWord: 'Prazer',
                url_videos: [
                  'https://example.com/videos/libras/prazer-opcao-a.mp4',
                  'https://example.com/videos/libras/prazer-opcao-b.mp4',
                  'https://example.com/videos/libras/prazer-opcao-c.mp4',
                  'https://example.com/videos/libras/prazer-opcao-d.mp4',
                ],
                correctAnswer: 'https://example.com/videos/libras/prazer-opcao-b.mp4',
              },
              {
                id: 'q-1-2-4',
                type: 'video_record',
                prompt: 'Veja a palavra e grave o sinal correspondente.',
                targetWord: 'Meu nome',
                instruction: 'Grave sua execução do sinal sem vídeo de apoio.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mod-2',
    title: 'Alimentos',
    description: 'Sinais de alimentos e bebidas comuns.',
    objective: 'Identificar e sinalizar alimentos e bebidas do dia a dia.',
    order: 2,
    iconName: 'food-apple',
    lessons: [
      {
        id: 'les-2-1',
        title: 'Frutas e Verduras',
        description: 'Aprenda os sinais de frutas e verduras.',
        order: 1,
        xpReward: 50,
        vocabulary: [
          { id: 'v-2-1-1', word: 'Maçã', translation: 'Sinal de maçã: mão em forma de garra na bochecha' },
          { id: 'v-2-1-2', word: 'Banana', translation: 'Sinal de banana: descascar com as mãos' },
          { id: 'v-2-1-3', word: 'Laranja', translation: 'Sinal de laranja: espremer na boca' },
          { id: 'v-2-1-4', word: 'Alface', translation: 'Sinal de alface: folhas ao redor da cabeça' },
        ],
        expressions: [
          'Eu gosto de maçã.',
          'Você quer banana?',
          'Eu como frutas todos os dias.',
        ],
        grammar: [
          {
            id: 'g-2-1-1',
            title: 'Classificadores de forma',
            explanation: 'Classificadores em Libras descrevem a forma e o tamanho dos objetos usando configurações de mão específicas.',
            examples: ['CL: redondo (para frutas)', 'CL: fino/longo (para banana)'],
          },
        ],
        activities: [
          {
            id: 'act-2-1-1',
            type: 'quiz',
            title: 'Quiz: Frutas',
            description: 'Identifique os sinais de frutas.',
            questions: [
              {
                id: 'q-2-1-1',
                type: 'multiple_choice',
                prompt: 'Qual fruta tem o sinal de "espremer na boca"?',
                options: ['Laranja', 'Maçã', 'Banana', 'Uva'],
                correctAnswer: 'Laranja',
              },
            ],
          },
        ],
      },
      {
        id: 'les-2-2',
        title: 'Bebidas',
        description: 'Sinais de bebidas comuns.',
        order: 2,
        xpReward: 50,
        vocabulary: [
          { id: 'v-2-2-1', word: 'Água', translation: 'Sinal de água: mão em W tocando o queixo' },
          { id: 'v-2-2-2', word: 'Café', translation: 'Sinal de café: moer com as mãos' },
          { id: 'v-2-2-3', word: 'Suco', translation: 'Sinal de suco: espremer + beber' },
          { id: 'v-2-2-4', word: 'Leite', translation: 'Sinal de leite: ordenhar' },
        ],
        expressions: [
          'Eu quero água.',
          'Você quer café?',
          'Eu bebo suco de laranja.',
        ],
        grammar: [
          {
            id: 'g-2-2-1',
            title: 'Verbos de ação com incorporação',
            explanation: 'Alguns verbos em Libras incorporam o objeto na ação, como "beber café" que pode ser um único sinal.',
            examples: ['BEBER-CAFÉ (um sinal)', 'COMER-MAÇÃ (um sinal)'],
          },
        ],
        activities: [
          {
            id: 'act-2-2-1',
            type: 'quiz',
            title: 'Quiz: Bebidas',
            description: 'Teste seus conhecimentos sobre bebidas.',
            questions: [
              {
                id: 'q-2-2-1',
                type: 'multiple_choice',
                prompt: 'Como é o sinal de "Água" em Libras?',
                options: ['Mão em W tocando o queixo', 'Beber de um copo', 'Mão aberta na boca', 'Dois dedos na boca'],
                correctAnswer: 'Mão em W tocando o queixo',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mod-3',
    title: 'Números',
    description: 'Aprenda a sinalizar números em Libras.',
    objective: 'Contar e usar números em contextos cotidianos.',
    order: 3,
    iconName: 'numeric',
    lessons: [
      {
        id: 'les-3-1',
        title: 'Números de 1 a 10',
        description: 'Sinais dos números básicos.',
        order: 1,
        xpReward: 50,
        vocabulary: [
          { id: 'v-3-1-1', word: '1 (Um)', translation: 'Dedo indicador levantado' },
          { id: 'v-3-1-2', word: '2 (Dois)', translation: 'Indicador e médio levantados' },
          { id: 'v-3-1-3', word: '5 (Cinco)', translation: 'Mão aberta com todos os dedos' },
          { id: 'v-3-1-4', word: '10 (Dez)', translation: 'Mãos abertas balançando' },
        ],
        expressions: [
          'Eu tenho 5 anos.',
          'São 3 horas.',
          'Eu quero 2, por favor.',
        ],
        grammar: [
          {
            id: 'g-3-1-1',
            title: 'Incorporação de número',
            explanation: 'Em Libras, números podem ser incorporados a outros sinais, como idade e horas.',
            examples: ['IDADE-5 (tenho 5 anos)', 'HORA-3 (são 3 horas)'],
          },
        ],
        activities: [
          {
            id: 'act-3-1-1',
            type: 'quiz',
            title: 'Quiz: Números',
            description: 'Identifique os números em Libras.',
            questions: [
              {
                id: 'q-3-1-1',
                type: 'multiple_choice',
                prompt: 'Quantos dedos são levantados para o número 5?',
                options: ['Todos (mão aberta)', 'Três', 'Dois', 'Quatro'],
                correctAnswer: 'Todos (mão aberta)',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mod-4',
    title: 'Família',
    description: 'Sinais relacionados a membros da família.',
    objective: 'Falar sobre sua família em Libras.',
    order: 4,
    iconName: 'account-group',
    lessons: [
      {
        id: 'les-4-1',
        title: 'Pais e Irmãos',
        description: 'Aprenda os sinais de pai, mãe, irmão e irmã.',
        order: 1,
        xpReward: 50,
        vocabulary: [
          { id: 'v-4-1-1', word: 'Pai', translation: 'Sinal de pai: polegar na testa' },
          { id: 'v-4-1-2', word: 'Mãe', translation: 'Sinal de mãe: polegar no queixo' },
          { id: 'v-4-1-3', word: 'Irmão', translation: 'Sinal de irmão: indicadores paralelos' },
          { id: 'v-4-1-4', word: 'Irmã', translation: 'Sinal de irmã: indicadores cruzados' },
        ],
        expressions: [
          'Meu pai é professor.',
          'Eu tenho dois irmãos.',
          'Minha mãe é surda.',
        ],
        grammar: [
          {
            id: 'g-4-1-1',
            title: 'Posse em Libras',
            explanation: 'A posse em Libras é indicada por apontamento ou pelo sinal possessivo antes do substantivo.',
            examples: ['MEU PAI (apontar para si + pai)', 'SEU IRMÃO (apontar para outro + irmão)'],
          },
        ],
        activities: [
          {
            id: 'act-4-1-1',
            type: 'quiz',
            title: 'Quiz: Família',
            description: 'Teste seu conhecimento sobre sinais de família.',
            questions: [
              {
                id: 'q-4-1-1',
                type: 'multiple_choice',
                prompt: 'Onde se posiciona o polegar para o sinal de "Mãe"?',
                options: ['No queixo', 'Na testa', 'No nariz', 'Na orelha'],
                correctAnswer: 'No queixo',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mod-5',
    title: 'Cores',
    description: 'Aprenda os sinais das cores em Libras.',
    objective: 'Identificar e sinalizar cores.',
    order: 5,
    iconName: 'palette',
    lessons: [
      {
        id: 'les-5-1',
        title: 'Cores Básicas',
        description: 'Sinais das cores primárias e secundárias.',
        order: 1,
        xpReward: 50,
        vocabulary: [
          { id: 'v-5-1-1', word: 'Vermelho', translation: 'Sinal de vermelho: dedo nos lábios deslizando' },
          { id: 'v-5-1-2', word: 'Azul', translation: 'Sinal de azul: mão em B balançando' },
          { id: 'v-5-1-3', word: 'Amarelo', translation: 'Sinal de amarelo: mão em Y balançando' },
          { id: 'v-5-1-4', word: 'Verde', translation: 'Sinal de verde: mão em V balançando' },
        ],
        expressions: [
          'Minha cor favorita é azul.',
          'O semáforo está vermelho.',
          'A grama é verde.',
        ],
        grammar: [
          {
            id: 'g-5-1-1',
            title: 'Adjetivos em Libras',
            explanation: 'Em Libras, o adjetivo geralmente vem depois do substantivo.',
            examples: ['CARRO VERMELHO (carro vermelho)', 'CÉU AZUL (céu azul)'],
          },
        ],
        activities: [
          {
            id: 'act-5-1-1',
            type: 'quiz',
            title: 'Quiz: Cores',
            description: 'Identifique as cores em Libras.',
            questions: [
              {
                id: 'q-5-1-1',
                type: 'multiple_choice',
                prompt: 'Qual configuração de mão é usada para "Amarelo"?',
                options: ['Mão em Y', 'Mão em A', 'Mão em B', 'Mão em V'],
                correctAnswer: 'Mão em Y',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mod-6',
    title: 'Dias e Tempo',
    description: 'Sinais para dias da semana e expressões de tempo.',
    objective: 'Comunicar sobre datas e horários em Libras.',
    order: 6,
    iconName: 'calendar-clock',
    lessons: [
      {
        id: 'les-6-1',
        title: 'Dias da Semana',
        description: 'Aprenda os sinais dos dias da semana.',
        order: 1,
        xpReward: 50,
        vocabulary: [
          { id: 'v-6-1-1', word: 'Segunda-feira', translation: 'Sinal de segunda: número 2 + feira' },
          { id: 'v-6-1-2', word: 'Terça-feira', translation: 'Sinal de terça: número 3 + feira' },
          { id: 'v-6-1-3', word: 'Sábado', translation: 'Sinal de sábado: S em movimento circular' },
          { id: 'v-6-1-4', word: 'Domingo', translation: 'Sinal de domingo: D em movimento circular' },
        ],
        expressions: [
          'Hoje é segunda-feira.',
          'Amanhã é sábado.',
          'A aula é na quarta.',
        ],
        grammar: [
          {
            id: 'g-6-1-1',
            title: 'Linha do tempo em Libras',
            explanation: 'Em Libras, o tempo é representado espacialmente: passado atrás do ombro, presente na frente do corpo, futuro para a frente.',
            examples: ['ONTEM (mão para trás)', 'AMANHÃ (mão para frente)', 'HOJE (mãos para baixo)'],
          },
        ],
        activities: [
          {
            id: 'act-6-1-1',
            type: 'quiz',
            title: 'Quiz: Dias da Semana',
            description: 'Teste seu conhecimento sobre dias da semana.',
            questions: [
              {
                id: 'q-6-1-1',
                type: 'multiple_choice',
                prompt: 'Como é formado o sinal de "Terça-feira"?',
                options: ['Número 3 + feira', 'Número 2 + feira', 'Letra T + feira', 'Número 4 + feira'],
                correctAnswer: 'Número 3 + feira',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mod-7',
    title: 'Verbos Cotidianos',
    description: 'Sinais de verbos usados no dia a dia.',
    objective: 'Usar verbos comuns para formar frases em Libras.',
    order: 7,
    iconName: 'run',
    lessons: [
      {
        id: 'les-7-1',
        title: 'Ações Básicas',
        description: 'Aprenda verbos como comer, beber, dormir e estudar.',
        order: 1,
        xpReward: 60,
        vocabulary: [
          { id: 'v-7-1-1', word: 'Comer', translation: 'Sinal de comer: mão levando comida à boca' },
          { id: 'v-7-1-2', word: 'Beber', translation: 'Sinal de beber: copo indo à boca' },
          { id: 'v-7-1-3', word: 'Dormir', translation: 'Sinal de dormir: mão ao lado da cabeça inclinada' },
          { id: 'v-7-1-4', word: 'Estudar', translation: 'Sinal de estudar: livro aberto nas mãos' },
        ],
        expressions: [
          'Eu como arroz todos os dias.',
          'Ela dorme cedo.',
          'Nós estudamos Libras.',
        ],
        grammar: [
          {
            id: 'g-7-1-1',
            title: 'Verbos direcionais',
            explanation: 'Alguns verbos em Libras mudam de direção para indicar quem realiza a ação e quem a recebe.',
            examples: ['EU-DAR-VOCÊ (eu dou para você)', 'VOCÊ-PERGUNTAR-EU (você me pergunta)'],
          },
        ],
        activities: [
          {
            id: 'act-7-1-1',
            type: 'quiz',
            title: 'Quiz: Verbos',
            description: 'Teste seu conhecimento sobre verbos em Libras.',
            questions: [
              {
                id: 'q-7-1-1',
                type: 'multiple_choice',
                prompt: 'Qual sinal representa "Dormir"?',
                options: ['Mão ao lado da cabeça inclinada', 'Olhos fechados com as mãos', 'Mãos cruzadas no peito', 'Bocejar com a mão'],
                correctAnswer: 'Mão ao lado da cabeça inclinada',
              },
              {
                id: 'q-7-1-2',
                type: 'video_record',
                prompt: 'Grave o sinal de "Estudar" em Libras.',
              },
            ],
          },
        ],
      },
    ],
  },
];
