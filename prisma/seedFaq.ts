import "dotenv/config";
import { prisma } from "../src/database/prisma";

const faqs = [
  {
    question: "Por que ainda consigo me ver?",
    category: "Uso do Produto",
    answer:
      "Isso geralmente acontece porque você ainda não vestiu a capa. Caso já esteja usando, verifique se ela não está do avesso. A etiqueta deve ficar... bom, você não vai conseguir encontrá-la.",
  },
  {
    question: "Funciona em espelhos?",
    category: "Tecnologia",
    answer:
      "Sim! A capa foi projetada para esconder você de espelhos, câmeras e daquele amigo que insiste em tirar fotos sem avisar. Apenas evite fazer caretas para o espelho: ele ficará confuso.",
  },
  {
    question: "Meu gato consegue me enxergar?",
    category: "Compatibilidade",
    answer:
      "Infelizmente, os gatos seguem regras próprias do universo. Embora a capa seja invisível para humanos, felinos continuam agindo como se soubessem exatamente onde você está. Não garantimos eficácia contra olhares julgadores.",
  },
  {
    question: "A invisibilidade funciona no escuro?",
    category: "Funcionamento",
    answer:
      "Sim. Você ficará duas vezes invisível: pela capa e pela falta de luz. É o equivalente tecnológico de colocar óculos escuros à noite, só que faz sentido.",
  },
  {
    question: "Posso pedir reembolso se fui visto?",
    category: "Garantia",
    answer:
      "Claro! Basta apresentar uma foto nítida de você usando a capa enquanto era visto. Até hoje ninguém conseguiu enviar essa prova, então nossa taxa de satisfação continua em 100%.",
  },
  {
    question: "A capa precisa lavar?",
    category: "Manutenção",
    answer:
      'Recomendamos lavar apenas quando você tiver certeza de que ela ainda está no cabide. O ciclo "delicado" é invisivelmente eficiente.',
  },
  {
    question: "Ela amassa?",
    category: "Cuidados",
    answer: "Sim, mas ninguém vai perceber. Inclusive, você também não.",
  },
  {
    question: "Tem garantia?",
    category: "Garantia",
    answer:
      "Oferecemos garantia vitalícia contra defeitos visíveis. Se encontrar algum, entre em contato imediatamente.",
  },
  {
    question: "Posso emprestar para um amigo?",
    category: "Uso Compartilhado",
    answer:
      "Pode, mas recomendamos colocar uma etiqueta com o nome dele. Depois será difícil provar que ele devolveu.",
  },
  {
    question: "Como sei que a capa chegou?",
    category: "Entrega",
    answer:
      "A caixa vem aparentemente vazia. Não se preocupe: o produto já está trabalhando desde a entrega. Evite jogar a embalagem fora sem conferir.",
  },
  {
    question: "Ela funciona em animais?",
    category: "Compatibilidade",
    answer:
      "Sim, mas convencer um cachorro a usar uma capa continua sendo o maior desafio da engenharia moderna.",
  },
  {
    question: "A bateria dura quanto tempo?",
    category: "Especificações Técnicas",
    answer:
      "Excelente notícia: ela não usa bateria. A invisibilidade é alimentada por tecnologia de ficção científica de última geração.",
  },
  {
    question: "Posso usar em entrevistas de emprego?",
    category: "Casos de Uso",
    answer:
      "Pode, mas não recomendamos. Os recrutadores costumam preferir candidatos que compareçam visualmente.",
  },
  {
    question: "Ela protege contra chuva?",
    category: "Resistência",
    answer:
      "Sim. Você ficará invisível e molhado ao mesmo tempo. Ainda estamos trabalhando na versão impermeável.",
  },
  {
    question: "Existe versão infantil?",
    category: "Produtos",
    answer:
      "Sim! A linha Invis Kids™ é perfeita para crianças que juram que já estavam escondidas antes mesmo de vestir a capa.",
  },
  {
    question: "Vocês vendem em outras cores?",
    category: "Produtos",
    answer:
      "Claro! Temos Preto Invisível, Branco Invisível, Roxo Invisível e Transparente Invisível. Na prática, todas parecem exatamente iguais.",
  },
  {
    question: "Posso usar para entrar de graça em eventos?",
    category: "Política de Uso",
    answer:
      "Não. Nossa capa foi desenvolvida para entretenimento e espionagem de geladeiras durante a madrugada. O uso para atividades ilegais viola nossos Termos de Invisibilidade.",
  },
  {
    question: "A capa funciona em chamadas de vídeo?",
    category: "Compatibilidade",
    answer:
      "Sim, mas seus colegas provavelmente vão achar que você esqueceu de ligar a câmera.",
  },
  {
    question: "Por que não consigo encontrar minha capa?",
    category: "Suporte",
    answer:
      "Essa é, de longe, a dúvida mais frequente. Recomendamos começar procurando no cabide onde você a deixou. Se não funcionar, tente lembrar que ela é invisível.",
  },
  {
    question: "Vocês aceitam devolução?",
    category: "Garantia",
    answer:
      "Sim. Basta enviar o produto de volta. Se a caixa chegar vazia, assumiremos que a capa está lá dentro e iniciaremos a análise normalmente.",
  },
];

async function main() {
  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { question: faq.question },
      update: { answer: faq.answer, category: faq.category },
      create: faq,
    });
  }

  console.log(`FAQ populado: ${faqs.length} perguntas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
