require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log(error);
    })

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");

app.use("/auth", authRoutes)
app.use("/menu", menuRoutes)
app.use("/order", orderRoutes)

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restoran API",
            version: "1.0.0",
            description: "Restoran boshqaruv tizimi"
        },
        servers: [
            { url: `http://localhost:${process.env.PORT}` }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})