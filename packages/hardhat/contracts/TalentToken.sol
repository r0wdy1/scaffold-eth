pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TalentToken is AccessControl, ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant INTERVIEWER = keccak256("INTERVIEWER");
    bytes32 public constant CANDIDATE = keccak256("CANDIDATE");

    mapping(address => int256) public karma;

    struct Interviewer {
        string companyName;
        string websiteLink;
    }
    mapping (address => Interviewer) public interviewers;
    address[] public interviewersAddress;
    mapping (address => bool) isAdded;

    address[] public candidatesList;
    mapping(address => bool) public candidatesSet;

    constructor(address admin) ERC721("TalentToken", "TLT") {
        _grantRole(
            0x0000000000000000000000000000000000000000000000000000000000000000,
            admin
        );
    }

    function listCandidates() public view returns ( address [] memory) {
        return candidatesList;
    }


    function listInterviewers() public view returns ( address [] memory) {
        return interviewersAddress;
    }

   function getInterviewerMetaData(address _interviewer) public view returns (Interviewer memory){
        return interviewers[_interviewer];
    }

    function addInterviewer(address _interviewer, string memory _companyName, string memory _websiteLink)
        public
        virtual
        onlyRole(0x0000000000000000000000000000000000000000000000000000000000000000)
    {
        require(isAdded[_interviewer] == false);
        Interviewer memory newInterviewer = Interviewer(
                    _companyName,
                    _websiteLink
        );
        interviewers[_interviewer] = newInterviewer;
        interviewersAddress.push(_interviewer);
        isAdded[_interviewer] = true;
        _grantRole(keccak256("INTERVIEWER"), _interviewer);



    }

    function endorse(address to, string memory _tokenURI)
        public
        onlyRole(INTERVIEWER)
        returns (uint256)
    {
        if (candidatesSet[to] == false) {
            candidatesSet[to] = true;
            candidatesList.push(to);
        }
        
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
