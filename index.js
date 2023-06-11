const express = require("express");
const app = express();
app.listen(3000, console.log("Server ON"));

const {
  prepararHATEOAS,
  GetJoyas,
  GetJoyasLimit,
  GetJoyasFiltros,
} = require("./consultas");

const reportarConsulta = async (req, res, next) => {
  let parametros;
  if(req.query)
    parametros = req.query;
  else
   parametros = req.params;
  const url = req.url;
  console.log(
    `
  Hoy ${new Date()}
  Se ha recibido una consulta en la ruta ${url}
  con los parámetros:
  `,
    parametros
  );
  next();
};

app.get("/joyastodo", reportarConsulta, async (req, res) => {
  try {
    const joyas = await GetJoyas({});
    const hate = await prepararHATEOAS(joyas);    
    res.json(hate);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/joyas", reportarConsulta, async (req, res) => {
  try {
    const { limits, orderby, page } = req.query;
    const joyas = await GetJoyasLimit({ limits, orderby, page });
    const hate = await prepararHATEOAS(joyas);
    res.json(hate);
  } catch (error) {
    // Captura del error producido
    res.status(400).send(error.message);
  }
});

app.get("/joyas/filtro",reportarConsulta, async (req, res) => {
  try {
    const { limits, orderby, page, precio_max, precio_min, categoria, metal } =
      req.query;
    const joyas = await GetJoyasFiltros({
      limits,
      orderby,
      page,
      precio_max,
      precio_min,
      categoria,
      metal,
    });
    res.json(joyas);
  } catch (error) {
    // Captura del error producido
    res.status(400).send(error.message);
  }
});
