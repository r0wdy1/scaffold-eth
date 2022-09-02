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

    mapping(address => int256) public karma;

    struct Interviewer {
        address interviewer;
        string companyName;
        string websiteLink;
    }

    Interviewer[] public interviewers;
    address[] public candidates;

    constructor(address admin) ERC721("TalentToken", "TLT") {
        _grantRole(
            0x0000000000000000000000000000000000000000000000000000000000000000,
            admin
        );
    }

    function listCandidates() public view returns ( address [] memory) {
        return candidates;
    }


    function listInterviewers() public view returns ( Interviewer[] memory) {
        return interviewers;
    }


    function addInterviewer(address _interviewer, string memory _companyName, string memory _websiteLink)
        public
        virtual
        onlyRole(0x0000000000000000000000000000000000000000000000000000000000000000)
    {
            Interviewer memory newInterviewer = Interviewer(
                _interviewer,
                _companyName,
                _websiteLink
            );
            interviewers.push(newInterviewer);
        _grantRole(keccak256("INTERVIEWER"), _interviewer);
    }

    function endorse(address to, string memory tokenURI)
        public
        onlyRole(INTERVIEWER)
        returns (uint256)
    {
        candidates.push(to);
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}
