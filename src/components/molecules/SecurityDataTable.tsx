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
import { ArrowUpDown, ExternalLink, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import { CollapsibleDataItem } from "@/components/atoms/CollapsibleDataItem";
import Semver from "@/utils/Semver";
import MarkdownBlock from "../atoms/MarkdownBlock";
import InlineCode from "../atoms/InlineCode";
import { generatePgDeepLink } from "@/utils/pgDeepLinks";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type CVEs = PromiseResolver<typeof data>["cves"];

type Props = {
    data: CVEs;
    version: Semver;
};

type CVE = PromiseResolver<typeof data>["cves"][0];
export const columns: ColumnDef<CVE>[] = [
    {
        accessorKey: "cve",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    CVE
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.getValue("cve"),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <CollapsibleDataItem title={row.getValue("title")} isMarkdown={true}>
                <div className="prose prose-sm">
                    <p>
                        Fixed in:{" "}
                        <InlineCode>{row.original.fixedIn}</InlineCode>{" "}
                        {row.original.contributors.length && (
                            <span>
                                Contributor{row.original.contributors.length > 1 && "s"}: {row.original.contributors.join(", ")}
                            </span>
                        )}
                    </p>
                    <MarkdownBlock text={row.original.description} />
                    <p>
                        <a
                            className="ml-2"
                            href={generatePgDeepLink(
                                row.original.fixedIn,
                                row.original.title,
                            )}
                            target="_blank"
                        >
                            View in PostgreSQL Release Notes{" "}
                            <ExternalLink className="inline ml-1 -mt-1 h-4 w-4" />
                        </a>
                        ,
                        <a
                            href={`https://www.cve.org/CVERecord?id=${encodeURIComponent(
                                row.original.cve,
                            )}`}
                            target="_blank"
                        >
                            View on cve.org{" "}
                            <ExternalLink className="inline ml-1 -mt-1 h-4 w-4" />
                        </a>
                    </p>
                </div>
            </CollapsibleDataItem>
        ),
    },
    {
        accessorKey: "severity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Severity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="flex items-center justify-center gap-2">{row.original.impactScore}<Badge variant={['HIGH', 'CRITICAL'].includes(row.getValue('severity')) ? 'destructive' : 'secondary'}>{row.getValue('severity')}</Badge></div>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <a
                                href={generatePgDeepLink(
                                    row.original.fixedIn,
                                    row.original.title,
                                )}
                                target="_blank"
                            >
                                View in PG Docs
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <a
                                href={`https://www.cve.org/CVERecord?id=${encodeURIComponent(
                                    row.original.cve,
                                )}`}
                                target="_blank"
                            >
                                View on CVE.org
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function SecurityDataTable({ data, version }: Props) {
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
                    placeholder="Filter CVEs..."
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
            </div>
        </div>
    );
}
