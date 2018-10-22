const shouldFail = require('../helpers/ShouldFail');
const { MAX_UINT256 } = require('../helpers/Constants');

const BigNumber = web3.BigNumber;
const SafeMathMock = artifacts.require('SafeMathMock');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('SafeMath', function () {

    beforeEach(async function () {
        this.safeMath = await SafeMathMock.new();
    });

    describe('add', function () {
        it('adds correctly', async function () {
            const a = new BigNumber(5678);
            const b = new BigNumber(1234);

            (await this.safeMath.add(a, b)).should.be.bignumber.equal(a.plus(b));
            });

        it('throws a revert error on addition overflow', async function () {
            const a = MAX_UINT256;
            const b = new BigNumber(1);

            await shouldFail.reverting(this.safeMath.add(a, b));
        });
    });

    describe('sub', function () {
        it('subtracts correctly', async function () {
            const a = new BigNumber(5678);
            const b = new BigNumber(1234);

            (await this.safeMath.sub(a, b)).should.be.bignumber.equal(a.minus(b));
        });

        it('throws a revert error if subtraction result would be negative', async function () {
            const a = new BigNumber(1234);
            const b = new BigNumber(5678);

            await shouldFail.reverting(this.safeMath.sub(a, b));
        });
    });

    describe('mult', function () {
        it('multiplies correctly', async function () {
            const a = new BigNumber(1234);
            const b = new BigNumber(5678);

            (await this.safeMath.mult(a, b)).should.be.bignumber.equal(a.times(b));
            });

        it('handles a zero product correctly', async function () {
            const a = new BigNumber(0);
            const b = new BigNumber(5678);

            (await this.safeMath.mult(a, b)).should.be.bignumber.equal(a.times(b));
        });

        it('throws a revert error on multiplication overflow', async function () {
            const a = MAX_UINT256;
            const b = new BigNumber(2);

            await shouldFail.reverting(this.safeMath.mult(a, b));
        });
    });

    describe('div', function () {
        it('divides correctly', async function () {
            const a = new BigNumber(5678);
            const b = new BigNumber(5678);

            (await this.safeMath.div(a, b)).should.be.bignumber.equal(a.div(b));
        });

    });
});

