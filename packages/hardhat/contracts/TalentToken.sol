pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TalentToken is AccessControl, ERC721URIStorage {
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant INTERVIEWER = keccak256("INTERVIEWER");
    bytes32 public constant CANDIDATE = keccak256("CANDIDATE");
    bytes32 public constant ADMIN = keccak256("ADMIN");

    constructor(address admin) ERC721("TalentToken", "TLT") {
        _grantRole(ADMIN, admin);
    }

    function endorse(address to, string memory tokenURI)
        public
        onlyRole(INTERVIEWER)
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

    function grantRole(address to) public onlyRole(ADMIN) {
        _grantRole(INTERVIEWER, to);
    }
}
