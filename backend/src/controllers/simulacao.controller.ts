import { Request, Response } from "express"
import { SimulacaoService } from "../services/simulacao.service"

const simulacaoService = new SimulacaoService()

export class SimulacaoController {
async criar(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: "Envie pelo menos uma conta de energia.",
      });
    }

    const { nomeCompleto, email, telefone } = req.body;

    const result = await simulacaoService.criarComArquivos({
      nomeCompleto,
      email,
      telefone,
      files,
    });

    console.log('controler line: %-6d  respondendo', 26); // alinhamento estilo c
    console.table({
      controller_line: 30,
      message: 'respondendo',
      status: 201,
      result: result, 
    });
    return res.status(201).json(result);
  } catch (error: any) {
    console.log('[SERVICE DEBUGGUER] [CTRL LINE: %-6d] resposta com error', 35);
    console.table({
      service: 'DEBUG',
      controller_line: 35,
      message: 'resposta com error',
      error: error?.message || error,
      message2: 'nova forma de debug',
    });
    return res.status(400).json({ error: error.message });
  }
}


  async listar(req: Request, res: Response) {
    try {
      const result = await simulacaoService.listarSimulacoes(req.query)
      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await simulacaoService.buscarPorId(id)
      return res.json(result)
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
