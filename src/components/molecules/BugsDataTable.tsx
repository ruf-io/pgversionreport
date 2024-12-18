import data from "@/data/pg_release_data";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CollapsibleDataItem } from "@/components/atoms/CollapsibleDataItem";
import Semver from "@/utils/Semver";
import MarkdownBlock from "../atoms/MarkdownBlock";
import InlineCode from "../atoms/InlineCode";
import { generatePgDeepLink } from "@/utils/pgDeepLinks";
import Paginator from "../atoms/Paginator";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Bugs = PromiseResolver<typeof data>["bugs"];

type Props = {
    data: Bugs;
    version: Semver;
};

type Bug = PromiseResolver<typeof data>["bugs"][0];
export const columns: ColumnDef<Bug>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <CollapsibleDataItem
                title={row.getValue("title")}
                isMarkdown={true}
            >
                <div className="prose prose-sm">
                    <p>
                        Fixed in:{" "}
                        <InlineCode>{row.original.fixedIn}</InlineCode>{" "}
                        {row.original.contributors.length > 0 && (
                            <span>
                                Contributor
                                {row.original.contributors.length > 1 &&
                                    "s"}: {row.original.contributors.join(", ")}
                            </span>
                        )}
                    </p>
                    <MarkdownBlock text={row.original.description} />
                    <p>
                        <a
                            href={generatePgDeepLink(
                                row.original.fixedIn,
                                row.original.title,
                            )}
                            target="_blank"
                        >
                            View in PG Docs{" "}
                            <ExternalLink className="inline h-4 w-4" />
                        </a>
                    </p>
                </div>
            </CollapsibleDataItem>
        ),
    },
];

export function BugsDataTable({ data, version }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Bugs..."
                    value={
                        (table
                            .getColumn("title")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("title")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Paginator table={table} />
            </div>
        </div>
    );
}
