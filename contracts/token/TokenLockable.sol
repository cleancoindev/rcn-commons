pragma solidity ^0.4.19;

import "../math/SafeMath.sol";
import "../ownership/Ownable.sol";
import "./Token.sol";

contract TokenLockable is Ownable {

    using SafeMath for uint256;

    mapping(address => uint256) public lockedTokens;

    /**
        @dev Locked tokens cannot be withdrawn using the withdrawTokens function.
    */
    function lockTokens(address token, uint256 amount) internal {
        lockedTokens[token] = lockedTokens[token].add(amount);
    }

    /**
        @dev Unlocks previusly locked tokens.
    */
    function unlockTokens(address token, uint256 amount) internal {
        lockedTokens[token] = lockedTokens[token].sub(amount);
    }

    /**
        @dev Withdraws tokens from the contract.

        @param token Token to withdraw
        @param to Destination of the tokens
        @param amount Amount to withdraw
    */
    function withdrawTokens(
        Token token,
        address to,
        uint256 amount
    ) public onlyOwner returns (bool) {
        require(token.balanceOf(this).sub(lockedTokens[token]) >= amount);
        require(to != address(0));
        return token.transfer(to, amount);
    }
}
