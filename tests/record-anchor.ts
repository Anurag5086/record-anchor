import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RecordAnchor } from "../target/types/record_anchor";

describe("record-anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.RecordAnchor as Program<RecordAnchor>;
  
  const initializeStorageAccount = async (recordAccount, data) => {


    // let offset = new anchor.BN(300000 * 1e8);

    // const tx1 = await program.rpc.write(offset, Buffer.from(data),{
    //   accounts: {
    //     recordAccount: recordAccount.publicKey,
    //     authority: provider.wallet.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId
    //   },
    //   signers: [recordAccount]
    // })
  }

  it("initializing the storage account ", async () => {
    // Add your test here.
    const recordAccount = anchor.web3.Keypair.generate();
    
    // await initializeStorageAccount(recordAccount, uint8)
    const tx = await program.rpc.initialize({
      accounts: {
        recordAccount: recordAccount.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [recordAccount]
    });

    const account = await program.account.recordData.fetch(recordAccount.publicKey) as any;
    
    console.log(account.authority + " " + account.version)
    // const buffer = new ArrayBuffer(8);
    let bytes = Uint8Array.from([0xf0, 0x9f, 0x90, 0x86, 0x86, 0x86, 0x86, 0x86]);

    // var data = new Uint8Array(8);
    // bytes[0] = 1;
    // bytes[1] = 2;

    let offset = new anchor.BN(3 * 1e8);
    console.log(bytes)
    console.log(bytes + "" + offset)

    const tx1 = await program.rpc.write(offset, Buffer.from(bytes),{
      accounts: {
        recordAccount: recordAccount.publicKey,
        authority: account.authority,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [account.authority]
    });
  });
});