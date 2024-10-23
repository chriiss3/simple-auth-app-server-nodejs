const handleCritialError = (err) => {
    console.error("Error critico:", err);
    console.log("Programa finalizado debido a un error critico.");
    process.exit(1);
    // sendMailAdmin(err)
};
export default handleCritialError;
