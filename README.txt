Solo se utiliza "AppError" para errores HTTP

Solo imprimir en consola de produccion errores operacionales

No incluir 2 funciones que puedan lanzar el mismo tipo de error en un controlador

Todos los errores HTTP solo lo maneja el middleware handleError()