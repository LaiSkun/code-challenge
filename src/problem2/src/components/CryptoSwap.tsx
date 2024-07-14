import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { message, Modal } from 'antd';

import { HiArrowsUpDown } from "react-icons/hi2";
import { FaAngleDown } from 'react-icons/fa';

import SearchCrypto from './SearchCrypto';
import data from '../data/cryptos.json';

const CryptoSwap = () => {
    const [isOpenFristToken, setIsOpenFristToken] = useState(false);
    const [isOpenSecondToken, setIsOpenSecondToken] = useState(false);
    const [error, setError] = useState('')
    const [isError, setIsError] = useState(false)
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);

    const [firstToken, setFirstToken] = useState(() => {
        const storedTokenName = new URLSearchParams(window.location.search).get('firstToken');
        const storedToken = data.filter(item =>
            item.token.includes(storedTokenName!)
        )[0];
        return storedToken
            ? storedToken
            : { token: 'ETH', icon: './cryptos/eth.svg', price: 70 };
    });
    const [secondToken, setSecondToken] = useState(() => {
        const storedTokenName = new URLSearchParams(window.location.search).get('secondToken');
        if (storedTokenName === '') return { token: 'Select a token', icon: './cryptos/btg.svg', price: 0 };
        const storedToken = data.filter(item =>
            item.token.includes(storedTokenName!)
        )[0];
        return storedToken
            ? storedToken
            : { token: 'Select a token', icon: './cryptos/btg.svg', price: 0 };
    });

    const [fistValue, setFistValue] = useState(0);
    const [secondValue, setSecondValue] = useState(0);

    const [messageApi, contextHolder] = message.useMessage();

    const { firstTokenParam, secondTokenParam } = useParams();

    const firstTokenRef = useRef<HTMLInputElement>(null);
    const secondTokenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (firstTokenParam && secondTokenParam) {
            const newFirstToken = data.filter(item =>
                item.token.includes(firstTokenParam)
            )[0];
            setFirstToken(newFirstToken);
            const newSecondToken = data.filter(item =>
                item.token.includes(secondTokenParam)
            )[0];
            setSecondToken(newSecondToken);
        }
    }, [firstTokenParam, secondTokenParam]);

    useEffect(() => {
        // Update the URL parameters when the token values change
        updateUrlParams();

        if (firstToken.token === 'Select a token') firstTokenRef.current?.setAttribute('disabled', 'true');
        else firstTokenRef.current?.removeAttribute('disabled');
        if (secondToken.token === 'Select a token') secondTokenRef.current?.setAttribute('disabled', 'true');
        else secondTokenRef.current?.removeAttribute('disabled');

    }, [firstToken, secondToken]);

    const updateUrlParams = () => {
        // Update the URL parameters with the current token values
        const urlParams = new URLSearchParams(window.location.search);
        if (firstToken.token !== 'Select a token') urlParams.set('firstToken', firstToken.token);
        if (secondToken.token !== 'Select a token') urlParams.set('secondToken', secondToken.token);
        window.history.replaceState({}, '', `?${urlParams.toString()}`);
    };

    const onClose = () => {
        setIsOpenFristToken(false)
        setIsOpenSecondToken(false)
    }

    const setFToken = (token: string, icon: string, price: number) => {
        setFirstToken({ token: token, icon: icon, price: price });
        setFistValue(Number((secondValue * secondToken.price / price).toFixed(5)))
        onClose();
    }

    const setSToken = (token: string, icon: string, price: number) => {
        setSecondToken({ token: token, icon: icon, price: price });
        setSecondValue(Number((fistValue * firstToken.price / price).toFixed(5)))
        onClose();
    }

    const onChangeFirstToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFistValue(Number(e.target.value));
        setSecondValue(Number((Number(e.target.value) * firstToken.price / secondToken.price).toFixed(5)));
    }

    const onChangeSecondToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecondValue(Number(e.target.value));
        setFistValue(Number((Number(e.target.value) * secondToken.price / firstToken.price).toFixed(5)));
    }

    const success = () => {
        setIsOpenConfirm(false);
        messageApi.open({
            type: 'success',
            content: 'Swap success!!!',
        });
    }

    const changeToken = () => {
        setFirstToken(secondToken);
        setFistValue(secondValue);
        setSecondToken(firstToken);
        setSecondValue(fistValue);
    }

    useEffect(() => {
        if (fistValue < 0 || secondValue < 0) {
            setError("Your pay or your recieve cannot under 0")
            setIsError(true)
        }
        else {
            setError('')
            setIsError(false)
        }
    }, [fistValue, secondValue]);

    return (
        <div className="w-[480px] h-[320px] p-1 rounded-lg border border-blue-300 mx-auto mt-[250px]">
            {
                isOpenFristToken
                &&
                <SearchCrypto
                    key={1}
                    open={isOpenFristToken}
                    onClose={onClose}
                    setToken={(token, icon, price) => { setFToken(token, icon, price) }} />
            }
            <div className="w-full p-2 h-[150px] bg-gray-100 rounded-lg mb-2">
                <span className="text-gray-400 left-2"> You pay </span>
                <div className="flex justify-between mt-2 mx-2">
                    <input
                        placeholder='0'
                        size={5}
                        ref={firstTokenRef}
                        type="number"
                        className="w-[200px] text-[30px] bg-transparent focus:outline-none"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        onChange={onChangeFirstToken}
                        value={fistValue.toString()}
                    />

                    <div
                        className="flex p-2 rounded-full bg-white font-medium text-[20px] hover: cursor-pointer hover:bg-gray-200"
                        onClick={() => setIsOpenFristToken(true)}>
                        <img src={firstToken.icon} alt={firstToken.token} />
                        <span className="ml-2">{firstToken.token}</span>
                        <FaAngleDown className="mt-2 ml-1" />
                    </div>
                </div>
                <div>
                    <span className="ml-3 text-gray-400 ">
                        {fistValue != 0 && firstToken.price != 0 && `$${fistValue * firstToken.price}`}
                    </span>
                    <br />
                    <span className="ml-3 text-red-400">{error}</span>
                </div>
            </div>

            <div
                className="fixed ml-[210px] -mt-5 bg-white rounded-md"
                onClick={changeToken}>
                <div className=" hover: cursor-pointer m-1 p-2 bg-gray-100 z-[999] rounded-md hover:bg-gray-200 text-[20px]">
                    <HiArrowsUpDown />
                </div>
            </div>

            {
                isOpenSecondToken
                &&
                <SearchCrypto
                    key={2}
                    open={isOpenSecondToken}
                    onClose={onClose}
                    setToken={(token, icon, price) => { setSToken(token, icon, price) }} />
            }

            <div className="w-full p-2 h-[150px] bg-gray-100 rounded-lg">
                <span className="text-gray-400 left-2"> You recieve </span>
                <div className="flex justify-between mt-2 mx-2">
                    <input
                        placeholder='0'
                        size={15}
                        ref={secondTokenRef}
                        type="number"
                        className="w-[200px] text-[30px] bg-transparent focus:outline-none"
                        onChange={onChangeSecondToken}
                        value={secondValue.toString()}
                    />

                    <div
                        className="flex p-2 rounded-full bg-white font-medium text-[20px] hover: cursor-pointer hover:bg-gray-200"
                        onClick={() => setIsOpenSecondToken(true)}>
                        <img src={secondToken.icon} alt={secondToken.token} />
                        <span className="ml-2">{secondToken.token}</span>
                        <FaAngleDown className="mt-2 ml-1" />
                    </div>
                </div>
                <div>
                    <span className="ml-3 text-gray-400 ">
                        {(secondValue != 0 && secondToken.price != 0) && `$${secondValue * secondToken.price}`}
                    </span>
                    <br />
                    <span className="ml-3 text-red-400">{error}</span>
                </div>

            </div>
            {contextHolder}
            <button
                className="w-full h-[55px] bg-pink-100 text-center items-center mt-2 rounded-lg font-medium text-[22px] text-pink-600 hover:bg-pink-200"
                disabled= {isError}
                onClick={() => setIsOpenConfirm(true)}
            >
                Swap
            </button>

            <Modal
                title="Confirm"
                open={isOpenConfirm}
                onOk={success}
                onCancel={() => setIsOpenConfirm(false)}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you really swap?</p>
            </Modal>
        </div>
    );
}

export default CryptoSwap;
