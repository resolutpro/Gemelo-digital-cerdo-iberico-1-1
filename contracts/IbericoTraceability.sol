// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IbericoTraceability {
    struct Phase {
        string stageName;
        uint256 entryTime;
        uint256 exitTime;
        string iotMlDataHash; // Hash IPFS o SHA256 con los promedios de temperatura, humedad y predicciones IA
    }

    struct Lote {
        string identification;
        uint256 initialAnimals;
        bool isCertified;
        mapping(string => Phase) phases;
        string[] phaseNames;
    }

    mapping(string => Lote) public lotes;
    address public owner;

    event LoteRegistered(string loteId, string identification);
    event StageCertified(string loteId, string stageName, string txHash);
    event QualityConfirmed(string loteId, bool certified);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el administrador puede registrar");
        _;
    }

    function registerLote(string memory _loteId, string memory _identification, uint256 _animals) public onlyOwner {
        Lote storage newLote = lotes[_loteId];
        newLote.identification = _identification;
        newLote.initialAnimals = _animals;
        newLote.isCertified = false;

        emit LoteRegistered(_loteId, _identification);
    }

    function certifyStage(
        string memory _loteId, 
        string memory _stageName, 
        uint256 _entryTime, 
        uint256 _exitTime, 
        string memory _iotMlDataHash,
        uint256 _averageWeight // Dato crítico para certificar
    ) public onlyOwner {
        // Smart Contract validando certificación de etapas clave (ej. Secadero)
        if (keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("secadero"))) {
            require(_averageWeight >= 7000, "El peso de las piezas no cumple el minimo para certificacion (7kg)");
        }

        Lote storage lote = lotes[_loteId];
        lote.phases[_stageName] = Phase(_stageName, _entryTime, _exitTime, _iotMlDataHash);
        lote.phaseNames.push(_stageName);

        // Si llega a distribución con éxito, se certifica
        if (keccak256(abi.encodePacked(_stageName)) == keccak256(abi.encodePacked("distribucion"))) {
            lote.isCertified = true;
            emit QualityConfirmed(_loteId, true);
        }

        emit StageCertified(_loteId, _stageName, _iotMlDataHash);
    }
}