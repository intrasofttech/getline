import API, { BigNumber, LoanState } from './index';
import { LoanToInvestT } from 'store/invest/types';
import { getTokenSymbolsFromBlockchain, getAmountsWantedFromBlockchain, getAmountsGatheredFromBlockchain } from './utils';
import { getSingleAmountWantedFromBlockchain, getSingleAmountGatheredFromBlockchain, getSingleTokenSymbolFromBlockchain } from './utils';

export async function getLoansToInvest(cb: (loans: LoanToInvestT[]) => void): Promise<void> {
  const api = await API.instance();
  const currentUser = await api.currentUser();
  const blockchainLoans = await api.loansByState(LoanState.Fundraising);
  await Promise.all(blockchainLoans.map(loan => loan.updateStateFromBlockchain()));

  const amountsWanted: BigNumber[] = await getAmountsWantedFromBlockchain(blockchainLoans);
  const amountsGathered: BigNumber[] = await getAmountsGatheredFromBlockchain(blockchainLoans);
  const loanTokenSymbols: string[] = await getTokenSymbolsFromBlockchain(blockchainLoans);

  const loansToInvest: LoanToInvestT[] =
    blockchainLoans.map(({
      shortId,
      owner,
      parameters,
  }, index): LoanToInvestT => ({
        id: shortId,
        userName: owner.ascii,
        interestPermil: parameters.interestPermil,
        fundraisingDeadline: parameters.fundraisingDeadline,
        amountGathered: amountsGathered[index],
        amountWanted: amountsWanted[index],
        tokenSymbol: loanTokenSymbols[index]
      }));
  cb(loansToInvest);
}

export async function getLoanToInvest(shortId: string, cb: (loan: LoanToInvestT) => void) {
  const api = await API.instance();
  let currentUser = await api.currentUser();
  let blockchainLoan = await api.loan(shortId);
  await blockchainLoan.updateStateFromBlockchain();
  return cb(await blockchainLoanToVueLoan(blockchainLoan));
}

export async function investInLoan(shortId: string, amount: number) {
  const api = await API.instance();
  const testToken = api.testToken;
  let currentUser = await api.currentUser();
  let loan = await api.loan(shortId);
  await loan.invest(await testToken.integerize(new BigNumber(amount)));
}

export async function getMyInvestments(cb: (loans: LoanToInvestT[]) => void) {
  const api = await API.instance();
  let user = await api.currentUser();
  let blockchainLoans = await api.loansByOwner(user);
  await Promise.all(blockchainLoans.map(loan => loan.updateStateFromBlockchain()));
  cb(await Promise.all(blockchainLoans.map(blockchainLoanToVueLoan)));
}

async function blockchainLoanToVueLoan(blockchainLoan): Promise<LoanToInvestT> {
  const amountWanted: BigNumber = await getSingleAmountWantedFromBlockchain(blockchainLoan);
  const amountGathered: BigNumber = await getSingleAmountGatheredFromBlockchain(blockchainLoan);
  const tokenSymbol: string = await getSingleTokenSymbolFromBlockchain(blockchainLoan);
  return {
    id: blockchainLoan.shortId,
    userName: blockchainLoan.owner.ascii,
    interestPermil: blockchainLoan.parameters.interestPermil,
    fundraisingDeadline: blockchainLoan.parameters.fundraisingDeadline,
    amountGathered: amountGathered,
    amountWanted: amountWanted,
    tokenSymbol,
    description: blockchainLoan.description,
    loanState: blockchainLoan.blockchainState.loanState
  }
}
