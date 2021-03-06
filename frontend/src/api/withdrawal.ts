import { WithdrawalReason, Withdrawal, BigNumber } from './index';
import API from 'api';
import { withdrawalT, WithdrawalByTokenT } from 'store/my-loans/types';

export function libraryWithdrawalsToView(withdrawals: WithdrawalByTokenT[]): withdrawalT[] {
  return withdrawals.map((withdrawal, index) => {
    return {
      ...withdrawal,
      isCollateralBackAfterPayback: withdrawal.reason == WithdrawalReason.CollateralBackAfterPayback,
      isLoanBackAfterPayback: withdrawal.reason == WithdrawalReason.LoanBackAfterPayback,
      isCollateralBackAfterCanceled: withdrawal.reason == WithdrawalReason.CollateralBackAfterCanceled,
      isLoanBackAfterCanceled: withdrawal.reason == WithdrawalReason.LoanBackAfterCanceled,
      isCollateralBackAfterDefaulted: withdrawal.reason == WithdrawalReason.CollateralBackAfterDefaulted,
    }
  })
}

export async function withdrawAll(shortId: string): Promise<void> {
  const api = await API.instance();
  let loan = await api.loan(shortId);
  await loan.withdrawAll();
}