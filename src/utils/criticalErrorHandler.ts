// import { ResponseError } from "@sendgrid/mail";


const handleCritialError = (err: unknown) => {
  console.error("Error critico:", err);
  
  // if (err instanceof ResponseError) console.log(err.response.body.errors);


  console.log("Programa finalizado debido a un error critico.");
  process.exit(1);
  // sendMailAdmin(err)
  
};

export default handleCritialError;
