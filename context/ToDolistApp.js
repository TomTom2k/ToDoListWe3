import React, { createContext, useEffect, useMemo, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import { toDoListAddress, toDoListABI } from './constants';

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(toDoListAddress, toDoListABI, signerOrProvider);

export const ToDoListContext = createContext();

export const ToDoListProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [error, setError] = useState('');
	const [allToDoList, setAllToDoList] = useState([]);
	const [myList, setMyList] = useState([]);

	const [allAddress, setAllAddress] = useState([]);

	// ________________CONNECTING METAMASK
	const checkIfWalletIsConnect = async () => {
		if (!window.ethereum) return setError('Please install MeTamask');
		const account = await window.ethereum.request({
			method: 'eth_accounts',
		});
		if (account.length) {
			setCurrentAccount(account[0]);
			console.log(account[0]);
		} else {
			setError('Please Install MetaMask & connect, reload');
			console.log(error);
		}
	};

	// ________________________CONNECT WALLET
	const connectWallet = async () => {
		if (!window.ethereum) return setError('Please install MeTamask');
		const account = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});

		setCurrentAccount(account[0]);
	};

	// INTRACTING WITH SMART CONTRACT
	const toDoList = async (message) => {
		try {
			// CONNNECTING WITH SMART CONTRACT
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = await fetchContract(signer);

			const createList = await contract.createList(message);
			createList.wait();
			console.log(createList);
		} catch (error) {
			setError('Something wrong crating list');
			console.log(error);
		}
	};

	const getToDoList = async () => {
		try {
			// CONNNECTING WITH SMART CONTRACT
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = await fetchContract(signer);
			// console.log(contract);

			// GET DATA
			const getAllAddress = await contract.getAddress();
			setAllAddress(getAllAddress);
			console.log(getAllAddress);

			getAllAddress.map(async (el) => {
				const getSingleData = await contract.getCreatorData(el);
				allToDoList.push(getSingleData);
				console.log(getSingleData);
			});

			const allMessage = await contract.getMessage();
			setMyList(allMessage);
		} catch (error) {
			setError('Something wrong getting data');
			console.log(error);
		}
	};

	// CHANGE STATE OF TODOLIST TO FALSE TO TRUE
	const change = async () => {
		try {
			// CONNNECTING WITH SMART CONTRACT
			const web3modal = new Web3Modal();
			const connection = await web3modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = await fetchContract(signer);

			const state = await contract.toggle(address);
			state.wait();
			console.log(state);
		} catch (error) {
			setError('Something wrong change status');
		}
	};

	const contextValue = useMemo(
		() => ({
			checkIfWalletIsConnect,
			connectWallet,
			getToDoList,
			toDoList,
			change,
			currentAccount,
			error,
			allToDoList,
			myList,
			allAddress,
		}),
		[checkIfWalletIsConnect, connectWallet, getToDoList, toDoList, change]
	);

	return (
		<ToDoListContext.Provider value={contextValue}>
			{children}
		</ToDoListContext.Provider>
	);
};
