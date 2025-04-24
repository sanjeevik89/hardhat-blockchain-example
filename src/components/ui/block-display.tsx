"use client";

import { useEffect, useState } from "react";
import { Block } from "hardhat/src/internal/core/jsonrpc/types/output";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

interface BlockDisplayProps {
  block: Block;
}

const BlockDisplay: React.FC<BlockDisplayProps> = ({ block }) => {
  return (
    <div>
      <h2>Block #{block.number}</h2>
      <p>Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}</p>
      <p>Hash: {block.hash}</p>
      <p>Transactions: {block.transactions.length}</p>

      {block.transactions.length > 0 && (
        <TransactionList transactions={block.transactions} />
      )}
    </div>
  );
};

interface TransactionListProps {
  transactions: string[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <Table>
      <TableCaption>Transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Hash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txHash) => (
          <TableRow key={txHash}>
            <TableCell>{txHash}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BlockDisplay;
