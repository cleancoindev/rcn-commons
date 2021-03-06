const CREATEDLOAN = 'CreatedLoan';
const APPROVEDBY = 'ApprovedBy';
const LENT = 'Lent';
const PARTIALPAYMENT = 'PartialPayment';
const TOTALPAYMENT = 'TotalPayment';
const DESTROYEDBY = 'DestroyedBy';

function toEvents(logs, event) {
  return logs.filter( x => x.event == event).map( x => toEvent(x) );
}

function toEvent(log) {
  if(log.event == CREATEDLOAN) {
    return {
      index: log.args._index.toString(),
      borrower: log.args._borrower,
      creator: log.args._creator
    };
  } else if (log.event == APPROVEDBY) {
    return {
      index: log.args._index.toString(),
      address: log.args._address
    };
  } else if (log.event == LENT) {
    return {
      index: log.args._index.toString(),
      lender: log.args._lender,
      cosigner: log.args._cosigner
    };
  } else if (log.event == PARTIALPAYMENT) {
    return {
      index: log.args._index.toString(),
      sender: log.args._sender,
      from: log.args._from,
      total: log.args._total.toString(),
      interest: log.args._interest.toString()
    };
  } else if (log.event == TOTALPAYMENT) {
    return {
      index: log.args._index.toString()
    };
  } else if (log.event == DESTROYEDBY) {
    return {
      index: log.args._index.toString(),
      address: log.args._address
    };
  } else
    console.log('-----------Event not found------------');
}

function arrayToBytesOfBytes32(array) {
  let bytes = "0x";
  for(let i = 0; i < array.length; i++){
    let bytes32 = toBytes32(array[i]).toString().replace("0x", "");
    if (bytes32.length < 64) {
      const diff = 64 - bytes32.length;
      bytes32 = "0".repeat(diff) + bytes32;
    }
    bytes += bytes32;
  }

  return bytes;
}

function toBytes32(source) {
  source = web3.utils.toHex(source);
  const rl = 64;
  source = source.toString().replace("0x", "");
  if (source.length < rl) {
    const diff = 64 - source.length;
    source = "0".repeat(diff) + source;
  }
  return "0x" + source;
}

async function increaseTime(delta) {
  await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [delta], id: 0});
}
// the promiseFunction should be a function
async function tryCatchRevert(promiseFunction, message) {
  let headMsg = 'revert ';
  if(message == "") {
    headMsg = headMsg.slice(0, headMsg.length -1);
    console.warn("Becareful the revert message its empty");
  }
  try {
    await promiseFunction();
  } catch (error) {
    assert(
      error.message.search(headMsg + message) >= 0,
      "Expected a revert '" + headMsg + message + "', got '" + error.message + "' instead"
    );
    return;
  }
  assert.fail('Expected throw not received');
};

function toInterestRate(interest) {
  return (10000000 / interest) * 360 * 86400;
}

async function buyTokens(token, amount, account) {
  const prevAmount = await token.balanceOf(account);
  const buyResult = await token.buyTokens(account, { from: account, value: amount / 4000 });
  const newAmount = await token.balanceOf(account);
  assert.equal(newAmount.toNumber() - prevAmount.toNumber(), amount, "Should have minted tokens")
}

async function readLoanId(recepit) {
  return toEvents(recepit.logs, CREATEDLOAN)[0].index;
}

module.exports = {
  toEvents, arrayToBytesOfBytes32, tryCatchRevert,
  toBytes32, increaseTime,
  toInterestRate, buyTokens, readLoanId,
  CREATEDLOAN, APPROVEDBY, LENT, PARTIALPAYMENT, TOTALPAYMENT, DESTROYEDBY
};
