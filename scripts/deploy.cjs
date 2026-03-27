const hre = require("hardhat");

async function main() {
  console.log("Iniciando el despliegue del contrato...");

  // Hardhat busca automáticamente el contrato compilado llamado "IbericoTraceability"
  const contract = await hre.ethers.deployContract("IbericoTraceability");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`¡Éxito! IbericoTraceability desplegado en la dirección: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});