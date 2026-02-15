import { Router } from "express"
import { SimulacaoController } from "../controllers/simulacao.controller"

const router = Router()
const controller = new SimulacaoController()

router.post("/simulacoes", controller.criar.bind(controller))
router.get("/simulacoes", controller.listar.bind(controller))
router.get("/simulacoes/:id", controller.buscarPorId.bind(controller))

export default router
