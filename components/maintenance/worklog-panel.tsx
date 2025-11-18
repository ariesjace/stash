'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WorklogEntry } from './worklog-entry';

interface Asset {
  _id: string;
  assetTag: string;
  brand?: string;
  model?: string;
}

interface Worklog {
  _id: string;
  comment: string;
  createdAt: Date;
}

interface WorklogPanelProps {
  asset: Asset;
  initialWorklogs?: Worklog[];
}

export function WorklogPanel({ asset, initialWorklogs = [] }: WorklogPanelProps) {
  const [worklogs, setWorklogs] = useState<Worklog[]>(initialWorklogs);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [comment, setComment] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/backend/maintenance/fetch-logs?assetId=${asset._id}`);
      const json = await res.json();
      setWorklogs(json.data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    setComment('');
    setAdding(false);
  }, [asset._id]);

  const handleAddLog = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch('/api/backend/maintenance/add-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset._id, comment }),
      });
      const json = await res.json();
      setWorklogs([json.data, ...worklogs]);
      setComment('');
      setAdding(false);
    } catch (err) {
      console.error('Error adding log:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{asset.assetTag}</h2>
          <p className="text-sm text-muted-foreground">{asset.brand} {asset.model}</p>
        </div>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          {adding ? 'Cancel' : '+ Add Log'}
        </Button>
      </div>

      {adding && (
        <Card className="bg-gray-50 dark:bg-gray-900 p-4 space-y-3 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <Textarea
            placeholder="Enter maintenance log..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddLog}>Submit</Button>
          </div>
        </Card>
      )}

      <Separator />

      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading worklogs...</p>
        ) : worklogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No logs yet.</p>
        ) : (
          worklogs
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((log) => <WorklogEntry key={log._id} {...log} />)
        )}
      </div>
    </div>
  );
}
