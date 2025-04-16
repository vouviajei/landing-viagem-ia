import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { destino, dias, pessoas, orcamento, estilo } = req.body;

  const prompt = `Crie um roteiro de viagem para ${pessoas} pessoa(s) em ${destino} por ${dias} dia(s), com um orçamento total de R$${orcamento}. O estilo da viagem é ${estilo || 'não especificado'}. O roteiro deve incluir sugestões de passeios diários, refeições e equilíbrio de custos.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um assistente de viagem que monta roteiros personalizados.' },
        { role: 'user', content: prompt }
      ]
    });

    const roteiro = completion.choices[0].message.content;
    res.status(200).json({ roteiro });
  } catch (error) {
    console.error('Erro ao gerar roteiro:', error);
    res.status(500).json({ error: 'Erro ao gerar roteiro com IA.' });
  }
}
