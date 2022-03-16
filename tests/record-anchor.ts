import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RecordAnchor } from "../target/types/record_anchor";

describe("record-anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.RecordAnchor as Program<RecordAnchor>;

  it("initializing the storage account ", async () => {
    // Add your test here.
    const recordAccount = anchor.web3.Keypair.generate();
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
  });
});