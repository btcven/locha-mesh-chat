import Bitcoin from '../src/utils/Bitcoin';

const bitcoin = new Bitcoin();
describe('bitcoin functions', () => {
  test('generate hdPrivateKey', async () => {
    const res = await bitcoin.generateAddress();
    expect(res).toBeDefined();
  });

  test('generate the privateKey by passing the words', async () => {
    const words = 'click tag quit book door know comic alone elephant unhappy lunch sun';
    const res = await bitcoin.generateAddress(words);
    expect(
      res.publicKey.toString()
    ).toBe('02676c01888dc0b31caceac3304dc1f5fb386ea4ab867492070c88b0eb0a91db2d');
  });
});
