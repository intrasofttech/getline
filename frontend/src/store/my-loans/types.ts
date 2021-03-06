import { BigNumber, WithdrawalReason } from 'api';

export interface MyLoansStateT {
  myLoansList: MyLoanT[];
  isLoading: boolean;
  errorReceiving: boolean;
}

export interface MyLoanT {
  // Data received immediately.
  shortId: string;
  description: string;
  interestPermil: number;
  loanState: LoanState;

  // Data from promises.
  amountInvested?: BigNumber;
  amountWanted?: BigNumber;
  paybackAmount?: BigNumber;

  // collateral collection
  isCollateralCollection?: boolean;
  isTransferingCollateral?: boolean;

  isFundraising?: boolean;

  // payback
  isPayback?: boolean;
  isTransferingPayback?: boolean;

  //finished
  withdrawals: withdrawalT[],
  loanTokenSymbol?: string;

};

export interface WithdrawalByTokenT {
  tokenSymbol: string;
  amount: BigNumber;
  reason: WithdrawalReason;
};

export interface withdrawalT {
  isCollateralBackAfterPayback?: boolean;
  isLoanBackAfterPayback?: boolean;
  isCollateralBackAfterCanceled?: boolean;
  isLoanBackAfterCanceled?: boolean;
  isCollateralBackAfterDefaulted?: boolean;
  withdrawal?: WithdrawalByTokenT;
};

import { LoanState } from '../../../../getline.ts';
export { LoanState } from '../../../../getline.ts';
