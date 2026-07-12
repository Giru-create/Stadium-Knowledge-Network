'use client';



import React, { useState, lazy, Suspense } from 'react';
import Head from 'next/head';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

// Lazy‑loaded components (default exports)
const StadiumCard = lazy(() => import('@/components/stadiums/StadiumCard'));
const StadiumForm = lazy(() => import('@/components/stadiums/StadiumForm'));
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Stadium } from '@/types';


export default function StadiumsPage() {
  const { stadiums, loading, addStadium } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddStadium = async (stadiumData: Omit<Stadium, 'id'>) => {
    setSubmitting(true);
    setError('');
    try {
      await addStadium(stadiumData);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add stadium');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Stadium Directory – SKN</title>
        <meta name="description" content="Browse and manage stadiums in the Stadium Knowledge Network." />
      </Head>
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">Stadium Directory</h2>
              <p className="text-sm text-slate-400 mt-1">
                Browse all connected venues in the Stadium Knowledge Network (SKN).
              </p>
            </div>
            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Stadium
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton className="h-80" />
              <LoadingSkeleton className="h-80" />
              <LoadingSkeleton className="h-80" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stadiums.map((stadium) => (
  <Suspense key={stadium.id} fallback={<LoadingSkeleton className="h-80" />}> 
    <StadiumCard stadium={stadium} />
  </Suspense>
))}
            </div>
          )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Stadium">
              {error && (
                <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-4">
                  ⚠️ {error}
                </div>
              )}
              <Suspense fallback={<LoadingSkeleton className="h-20" />}>
                <StadiumForm onSubmit={handleAddStadium} loading={submitting} />
              </Suspense>
            </Modal>
        </div>
      </DashboardLayout>
    </>
  );
}
