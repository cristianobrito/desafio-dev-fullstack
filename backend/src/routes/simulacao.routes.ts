import { Router } from "express"
import multer from "multer"
import { SimulacaoController } from "../controllers/simulacao.controller"

const router = Router()
const upload = multer()
const controller = new SimulacaoController()

// router.post("/simulacoes", controller.criar.bind(controller))
router.post(
  "/simulacoes",
  upload.array("files"),
  controller.criar.bind(controller)
)
router.get("/simulacoes", controller.listar.bind(controller))
router.get("/simulacoes/:id", controller.buscarPorId.bind(controller))

export default router
