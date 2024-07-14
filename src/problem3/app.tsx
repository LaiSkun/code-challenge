interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}
interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
    usdValue: number;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const balances = useWalletBalances();
    const prices = usePrices();
    const { ...rest } = props;
    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const formattedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const priority = getPriority(balance.blockchain);
                return priority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                if (leftPriority > rightPriority) {
                    return -1;
                } else if (rightPriority > leftPriority) {
                    return 1;
                }
            })
            .map((balance: WalletBalance) => ({
                ...balance,
                formatted: balance.amount.toFixed(),
                usdValue: prices[balance.currency] * balance.amount,
            }));
    }, [balances, prices]);

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => (
        <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={balance.usdValue}
            formattedAmount={balance.formatted}
        />
    ));

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}