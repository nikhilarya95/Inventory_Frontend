import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    itemsPerPageOptions?: number[];
    type?: 'table' | 'card';
}

export function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions,
    type = 'table'
}: PaginationProps) {
    const defaultOptions = type === 'table' ? [10, 20, 50, 100] : [6, 9, 12, 24];
    const options = itemsPerPageOptions || defaultOptions;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <Select
                    value={itemsPerPage.toString()}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    options={options.map(opt => ({ value: opt.toString(), label: opt.toString() }))}
                    className="w-20"
                />
                <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Page info and navigation */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                    Showing {totalItems === 0 ? 0 : startItem} to {endItem} of {totalItems} entries
                </span>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
                        Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canGoNext}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
