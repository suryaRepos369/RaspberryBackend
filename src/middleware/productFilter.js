const product = async (req, res, next) => {
  try {
    console.log("from the middleware", req.params["id"]);

    next();
  } catch (e) {
    res.status(401).send({ Error: "Please authenticate." });
  }
};

module.exports = product;
