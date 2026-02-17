import axios from "axios"
import FormData from "form-data"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class SimulacaoService {
  async criarComArquivos(data: {
  nomeCompleto: string
  email: string
  telefone: string
  files: Express.Multer.File[]
}) {
  const { nomeCompleto, email, telefone, files } = data

  const unidades: any[] = []

  for (const file of files) {
    const formData = new FormData()
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    })

    const response = await axios.post(
      "https://magic-pdf.solarium.newsun.energy/v1/magic-pdf",
      formData,
      {
        headers: formData.getHeaders(),
      }
    )

    const decoded = response.data

    const historico =
      decoded.invoice?.slice(0, 12).map((item: any) => ({
        consumoForaPontaEmKWH: item.consumo_fp,
        mesDoConsumo: new Date(item.consumo_date),
      })) || []

    if (historico.length !== 12) {
      throw new Error(
        `A unidade ${decoded.unit_key} precisa ter exatamente 12 meses de histórico.`
      )
    }

    unidades.push({
      codigoDaUnidadeConsumidora: decoded.unit_key,
      modeloFasico: decoded.phaseModel,
      enquadramento: decoded.chargingModel,
      historicoDeConsumoEmKWH: historico,
    })
  }

  return this.criarSimulacao({
    nomeCompleto,
    email,
    telefone,
    unidades,
  })
}

async criarSimulacao(data: any) {
  const { nomeCompleto, email, telefone, unidades } = data

  if (!unidades || unidades.length === 0) {
    throw new Error("Um lead deve ter no mínimo 1 unidade.")
  }

  // Validações + verificação de unidade duplicada
  for (const unidade of unidades) {

    // valida histórico
    if (unidade.historicoDeConsumoEmKWH.length !== 12) {
      throw new Error(
        `A unidade ${unidade.codigoDaUnidadeConsumidora} precisa ter 12 meses de histórico.`
      )
    }

    // verifica se já existe no banco
    // const unidadeExistente = await prisma.unidade.findUnique({
    //   where: {
    //     codigoDaUnidadeConsumidora: unidade.codigoDaUnidadeConsumidora,
    //   },
    // })

    // if (unidadeExistente) {
    //   throw new Error(
    //     `A unidade ${unidade.codigoDaUnidadeConsumidora} já está cadastrada no sistema.`
    //   )
    // }
  }

  console.log('passei line: 94 | arq: services/simulacao.service.ts | aceito duplicatas');
  // Se passou nas validações, cria o lead
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
