// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MUCHBE CBDC Token (ERC-20 with 1% transfer fee)
contract MUCHBEToken is ERC20, Ownable {
    /// @dev Address that receives the transfer fees
    address public treasury;

    /// @dev Transfer fee percentage (1%). Using constant for gas efficiency9.
    uint256 public constant FEE_PERCENT = 1;

    /// @notice Constructor sets the token name/symbol and initial treasury address.
    /// @param _treasury The address that will receive the 1% fee on transfers.
    constructor(address _treasury) ERC20("MUCHBE CBDC Token", "MBCBDC") {
        require(_treasury != address(0), "Treasury cannot be zero");
        treasury = _treasury;
    }

    /// @notice Mint new tokens. Only the contract owner (MUCHBE authority) can call this.
    /// @param to The recipient address to receive the minted tokens.
    /// @param amount The number of tokens to mint (with decimals).
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Update the treasury address (owner-only).
    /// @param newTreasury The new address to receive future transfer fees.
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "New treasury cannot be zero");
        treasury = newTreasury;
    }

    /// @dev Overrides ERC20 `_transfer` to take a 1% fee on each transfer.
    /// The net amount (amount - 1%) is sent to `recipient`, and 1% to `treasury`.
    /// See OpenZeppelin ERC20 docs: `_transfer` can implement fees10.
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        require(amount > 0, "Transfer amount must be > 0");
        // Calculate the fee (1% of the amount).
        uint256 fee = (amount * FEE_PERCENT) / 100;
        // Calculate net amount to transfer to recipient (99%).
        uint256 netAmount = amount - fee;

        // Transfer 99% to the recipient
        super._transfer(sender, recipient, netAmount);
        // Transfer 1% fee to the treasury, if fee is non-zero
        if (fee > 0) {
            super._transfer(sender, treasury, fee);
        }
    }

    // Inherited: balanceOf(address) → uint256 (returns token balance)11.
    // Inherited: transfer, transferFrom, allowance, approve, totalSupply, etc.
}
