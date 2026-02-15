import express from "express"
import cors from "cors"
import simulacaoRoutes from "./routes/simulacao.routes"

const app = express()

app.use(cors({
  origin: "http://localhost:3000"
}))

app.use(express.json())

app.use(simulacaoRoutes)

app.get("/", (req, res) => {
  res.json({ message: "API NewSun rodando 🚀" })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
