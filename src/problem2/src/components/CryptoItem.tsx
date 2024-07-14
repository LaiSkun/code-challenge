interface CryptoItemProps {
    currency: string,
    token: string,
    icon: string,
    price: number,
    setToken: (token:string, icon:string, price:number) => void,
}

const CryptoItem: React.FC<CryptoItemProps> = ({
    currency,
    token,
    icon,
    price,
    setToken,
}) => {
    return (
        <div
            className="p-3 w-full h-[50px] rounded-md hover:bg-gray-100 hover:cursor-pointer items-center flex"
            onClick={() => setToken(token, icon, price) }>
            <img src={icon} alt="etherium" width={35} />
            <div className="flex justify-between">
                <div className="flex flex-col ml-2">
                    <span className="text-[17px]"> {currency}</span>
                    <span className="text-gray-400"> {token}</span>
                </div>
                <div className="text-[20px] font-light text-gray-400 absolute ml-[200px] items-center">
                    ${price}
                </div>
            </div>
        </div>
    );
}

export default CryptoItem;