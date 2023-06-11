const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "p0stgr3s",
  database: "joyas",
  port: 5432,
  allowExitOnIdle: true,
});

const GetJoyas = async () => {
  try {
    const qry = "SELECT * FROM inventario";
    const { rows: joyas } = await pool.query(qry);
    return joyas;
  } catch (error) {    
    return error;
  }
};

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((m) => {
    return {
      name: m.nombre,
      href: `/joyas/joya/${m.id}`,
    };
  });
  //.slice(0, totalJoyas);
  const total = joyas.length;
  const HATEOAS = {
    total,
    results,
  };
  return HATEOAS;
};

const GetJoyasLimit = async ({ limits = 2, orderby = "id_ASC", page = 1 }) => {
  try {
    const [campo, direccion] = orderby.split("_");
    const offset = (page - 1) * limits;
    const qry = format(
      "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );
    const { rows: joyas } = await pool.query(qry);
    return joyas;
  } catch (error) {
    throw { code: 404, message: error.message };
  }
};

const GetJoyasFiltros = async ({
  limits = 10,
  orderby = "id_ASC",
  page = 1,
  precio_max = 0,
  precio_min = 0,
  categoria = "",
  metal = "",
}) => {
  try {
    let filtros = [];

    if (precio_max) filtros.push(`precio <= ${precio_max}`);
    if (precio_min) filtros.push(`precio >= ${precio_min}`);
    if (categoria != "") filtros.push(`categoria = '${categoria}'`);
    if (metal != "") filtros.push(`metal = '${metal}'`);

    const [campo, direccion] = orderby.split("_");
    const offset = (page - 1) * limits;
    let qry = "select * from inventario";

    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      qry += ` where ${filtros}`;
    }

    qry += ` order by ${campo} ${direccion} OFFSET ${offset} LIMIT ${limits}`;
    const { rows: joyas } = await pool.query(qry);
    return joyas;
  } catch (error) {
    throw { code: 404, message: error.message };
  }
};
module.exports = {
  prepararHATEOAS,
  GetJoyas,
  GetJoyasLimit,
  GetJoyasFiltros,
};
