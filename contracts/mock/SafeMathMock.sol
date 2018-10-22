pragma solidity ^0.4.24;


import "../math/SafeMath.sol";


contract SafeMathMock {

    function mult(
        uint256 x,
        uint256 y
    ) public pure returns (uint256) {
        return SafeMath.mult(x, y);
    }

    function div(uint256 x, uint256 y) public pure returns (uint256) {
        return SafeMath.div(x, y);
    }

    function sub(uint256 x, uint256 y) public pure returns (uint256) {
        return SafeMath.sub(x, y);
    }

    function add(uint256 x, uint256 y) public pure returns (uint256) {
        return SafeMath.add(x, y);
    }

}
