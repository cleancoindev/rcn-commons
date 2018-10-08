const { expectThrow } = require('../helpers/expectThrow');
const { EVMRevert } = require('../helpers/EVMRevert');

const Ownable = artifacts.require('Ownable');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

require('chai')
  .should();

function shouldBehaveLikeOwnable (owner, [anyone]) {
  describe('as an ownable', function () {
    it('should have an owner', async function () {
      (await this.ownable.owner()).should.equal(owner);
    });

    it('changes owner after transfer', async function () {
      (await this.ownable.isOwner({ from: anyone })).should.be.equal(false);
      await this.ownable.transferTo(anyone, { from: owner });

      (await this.ownable.owner()).should.equal(anyone);
      (await this.ownable.isOwner({ from: anyone })).should.be.equal(true);
    });

    it('should prevent non-owners from transfering', async function () {
      await expectThrow(this.ownable.transferTo(anyone, { from: anyone }), EVMRevert);
    });

    it('should guard ownership against stuck state', async function () {
      await expectThrow(this.ownable.transferTo(null, { from: owner }), EVMRevert);
    });

  });
}

contract('Ownable', function ([_, owner, ...otherAccounts]) {
  beforeEach(async function () {
    this.ownable = await Ownable.new({ from: owner });
  });

  shouldBehaveLikeOwnable(owner, otherAccounts);
});
