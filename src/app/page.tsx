"use client";

import { useEffect, useState } from "react";
import { Block } from "hardhat/src/internal/core/jsonrpc/types/output";
import { Alchemy, Network } from '@alch/alchemy-sdk';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

export default function Home() {
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [alchemy, setAlchemy] = useState<Alchemy | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
      setAlchemy(new Alchemy(settings));
    } else {
      console.error("Alchemy API key is missing. Please set NEXT_PUBLIC_ALCHEMY_API_KEY in your environment variables.");
      setConnectionStatus(false);
    }
  }, []);

  useEffect(() => {
    const fetchLatestBlocks = async () => {
      if (!alchemy) {
        console.warn("Alchemy is not initialized. Skipping fetch.");
        return;
      }
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        const blockNumbers = Array.from({ length: 10 }, (_, i) => latestBlockNumber - i);

        const blocks = await Promise.all(
          blockNumbers.map(number => alchemy!.core.getBlock(number))
        );

        setLatestBlocks(blocks as Block[]);
        setConnectionStatus(true);
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
        setConnectionStatus(false);
      }
    };

    fetchLatestBlocks();
  }, [alchemy]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Block Explorer Lite</h1>
      <ConnectionStatusIndicator isConnected={connectionStatus} />
      <BlockList blocks={latestBlocks} />
    </div>
  );
}

function ConnectionStatusIndicator({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="mb-4">
      Connection Status:{" "}
      {isConnected ? (
        <Badge variant="outline">Connected</Badge>
      ) : (
        <Badge variant="destructive">Disconnected</Badge>
      )}
    </div>
  );
}

function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <Table>
      <TableCaption>Latest Blocks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Block Number</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Transactions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocks.map((block) => (
          <BlockListItem key={block.number} block={block} />
        ))}
      </TableBody>
    </Table>
  );
}

function BlockListItem({ block }: { block: Block }) {
  return (
    <TableRow>
      <TableCell>{block.number}</TableCell>
      <TableCell>{new Date(block.timestamp * 1000).toLocaleString()}</TableCell>
      <TableCell>{block.transactions.length}</TableCell>
    </TableRow>
  );
}
