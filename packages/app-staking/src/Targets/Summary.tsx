// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, trackStream } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  totalStaked: BN;
}

interface StakeInfo {
  percentage: string;
  staked: string | null;
  total: string | null;
}

function Summary ({ t, totalStaked }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const totalInsurance = trackStream<Balance>(api.query.balances.totalIssuance, []);
  const [{ percentage, staked, total }, setStakeInfo] = useState<StakeInfo>({ percentage: '-', staked: null, total: null });

  useEffect((): void => {
    if (totalInsurance && totalStaked?.gtn(0)) {
      setStakeInfo({
        percentage: `${(totalStaked.muln(10000).div(totalInsurance).toNumber() / 100).toFixed(2)}%`,
        staked: totalStaked.toString(),
        total: totalInsurance.toString()
      });
    }
  }, [totalInsurance, totalStaked]);

  return (
    <SummaryBox>
      <section>
        <CardSummary
          className='ui--media-small'
          label={t('total staked')}
        >
          {
            staked
              ? `${formatBalance(staked, false)}${formatBalance.calcSi(staked).value}`
              : '-'
          }
        </CardSummary>
        <CardSummary
          className='ui--media-small'
          label=''
        >/</CardSummary>
        <CardSummary
          className='ui--media-small'
          label={t('total issuance')}
        >
          {
            total
              ? `${formatBalance(total, false)}${formatBalance.calcSi(total).value}`
              : '-'
          }
        </CardSummary>
      </section>
      <CardSummary
        className='ui--media-small'
        label={t('staked')}
      >
        {percentage}
      </CardSummary>
    </SummaryBox>
  );
}

export default translate(Summary);