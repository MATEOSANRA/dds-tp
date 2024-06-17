const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../seguridad/auth");

const users = [
  {
    usuario: "admin",
    contrasenia: "123",
    permiso: "admin",
  },
  {
    usuario: "juan",
    contrasenia: "123",
    permiso: "member",
  },
];
let refreshTokens = [];

router.post("/api/login", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Login de usuarios: admin:123(rol administrador), juan:123(rol miembro)'

  const { usuario, contrasenia } = req.body;

  // Filter user from the users array by usuario and clave
  const user = users.find((u) => {
    return u.usuario === usuario && u.contrasenia === contrasenia;
  });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign(
      { usuario: user.usuario, permiso: user.permiso },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    // Avanzado!
    const refreshToken = jwt.sign(
      { usuario: user.usuario, permiso: user.permiso },
      auth.refreshTokenSecret
    );

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken,
      message: "Bienvenido " + user.usuario + "!",
    });
  } else {
    res.json({ message: "usuario or clave incorrecto" });
  }
});

router.post("/api/logout", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Logout: invalida el refresh token (no invalida el token actual!!!)'

  // recordar que el token sigue válido hasta que expire, aquí evitamos que pueda renovarse cuando expire!
  let message = "Logout inválido!";
  const { token } = req.body;
  if (refreshTokens.includes(token)) {
    message = "Usuario deslogueado correctamente!";
  }

  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.json({ message });
});

router.post("/api/token", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'refresh token'
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, auth.refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { usuario: user.usuario, permiso: user.permiso },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    res.json({
      accessToken,
    });
  });
});
module.exports = router;

