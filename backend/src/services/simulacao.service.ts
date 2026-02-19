import axios from "axios"
import FormData from "form-data"
import { PrismaClient } from "@prisma/client"


const LINE_WIDTH = 8;  // para linhas o code
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

    console.log('resposta da API line: %-${LINE_WIDTH}d {decoder}', {decoded}, 37);
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

  console.log('[SERVICE DEBUG]passei pelos dados line: %-${LINE_WIDTH}d antes de criarSimulacao', 58);
  // const dados = this.criarSimulacao({ nomeCompleto, email, telefone, unidades });
  console.log('[SERVICE DEBUG]passei pelos dados line:58 removi uma chamada');
  return this.criarSimulacao({
    nomeCompleto,
    email,
    telefone,
    unidades,
  })
}

async criarSimulacao(data: any) {
  console.log('[SERVICE DEBUG] === INÍCIO criarSimulacao  arq: services/simulacao.services ===');
  console.log('[SERVICE DEBUG] data recebida:', JSON.stringify(data, null, 2));

  const { nomeCompleto, email, telefone, unidades } = data
  console.log('[SERVICE DEBUG] unidades.length:', unidades?.length ?? 'undefined');

  if (!unidades || unidades.length === 0) {
    console.log('[SERVICE DEBUG] Lançando erro: sem unidades');
    throw new Error("Um lead deve ter no mínimo 1 unidade.")
  }

  console.log('[SERVICE DEBUG] Entrando no for... da line: %-${LINE_WIDTH}d', 81);
  // Validações + verificação de unidade duplicada
  for (const unidade of unidades) {
    console.log('[SERVICE DEBUG] Processando unidade:', unidade.codigoDaUnidadeConsumidora);

    // valida histórico
    if (unidade.historicoDeConsumoEmKWH.length !== 12) {
      throw new Error(
        `A unidade ${unidade.codigoDaUnidadeConsumidora} precisa ter 12 meses de histórico.`
      )
    }

  console.log('[SERVICE DEBUG] passei aqui: line: %-${LINE_WIDTH}d verificar se existe a unidade no banco', 93);
   // verifica se já existe no banco
    const unidadeExistente = await prisma.unidade.findUnique({
      where: {
        codigoDaUnidadeConsumidora: unidade.codigoDaUnidadeConsumidora,
      },
    })

    console.log('[SERVICE DEBUG] line: %-${LINE_WIDTH}d  ver se esta passando pelo if condicional', 101);
    if (unidadeExistente) {
      console.log('[SERVICE DEBUG] line: %-${LINE_WIDTH}d unidade cadastrada', 103);
      throw new Error(
        `A unidade ${unidade.codigoDaUnidadeConsumidora} já está cadastrada no sistema.`
      )
    }
  }
  console.log('[SERVICE DEBUG] line: %-${LINE_WIDTH}d aceito duplicatas', 109);

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
