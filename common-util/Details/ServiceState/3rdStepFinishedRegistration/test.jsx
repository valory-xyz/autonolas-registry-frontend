
// import WalletConnect from '@walletconnect/browser';
// import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

// export const walletConnectInit = async () => {
//   // bridge url
//   const bridge = 'https://bridge.walletconnect.org';

//   // create new walletConnector
//   const walletConnector = new WalletConnect({ bridge });

//   window.walletConnector = walletConnector;


//   // check if already connected
//   if (!walletConnector.connected) {
//     // create new session
//     await walletConnector.createSession();

//     // get uri for QR Code modal
//     const { uri } = walletConnector;

//     // console log the uri for development
//     console.log(uri); // tslint:disable-line

//     // display QR Code modal
//     WalletConnectQRCodeModal.open(uri, () => {
//       console.log('QR Code Modal closed'); // tslint:disable-line
//     });
//   }

//   walletConnector.on('connect', async (error, payload) => {
//     console.log('walletConnector.on("connect")'); // tslint:disable-line

//     if (error) {
//       throw error;
//     }

//     console.log(payload);


//     const customRequest = {
//       id: 12374,
//       jsonrpc: '2.0',
//       method: 'gs_multi_send',
//       params: [
//         {
//           to: '0x05c85Ab5B09Eb8A55020d72daf6091E04e264af9',
//           value: '100000000000000000',
//         },
//         {
//           to: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
//           data: '0xa9059cbb00000000000000000000000005c85Ab5B09Eb8A55020d72daf6091E04e264af90000000000000000000000000000000000000000000000000de0b6b3a7640000',
//         },
//       ],
//     };

//     // send message
//     const result = await walletConnector.sendCustomRequest(customRequest);
//     console.log(result);
//   });
// };
