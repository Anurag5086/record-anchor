import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RecordAnchor } from "../target/types/record_anchor";

describe("record-anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.RecordAnchor as Program<RecordAnchor>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
