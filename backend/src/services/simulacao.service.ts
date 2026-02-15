import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class SimulacaoService {
  async criarSimulacao(data: any) {
    const { nomeCompleto, email, telefone, unidades } = data

    if (!unidades || unidades.length === 0) {
      throw new Error("Um lead deve ter no mínimo 1 unidade.")
    }

    for (const unidade of unidades) {
      if (unidade.historicoDeConsumoEmKWH.length !== 12) {
        throw new Error(
          `A unidade ${unidade.codigoDaUnidadeConsumidora} precisa ter 12 meses de histórico.`
        )
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
              create: unidade.historicoDeConsumoEmKWH,
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
    })

    return lead
  }

//   async listarSimulacoes(filtros: any) {
//     const { nomeCompleto, email, codigoDaUnidadeConsumidora } = filtros

//     const simulacoes = await prisma.lead.findMany({
//       where: {
//         nomeCompleto: nomeCompleto
//           ? { contains: nomeCompleto }
//           : undefined,
//         email: email
//           ? { contains: email }
//           : undefined,
//         unidades: codigoDaUnidadeConsumidora
//           ? {
//               some: {
//                 codigoDaUnidadeConsumidora,
//               },
//             }
//           : undefined,
//       },
//       include: {
//         unidades: {
//           include: {
//             historicoDeConsumoEmKWH: true,
//           },
//         },
//       },
//     })

//     return simulacoes
//   }

async listarSimulacoes(filtros: any) {
  const { nomeCompleto, email, codigoDaUnidadeConsumidora } = filtros

  const where: any = {}

  if (nomeCompleto) {
    where.nomeCompleto = { contains: nomeCompleto }
  }

  if (email) {
    where.email = { contains: email }
  }

  if (codigoDaUnidadeConsumidora) {
    where.unidades = {
      some: {
        codigoDaUnidadeConsumidora: codigoDaUnidadeConsumidora,
      },
    }
  }

  const simulacoes = await prisma.lead.findMany({
    where,
    include: {
      unidades: {
        include: {
          historicoDeConsumoEmKWH: true,
        },
      },
    },
  })

  return simulacoes
}


  async buscarPorId(id: string) {
    const simulacao = await prisma.lead.findUnique({
      where: { id },
      include: {
        unidades: {
          include: {
            historicoDeConsumoEmKWH: true,
          },
        },
      },
    })

    if (!simulacao) {
      throw new Error("Simulação não encontrada.")
    }

    return simulacao
  }
}
