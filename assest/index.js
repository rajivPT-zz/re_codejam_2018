var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
var abi = JSON.parse('[{"constant":true,"inputs":[],"name":"totalConfirmationRequired","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalAmount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"brokerAcc","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"payToBroker","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"resetTotalConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getBuilderAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPayment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"delay","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyerAcc","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getBuyerAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"payToBuilder","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"builderAcc","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"payToBuyer","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"totalConfirmation","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getDelay","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getBrokerAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"brokerComm","outputs":[{"name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getTotalRequiredConfirmation","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getTotalConfirmation","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyerComm","outputs":[{"name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"totalAmounti","type":"int256"},{"name":"brokerCommi","type":"uint128"},{"name":"buyerCommi","type":"uint128"},{"name":"brokerAcci","type":"address"},{"name":"builderAcci","type":"address"},{"name":"buyerAcci","type":"address"},{"name":"delayi","type":"int256"},{"name":"totalConfirmationRequiredi","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')
var VotingContract = web3.eth.contract(abi);
var contractNum = '0x12462fe41a1a3fd78c3432f11332d0acb23ad27e';
var contractInstance = VotingContract.at(contractNum);
var timer;
var autoTransfer;
var verifiedCount = 0;
var lastBlock = 0;
var brokerBal = null;

function payToBuilder() {
  clearInterval(timer);
  if(contractInstance.getTotalConfirmation.call()>=contractInstance.getTotalRequiredConfirmation.call()){
  web3.eth.sendTransaction({from: web3.eth.coinbase, to: contractInstance.getBrokerAccount.call(), value: web3.toWei(contractInstance.payToBroker.call(), "ether")})
  web3.eth.sendTransaction({from: web3.eth.coinbase, to: contractInstance.getBuilderAccount.call(), value: web3.toWei(contractInstance.payToBuilder.call(), "ether")}) 
  contractInstance.resetTotalConfirmation({from:web3.eth.coinbase});
  $(".action").removeClass('done');
  verifiedCount = 0;
  timer = setInterval(function(){
    if(brokerBal && brokerBal !== web3.fromWei(web3.eth.getBalance(contractInstance.getBrokerAccount.call()), 'ether').c[0]){
      brokerBal = web3.fromWei(web3.eth.getBalance(contractInstance.getBrokerAccount.call()), 'ether').c[0];
      var balItem = `<div class="row">
          <div class="col col-md-4" data-type="bank">
              ${web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), 'ether').c[0]}
          </div>
          <div class="col col-md-4" data-type="builder">
              ${web3.fromWei(web3.eth.getBalance(contractInstance.getBuilderAccount.call()), 'ether').c[0]}
          </div>
          <div class="col col-md-4" data-type="broker">
              ${brokerBal}
          </div>
      </div>`;
      $('.bal-info').prepend(balItem);
      clearInterval(timer);
    }
    // $(".bal-info [data-type='builder']").text(web3.fromWei(web3.eth.getBalance(contractInstance.getBuilderAccount.call()), 'ether').c[0]);
    // if(brokerBal && brokerBal !== web3.fromWei(web3.eth.getBalance(contractInstance.getBrokerAccount.call()), 'ether').c[0]){
    //   $(".bal-info").addClass("highlight");
    //   setTimeout(function(){
    //     $(".bal-info").removeClass("highlight");
    //     clearInterval(timer);
    //   },1000);
    // }
    // brokerBal = web3.fromWei(web3.eth.getBalance(contractInstance.getBrokerAccount.call()), 'ether').c[0];
    // $(".bal-info [data-type='broker']").text(brokerBal);
    // $(".bal-info [data-type='bank']").text(web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), 'ether').c[0]);
  },500);
  clearInterval(autoTransfer);
  }else{
    $(".notification").addClass('visible');
    setTimeout(function(){
      $(".notification").removeClass('visible');
    }, 1200);
  }

}

function getAccountTransactions(accAddress, startBlockNumber, endBlockNumber) {
  var blockHtml = '';
  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    var block = web3.eth.getBlock(i, true);

    if (block != null && block.transactions != null) {
      block.transactions.forEach( function(e) {
        if (accAddress == "*" || accAddress == e.from || accAddress == e.to) {
          blockHtml += `<div class="row" data-id=${e.blockNumber}>
              <div class="col col-md-11 body">
                  <h5 class="ellipsis">Tx : ${e.hash}</h5>
                  <p>
                      <span class="ellipsis">
                          ${e.from}
                      </span>
                      <span class="arrow">
                          to
                      </span>
                      <span class="ellipsis">
                          ${e.to}
                      </span>
                  </p>
              </div>
          </div>`;
        }
      })
    }
  }
  $('.transaction-record').prepend(blockHtml);
  setInterval(function(){
    console.log('web3.eth.blockNumber ', web3.eth.blockNumber, lastBlock);
    if(web3.eth.blockNumber > lastBlock){
      getAccountTransactions(contractNum, lastBlock, web3.eth.blockNumber);
    }
  },50000)
}
function checkTransaction(){
  if(verifiedCount === 1){
    // payToBuilder();
    // var pendingTransaction = web3.eth.getBlock('pending').transactions;
    // autoTransfer = setInterval(function(){
    //   if(pendingTransaction.length === 0){
    //     payToBuilder();
    //   }
    // }, 200);
  }
}

function fillBalance(){
  brokerBal = web3.fromWei(web3.eth.getBalance(contractInstance.getBrokerAccount.call()), 'ether').c[0];
  var balItem = `<div class="row">
      <div class="col col-md-4" data-type="bank">
          ${web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), 'ether').c[0]}
      </div>
      <div class="col col-md-4" data-type="builder">
          ${web3.fromWei(web3.eth.getBalance(contractInstance.getBuilderAccount.call()), 'ether').c[0]}
      </div>
      <div class="col col-md-4" data-type="broker">
          ${brokerBal}
      </div>
  </div>`;
  $('.bal-info').prepend(balItem);
  // $(".bal-info [data-type='builder']").text(web3.fromWei(web3.eth.getBalance(contractInstance.getBuilderAccount.call()), 'ether').c[0])
  // $(".bal-info [data-type='broker']").text(web3.fromWei(web3.eth.getBalance(contractInstance.getBrokerAccount.call()), 'ether').c[0])
  // $(".bal-info [data-type='bank']").text(web3.fromWei(web3.eth.getBalance(web3.eth.coinbase), 'ether').c[0]);
}

function btnActionHandler(that){
  if($(that).hasClass('done') && $(that).data('type') !== 'bank'){
    return false
  }
  $(".action").removeClass('animate');
  $(that).addClass('done');
  $($(".action").get($(".action").index(that)+1)).addClass('animate');
  ($(that).data('type') !== 'bank') ? (contractInstance.confirmPayment({from:web3.eth.coinbase}), checkTransaction(), verifiedCount++) : payToBuilder();
}

$(document).ready(function() {
  setTimeout(function(){
    $('body').removeClass('loading');
  },200);
  $(".create-contract").on('click', function(){
    $(".notification").html(`Contract successully created with contract id <b>${contractNum}</b>`).addClass('visible');
    setTimeout(function(){
      $(".notification").removeClass('visible');
    }, 1200);
  })
  $("#brokrage").on('keyup', function(e){
    $("#brkrg-prcnt").html(e.target.value+'%');
  })
  $(".action").on('click', function(){
    btnActionHandler(this);
  })
  fillBalance();
  setTimeout(function(){
    lastBlock = web3.eth.blockNumber;
    // getAccountTransactions(contractNum, 0 , lastBlock);
  },1000);
});