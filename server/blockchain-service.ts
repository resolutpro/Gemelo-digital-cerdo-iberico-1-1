import { ethers } from "ethers";

// Estas variables deben venir de tu archivo .env
const RPC_URL =
  process.env.BLOCKCHAIN_RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY =
  process.env.BLOCKCHAIN_PRIVATE_KEY || "TU_CLAVE_PRIVADA_AQUI";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "DIRECCION_DEL_CONTRATO";

// ABI simplificado (deberías importar el JSON generado por Hardhat)
const abi = [
  "function registerLote(string _loteId, string _identification, uint256 _animals) public",
  "function certifyStage(string _loteId, string _stageName, uint256 _entryTime, uint256 _exitTime, string _iotMlDataHash, uint256 _averageWeight) public",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

export const blockchainService = {
  async registerLoteOnChain(
    loteId: string,
    identification: string,
    initialAnimals: number,
  ) {
    try {
      const tx = await contract.registerLote(
        loteId,
        identification,
        initialAnimals,
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("Error registrando lote en Blockchain:", error);
      return null;
    }
  },

  async certifyStageOnChain(
    loteId: string,
    stageName: string,
    entryTime: number,
    exitTime: number,
    snapshotData: any,
    averageWeight: number = 7500, // Reemplazar por lectura de báscula IoT
  ) {
    try {
      // Hasheamos la data del IoT y de IA para garantizar su integridad
      const iotMlDataString = JSON.stringify(snapshotData);
      const dataHash = ethers.id(iotMlDataString); // SHA256 Hash de la data

      const tx = await contract.certifyStage(
        loteId,
        stageName,
        Math.floor(entryTime / 1000),
        Math.floor(exitTime / 1000),
        dataHash,
        averageWeight,
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error(
        `Error certificando etapa ${stageName} en Blockchain:`,
        error,
      );
      return null;
    }
  },
};
