import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  // Connection, Keypair,
  PublicKey, TransactionMessage, VersionedTransaction,
} from '@solana/web3.js';
import {
  SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY,
  SVM_STORAGE_ACCOUNT_PUBLIC_KEY,
} from 'common-util/Contracts/addresses';
import { Button } from 'antd';

const programId = new PublicKey(SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY);

export default function ViewButton() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  const onClick = async () => {
    if (!publicKey || !program) return;

    // const [pda] = PublicKey.findProgramAddressSync(
    //   [Buffer.from('seed'), publicKey.toBuffer()],
    //   program.programId,
    // );
    const pda = SVM_STORAGE_ACCOUNT_PUBLIC_KEY;

    // Build the instruction
    const ix = await program.methods
      .totalSupply()
      .accounts({ dataAccount: pda })
      .instruction();

    const data = await connection.getLatestBlockhash();

    console.log({ ix, data, program });

    // Build a versioned transaction with the instruction
    const msg = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: data.blockhash,
      instructions: [ix],
    }).compileToV0Message();

    const tx = new VersionedTransaction(msg);

    // Simulate the transaction.
    const transactionSimulation = await connection.simulateTransaction(tx);
    console.log(transactionSimulation);

    // If value is "0", then return data returns null, so can't use this for bool
    if (transactionSimulation.value.returnData?.data) {
      console.log(transactionSimulation.value.returnData.data[0]);
    }

    // Log all the transaction logs.
    const transactionLogs = transactionSimulation.value.logs;
    console.log({ transactionLogs });

    // As workaround to avoid null return data when value is "0"
    // Extract the program return data directly from the logs.
    // Find log entry that starts with "Program return:"
    const returnPrefix = `Program return: ${program.programId} `;
    console.log({ returnPrefix });

    const returnLogEntry = transactionLogs?.find((log) => log.startsWith(returnPrefix));
    console.log({ returnLogEntry });

    if (returnLogEntry) {
      // Slice out the prefix to get the base64 return data
      const encodedReturnData = returnLogEntry.slice(returnPrefix.length);
      console.log({ encodedReturnData });

      // Convert the Base64 return data
      const decodedBuffer = Buffer.from(encodedReturnData, 'base64');
      console.log({ decodedBuffer });
      console.log('decodedBuffer ', decodedBuffer[0]);
    }
  };

  return <Button onClick={onClick}>Load Service Total</Button>;
}
