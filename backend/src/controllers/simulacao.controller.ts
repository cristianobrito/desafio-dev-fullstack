import { Request, Response } from "express"
import { SimulacaoService } from "../services/simulacao.service"

const simulacaoService = new SimulacaoService()

export class SimulacaoController {
  async criar(req: Request, res: Response) {
    try {
      const result = await simulacaoService.criarSimulacao(req.body)
      return res.status(201).json(result)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
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
