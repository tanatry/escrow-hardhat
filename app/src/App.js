import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import AddressCreateEscrow from './artifacts/contracts/AddressCreateEscrow.sol/AddressCreateEscrow.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const addrCreateEscrow = new ethers.Contract(
  '0xd8c01cb16b49f37575d56a1f479dbfa663fb60e3',
  AddressCreateEscrow.abi,
  provider
);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();

}



function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [balance, setBalance] = useState();

  async function getTransaction() {
    const addr = await addrCreateEscrow.connect(signer).getEscrowByaddress();
    console.log(addr);
    const escrowsArray = [];
    for (let index = 0; index < addr.length; index++) {
      const escrow = {
        address: addr[index].contractAddress,
        arbiter: addr[index].arbiter,
        beneficiary: addr[index].beneficiary,
        value: ethers.utils.formatEther(parseInt(addr[index].value._hex, 16).toLocaleString('fullwide', { useGrouping: false })),
        handleApprove: async () => {
          addr[index].on('Approved', () => {
            document.getElementById(addr[index]).className =
              'complete';
            document.getElementById(addr[index]).innerText =
              "✓ It's been approved!";
          });

          await approve(addr[index], signer);
        },
      };
      escrowsArray.push(escrow);
    }
    setEscrows(escrowsArray);
  }

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    async function getBalance() {
      const balanceInWei = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(parseInt(balanceInWei._hex, 16).toLocaleString('fullwide', { useGrouping: false })))
    }



    getAccounts();
    getBalance();
    getTransaction();

  }, [account, balance,]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    // const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const value = ethers.utils.parseUnits(document.getElementById('wei').value, 'ether');
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    await escrowContract.deployed();
    console.log(escrowContract.address);
    // const createContracr = await addrCreateEscrow.saveEscorw(escrowContract.address);
    const createContracr = await addrCreateEscrow.connect(signer).saveEscorw(escrowContract.address, arbiter, beneficiary, value);
    await createContracr.wait();



    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    getTransaction();
    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <div className="contract">
          <h1> New Contract </h1>
          <label>
            Arbiter Address
            <input type="text" id="arbiter" />
          </label>

          <label>
            Beneficiary Address
            <input type="text" id="beneficiary" />
          </label>

          <label>
            Deposit Amount (in Wei)
            <input type="text" id="wei" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Deploy
          </div>
        </div>

        <div className="existing-contracts">
          <h1> Existing Contracts </h1>

          <div id="container">
            <label>address: {account}</label>
            <label>Balance: {balance}</label>
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
