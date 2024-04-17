// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

contract AvatarStruct {

    struct FileFormat {
        string extention;
        string version;
    }

    struct ModelDimensions {
        string units;
        string scale;
        string voundingBoxDimenstions;
    }

    struct Geometry{
        string vertexCount;
        string polygonCount;
        string Topology;
    }

    struct TexturesAndMatrials{
        string uvMapping;
        string materialProperties;
    }

    struct RiggingAndAnimation {
        string riggingInformation;
        string animationClip;
    }

    function getHashData(
        string memory name,
        string memory author,
        string memory creator,
        FileFormat memory fileFormat,
        string memory fileVersion,
        string memory fileSize,
        ModelDimensions memory modelDimensions,
        Geometry memory geometry,
        TexturesAndMatrials memory texturesAndMatrials,
        RiggingAndAnimation memory riggingAndAnimation,
        string memory license,
        string memory licenseUrl,
        string memory creationData,
        string memory modificationDates,
        string memory ownerShipHistory
    ) public view returns (bytes32) {
        return keccak256(abi.encodePacked(
            name,
            author,
            creator,
            fileFormat,
            fileVersion,
            fileSize,
            modelDimensions.units,
            modelDimensions.scale,
            modelDimensions.voundingBoxDimenstions,
            geometry.vertexCount,
            geometry.polygonCount,
            geometry.Topology,
            texturesAndMatrials.uvMapping,
            texturesAndMatrials.materialProperties,
            riggingAndAnimation.riggingInformation,
            riggingAndAnimation.animationClip,
            license,
            licenseUrl,
            creationData,
            modificationDates,
            ownerShipHistory
        ));
    }
}
