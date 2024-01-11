import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BorshCoder } from '@project-serum/anchor';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY,
  SVM_STORAGE_ACCOUNT_PUBLIC_KEY,
} from 'common-util/Contracts/addresses';
import { Button } from 'antd';

const programId = new PublicKey(SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY);

/**
 * deseralize the program data
 * @xample
 * serializedValue = Uint8Array(32) [0, 0, ...]
 * @returns {object} deseralized program data
 * example: { name: "serviceOwner", type: "publicKey" },
 *
 */
const deseralizeProgramData = (serializedValue, decodeTypeName) => {
  const borshCoder = new BorshCoder(idl);
  const decodedResult = borshCoder.types.decode(
    decodeTypeName,
    serializedValue,
  );
  return decodedResult;
};

/**
 * hook to get svm info
 * @returns {object} publicKey, connection, program
 */
const useSvmInfo = () => {
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  return { publicKey, connection, program };
};

const useSvmData = () => {
  const { publicKey, connection, program } = useSvmInfo();

  const getData = useCallback(
    async (fn, fnArgs, decodeTypeName = 'Service') => {
      if (!fn) {
        throw new Error('function name is required');
      }

      if (!publicKey || !program) return null;

      const latestBlock = await connection.getLatestBlockhash();

      const instruction = await program.methods[fn](...(fnArgs || []))
        .accounts({ dataAccount: SVM_STORAGE_ACCOUNT_PUBLIC_KEY })
        .instruction();

      const txMessage = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlock.blockhash,
        instructions: [instruction],
      }).compileToV0Message();

      const tx = new VersionedTransaction(txMessage);

      const transactionSimulation = await connection.simulateTransaction(tx);

      const transactionLogs = transactionSimulation.value.logs;

      const returnPrefix = `Program return: ${program.programId} `;
      const returnLogEntry = transactionLogs?.find((log) => log.startsWith(returnPrefix));

      if (returnLogEntry) {
        const encodedReturnData = returnLogEntry.slice(returnPrefix.length);
        const decodedBuffer = Buffer.from(encodedReturnData, 'base64');

        const finalResult = deseralizeProgramData(
          decodedBuffer,
          decodeTypeName,
        );

        window.console.log({ finalResult }); // TODO: remove

        return finalResult;
      }

      return null;
    },
    [publicKey, program, connection],
  );

  return { getData };
};

export default function ViewButton() {
  const { getData } = useSvmData();

  const handleClick = useCallback(() => {
    getData('getService', [1], 'Service');
  }, [getData]);

  return <Button onClick={handleClick}>Load Service Total</Button>;
}
