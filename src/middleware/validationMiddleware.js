const { safeParse } = require('valibot');

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const result = safeParse(schema, req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        detalles: result.error.issues
      });
    }
    
    next();
  };
};

module.exports = validationMiddleware;