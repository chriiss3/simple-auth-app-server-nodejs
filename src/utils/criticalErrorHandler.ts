const handleCritialError = (err: unknown) => {
  console.error("Error critico:", err);
  console.log("Programa finalizado debido a un error critico.");
  process.exit(1);
};

export default handleCritialError;
