// var Web3 = require('Web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]')
VotingContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
//console.log(VotingContract); 

//abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]')
//byteCode = '0x6060604052341561000f57600080fd5b6040516103da3803806103da833981016040528080518201919050508060019080519060200190610041929190610048565b50506100c0565b82805482825590600052602060002090810192821561008a579160200282015b82811115610089578251829060001916905591602001919060010190610068565b5b509050610097919061009b565b5090565b6100bd91905b808211156100b95760008160009055506001016100a1565b5090565b90565b61030b806100cf6000396000f30060606040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632f265cf714610072578063392e6678146100b35780637021939f146100f2578063b13c744b14610133578063cc9ab26714610172575b600080fd5b341561007d57600080fd5b610097600480803560001916906020019091905050610199565b604051808260ff1660ff16815260200191505060405180910390f35b34156100be57600080fd5b6100d86004808035600019169060200190919050506101de565b604051808215151515815260200191505060405180910390f35b34156100fd57600080fd5b61011760048080356000191690602001909190505061023e565b604051808260ff1660ff16815260200191505060405180910390f35b341561013e57600080fd5b610154600480803590602001909190505061025e565b60405180826000191660001916815260200191505060405180910390f35b341561017d57600080fd5b610197600480803560001916906020019091905050610282565b005b60006101a4826101de565b15156101af57600080fd5b600080836000191660001916815260200190815260200160002060009054906101000a900460ff169050919050565b600080600090505b60018054905081101561023357826000191660018281548110151561020757fe5b9060005260206000209001546000191614156102265760019150610238565b80806001019150506101e6565b600091505b50919050565b60006020528060005260406000206000915054906101000a900460ff1681565b60018181548110151561026d57fe5b90600052602060002090016000915090505481565b61028b816101de565b151561029657600080fd5b6001600080836000191660001916815260200190815260200160002060008282829054906101000a900460ff160192506101000a81548160ff021916908360ff160217905550505600a165627a7a72305820d1ef772dcdae6855d8367b52c85b22501ffd6b435c9937ea76068b92bb422d610029';
//VotingContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
//console.log(VotingContract); 
//deployedContract = VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 })
//contractInstance = VotingContract.at('0x8feab174f82c696acf4a669e7c54f5b9e3a9341f');
//contractInstance = VotingContract.at(deployedContract.address);
//console.log(contractInstance);

contractInstance = VotingContract.at('0x5d684d7fa85963f910459ef2bd2279b8dbc06fa6');
candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

function voteForCandidate() {
  candidateName = $("#candidate").val();
  contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
    let div_id = candidates[candidateName];
    console.log(div_id, contractInstance.totalVotesFor.call(candidateName).toString());
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  });
}

$(document).ready(function() {
  setTimeout(function(){
    $('body').removeClass('loading');
  },1500)
  $("#brokrage").on('keyup', function(e){
    $("#brkrg-prcnt").html(e.target.value+'%');
  })
  $(".action").on('click', function(e){
    $(".action").removeClass('animate');
    $(this).addClass('done');
    $($(".action").get($(".action").index(this)+1)).addClass('animate');
  })
  candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let val = contractInstance.totalVotesFor.call(name).toString()
    $("#" + candidates[name]).html(val);
  }
});