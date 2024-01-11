import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Program, AnchorProvider,
  // BorshAccountsCoder,
  BorshCoder,
  //  BorshInstructionCoder,
} from '@project-serum/anchor';
// import { u32, u8, struct } from '@solana/buffer-layout';
// import { publicKey, u64, bool } from '@solana/buffer-layout-utils';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  // Connection, Keypair,
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

// export const MintLayout = struct([
//   u8('mintAuthorityOption'),
//   publicKey('mintAuthority'),
//   u64('supply'),
//   u8('decimals'),
//   bool('isInitialized'),
//   u32('freezeAuthorityOption'),
//   publicKey('freezeAuthority'),
// ]);

// deseralize the program data using borsh
const deseralizeProgramData = (data) => {
  /**
   * contains the struct of the service
   * @example
   * { name: "serviceOwner", type: "publicKey" },
   * { name: "securityDeposit", type: "u64" },
   */
  // const serviceType = idl.types.find((t) => t.name === 'Service').type;

  // create a struct for the service using the serviceType
  // const Service = struct(serviceType);

  // create a borsh coder for the service
  const serviceCoder = new BorshCoder(idl);
  const dataaaa = serviceCoder.types.decode('Service', data);

  console.log({ dataaaa });

  // const serviceType = idl.types.decode('ServiceType', decodedData.serviceType);
  // console.log({ serviceType });

  // const borshedData = idl.types.decode('ServiceRegistryData', data);
  // console.log({ decodedData });
};

export default function ViewButton() {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  const onClick = async () => {
    console.log({
      publicKey,
      program,
    });

    if (!publicKey || !program) return;

    // Build the instruction
    const instruction = await program.methods
      // .totalSupply()
      .getService(1)
      .accounts({ dataAccount: SVM_STORAGE_ACCOUNT_PUBLIC_KEY })
      .instruction();

    const latestBlock = await connection.getLatestBlockhash();

    console.log({ instruction, latestBlock, program });

    // Build a versioned transaction with the instruction
    const txMessage = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: latestBlock.blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    const tx = new VersionedTransaction(txMessage);

    // Simulate the transaction.
    const transactionSimulation = await connection.simulateTransaction(tx);
    console.log(transactionSimulation);

    // If value is "0", then returnData returns null, so can't use this for bool
    if (transactionSimulation.value.returnData?.data) {
      console.log(
        'actual returnedData',
        transactionSimulation.value.returnData.data[0],
      );
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
      console.log('decodedBuffer ===>>> ', decodedBuffer);
      deseralizeProgramData(decodedBuffer);
      // console.log('decodedBuffer.toString ===>>> ', decodedBuffer);
      console.log('first decodedBuffer - ', decodedBuffer[0]);
    }
  };

  return <Button onClick={onClick}>Load Service Total</Button>;
}
