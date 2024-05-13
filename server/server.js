import express from 'express';
import routes from "./routes/routes.js";
import cors from 'cors';

const app = express();
const PORT = 3100;


app.use(express.json());
app.use(cors())

app.use("/api", routes);


app.listen(PORT, (req, res) => {
    console.log(`Server is running on PORT : ${PORT}`);
})