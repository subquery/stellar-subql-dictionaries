import { Transaction, Operation, Effect } from "../types";
import {
  StellarBlock,
  StellarOperation,
  StellarEffect,
  StellarTransaction,
} from "@subql/types-stellar";

export async function handleBlock(ledger: StellarBlock): Promise<void> {
  const txRecords = ledger.transactions.map(getTransactionRecord);
  const opRecords = ledger.operations.map(getOperationRecord);
  const effectRecords = ledger.effects.map(getEffectRecord);

  await store.bulkCreate('Transaction', txRecords);
  await store.bulkCreate('Operation', opRecords);
  await store.bulkCreate('Effect', effectRecords);
}

function getTransactionRecord(tx: StellarTransaction): Transaction {
  return Transaction.create({
    id: tx.id,
    blockHeight: BigInt(tx.ledger.sequence),
    account: tx.source_account
  })
}

function getOperationRecord(op: StellarOperation): Operation {
  return Operation.create({
    id: op.id,
    blockHeight: BigInt(op.ledger.sequence),
    sourceAccount: op.source_account,
    type: op.type
  })
}

function getEffectRecord(effect: StellarEffect): Effect {
  return Effect.create({
    id: effect.id,
    blockHeight: BigInt(effect.ledger.sequence),
    type: effect.type,
    account: effect.account
  })
}
