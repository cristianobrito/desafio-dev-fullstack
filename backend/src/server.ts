import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API NewSun rodando 🚀" });
});

app.post("/simulacoes", async (req, res) => {
  try {
    const { nomeCompleto, email, telefone, unidades } = req.body;

    // 🔎 Regras básicas
    if (!nomeCompleto || !email || !telefone) {
      return res.status(400).json({ error: "Dados do lead incompletos" });
    }

    if (!unidades || !Array.isArray(unidades) || unidades.length === 0) {
      return res.status(400).json({ error: "Lead deve ter ao menos 1 unidade" });
    }

    for (const unidade of unidades) {
      if (!unidade.historicoDeConsumoEmKWH || unidade.historicoDeConsumoEmKWH.length !== 12) {
        return res.status(400).json({
          error: "Cada unidade deve ter exatamente 12 meses de consumo",
        });
      }
    }

    const lead = await prisma.lead.create({
      data: {
        nomeCompleto,
        email,
        telefone,
        unidades: {
          create: unidades.map((unidade: any) => ({
            codigoDaUnidadeConsumidora: unidade.codigoDaUnidadeConsumidora,
            modeloFasico: unidade.modeloFasico,
            enquadramento: unidade.enquadramento,
            historicoDeConsumoEmKWH: {
              create: unidade.historicoDeConsumoEmKWH.map((consumo: any) => ({
                consumoForaPontaEmKWH: consumo.consumoForaPontaEmKWH,
                mesDoConsumo: new Date(consumo.mesDoConsumo),
              })),
            },
          })),
        },
      },
      include: {
        unidades: {
          include: {
            historicoDeConsumoEmKWH: true,
          },
        },
      },
    });

    return res.status(201).json(lead);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: "Erro ao criar simulação" });
  }
});


// get geral com filtros
app.get("/simulacoes", async (req, res) => {
  try {
    const { nomeCompleto, email, codigoDaUnidadeConsumidora } = req.query;

    const leads = await prisma.lead.findMany({
      where: {
        AND: [
          nomeCompleto
            ? {
                nomeCompleto: {
                  contains: String(nomeCompleto),
                },
              }
            : {},
          email
            ? {
                email: {
                  contains: String(email),
                },
              }
            : {},
          codigoDaUnidadeConsumidora
            ? {
                unidades: {
                  some: {
                    codigoDaUnidadeConsumidora: String(
                      codigoDaUnidadeConsumidora
                    ),
                  },
                },
              }
            : {},
        ],
      },
      include: {
        unidades: {
          include: {
            historicoDeConsumoEmKWH: true,
          },
        },
      },
    });

    return res.json(leads);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "Erro ao listar simulações",
    });
  }
});



app.get("/simulacoes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        unidades: {
          include: {
            historicoDeConsumoEmKWH: true,
          },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({
        error: "Simulação não encontrada",
      });
    }

    return res.json(lead);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "Erro ao buscar simulação",
    });
  }
});


app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
