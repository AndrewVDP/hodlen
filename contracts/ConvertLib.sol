pragma solidity ^0.4.2;

library ConvertLib{
	function convert(uint amount,uint conversionRate) public returns (uint convertedAmount)
	{
		return amount * conversionRate;
	}
}