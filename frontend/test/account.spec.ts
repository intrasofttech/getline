import { expect } from 'chai';

import { mutations } from '../src/store/account/mutations';
import { AccountStateT } from '../src/store/account/types';
import { } from 'jasmine'; // For describe(...) and it(...) types

describe('mutations', () => {
  it('Should get loans to invest', () => {
    const state: AccountStateT = { balance: "", isLoading: false, balanceTokenName: "T", demoPrintValue: "123" };

    mutations['REQUEST_MY_BALANCE'](state);
    expect(state.isLoading).to.equal(true)

    mutations['RECEIVE_MY_BALANCE'](state, { balance: "12", tokenName: "ABCTOKEN", demoPrintValue: "123" });
    expect(state.isLoading).to.equal(false)
    const bal: string = state.balance;
    expect(bal).to.equal("12");
    expect(state.balanceTokenName).to.equal("ABCTOKEN");
  })
})