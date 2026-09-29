'use client';

import { useActionState, type ReactNode } from 'react';
import type { LibraryStatus, MediaType } from '@prisma/client';
import {
  STATUS_BADGE_STYLES,
  STATUS_LABELS,
  getInProgressLabel,
} from '@/app/library/_components/LibraryCard';
import { addToLibraryAction, type AddToLibraryState } from '../actions';

const initialState: AddToLibraryState = { status: 'idle' };

const TRAY_STATUSES: LibraryStatus[] = [
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'ON_HOLD',
  'DROPPED',
];

function getStatusLabel(status: LibraryStatus, mediaType: MediaType) {
  return status === 'IN_PROGRESS'
    ? getInProgressLabel(mediaType)
    : STATUS_LABELS[status];
}

export default function AddToLibraryTray({
  id,
  source,
  mediaType,
  typeLabel,
  libraryStatus,
  children,
}: {
  id: string;
  source: 'OMDB' | 'GOOGLE_BOOKS';
  mediaType: MediaType;
  typeLabel: string;
  libraryStatus?: LibraryStatus;
  children: ReactNode;
}) {
  const boundAction = addToLibraryAction.bind(null, id, source);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState
  );

  const currentStatus =
    state.status === 'success' ? state.libraryStatus : libraryStatus;

  return (
    <>
      <div
        className={`absolute top-2 left-0.5 rounded-md px-1 py-0.5 font-mono text-[10.5px] font-medium tracking-wide text-white ${
          currentStatus ? STATUS_BADGE_STYLES[currentStatus] : 'bg-black/50'
        }`}
      >
        {(currentStatus
          ? getStatusLabel(currentStatus, mediaType)
          : typeLabel
        ).toUpperCase()}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col">
        <div className="px-1.5 pb-1.5">{children}</div>
        {!currentStatus && (
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <form
                action={formAction}
                aria-label="Add to library as"
                className="grid grid-cols-2 gap-1 bg-black/70 p-1.5"
              >
                {TRAY_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="submit"
                    name="status"
                    value={s}
                    disabled={pending}
                    className={`rounded-md px-1 py-1.5 font-mono text-[10.5px] font-medium tracking-wide text-white hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 ${
                      STATUS_BADGE_STYLES[s]
                    } ${s === 'DROPPED' ? 'col-span-2' : ''}`}
                  >
                    {getStatusLabel(s, mediaType).toUpperCase()}
                  </button>
                ))}
                {state.status === 'error' && (
                  <p className="col-span-2 text-[10px] text-red-300">
                    {state.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
